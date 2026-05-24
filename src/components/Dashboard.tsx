// Dashboard.tsx

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Layout from "../components/layout/Layout";
import Sidebar from "../components/layout/Sidebar";
import TerminalTabs from "../components/TerminalTabs";
import Terminal from "../components/Terminal";
import ConnectForm from "./ConnectForm";

import { getToken, isAdmin } from "../utils/auth";

import type {
    Connection,
    Status,
    Tab,
} from "./types";

import {
    getServerKey,
} from "./types";
import AdminPanel from "./AdminPanel";

type View =
    | "empty"
    | "overview"
    | "terminal"
    | "admin";

export default function Dashboard() {
    const socketRef =
        useRef<WebSocket | null>(null);

    const [searchParams] =
        useSearchParams();

    const admin = isAdmin();

    const openAdmin = () => {
        setView("admin");
    };

    const [status, setStatus] =
        useState<Status>("idle");

    const [connections, setConnections] =
        useState<Connection[]>([]);

    const [selected, setSelected] =
        useState<Connection | null>(null);

    const [tabs, setTabs] =
        useState<Tab[]>([]);

    const [activeTabId, setActiveTabId] =
        useState<string | null>(null);

    const [view, setView] =
        useState<View>("empty");

    const [showForm, setShowForm] =
        useState(false);

    const activeTab = tabs.find(
        (t) => t.id === activeTabId
    );

    const activeServerKey =
        activeTab?.serverKey ||
        (selected
            ? getServerKey(selected)
            : null);

    const visibleTabs = tabs.filter(
        (t) =>
            t.serverKey ===
            activeServerKey
    );

    useEffect(() => {
        if (
            searchParams.get("new") ===
            "true"
        ) {
            setShowForm(true);
        }
    }, []);

    useEffect(() => {
        const load = async () => {
            const token =
                getToken();

            const res =
                await fetch(
                    "http://127.0.0.1:8000/sessions/",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            if (!res.ok) return;

            const data =
                await res.json();

            setConnections(
                Array.isArray(data)
                    ? data
                    : data.sessions ||
                    []
            );
        };

        load();
    }, []);

    useEffect(() => {
        const token =
            getToken();

        if (!token) return;

        const socket =
            new WebSocket(
                `ws://127.0.0.1:8000/terminal/ws?token=${token}`
            );

        socketRef.current =
            socket;

        socket.onopen = () =>
            setStatus("idle");

        socket.onmessage = (
            event
        ) => {
            const msg =
                JSON.parse(
                    event.data
                );

            if (
                msg.type ===
                "created"
            ) {
                setTabs((prev) =>
                    prev.map(
                        (
                            t,
                            i
                        ) =>
                            i ===
                                prev.length -
                                1
                                ? {
                                    ...t,
                                    id: msg.session_id,
                                }
                                : t
                    )
                );

                setActiveTabId(
                    msg.session_id
                );

                setView(
                    "terminal"
                );

                setStatus(
                    "connected"
                );
            }

            if (
                msg.type ===
                "output"
            ) {
                window.dispatchEvent(
                    new CustomEvent(
                        "terminal-output",
                        {
                            detail:
                                msg,
                        }
                    )
                );
            }
            if (msg.type === "error") {
                alert(msg.message);
                setStatus("idle");
            }
        };

        socket.onclose =
            () =>
                setStatus(
                    "disconnected"
                );

        return () =>
            socket.close();
    }, []);

    const connect = (
        conn: Connection
    ) => {
        const key =
            getServerKey(conn);

        const count =
            tabs.filter(
                (t) =>
                    t.serverKey ===
                    key
            ).length + 1;

        const tempTab: Tab = {
            id:
                "pending-" +
                Date.now(),
            title: `Tab ${count}`,
            serverKey: key,
            connection: conn,
            createdAt:
                Date.now(),
        };

        setTabs((prev) => [
            ...prev,
            tempTab,
        ]);

        setSelected(conn);
        setStatus(
            "connecting"
        );
        setView(
            "terminal"
        );
        setActiveTabId(
            tempTab.id
        );

        socketRef.current?.send(
            JSON.stringify({
                type: "create",
                payload: conn,
            })
        );
    };

    const handleSelectServer = (
        c: Connection
    ) => {
        setSelected(c);

        const key =
            getServerKey(c);

        const serverTabs =
            tabs.filter(
                (t) =>
                    t.serverKey ===
                    key
            );

        if (
            serverTabs.length > 0
        ) {
            const latest =
                serverTabs[
                serverTabs.length -
                1
                ];

            setActiveTabId(
                latest.id
            );

            setView(
                "terminal"
            );
        } else {
            setView(
                "overview"
            );
        }
    };

    const closeTab = (
        id: string
    ) => {
        const remaining =
            tabs.filter(
                (t) =>
                    t.id !== id
            );

        socketRef.current?.send(
            JSON.stringify({
                type: "close",
                session_id: id,
            })
        );

        setTabs(
            remaining
        );

        if (
            activeTabId === id
        ) {
            if (
                remaining.length >
                0
            ) {
                setActiveTabId(
                    remaining[
                        remaining.length -
                        1
                    ].id
                );
            } else {
                setActiveTabId(
                    null
                );

                setView(
                    "empty"
                );
            }
        }
    };

    return (
        <Layout
            status={status}
            activeSession={
                activeTab
                    ?.connection
                    .host || null
            }
            onDisconnectAll={() => {
                socketRef.current?.close();

                setTabs([]);
                setView(
                    "empty"
                );
                setActiveTabId(
                    null
                );
            }}
            onOpenAdmin={openAdmin}
            isAdmin={admin}
        >
            <Sidebar
                connections={
                    connections
                }
                selected={
                    selected
                }
                tabs={tabs}
                onSelect={
                    handleSelectServer
                }
                onAdd={() =>
                    setShowForm(true)
                }
                onDisconnectServer={(
                    conn
                ) => {
                    const key =
                        getServerKey(
                            conn
                        );

                    const serverTabs =
                        tabs.filter(
                            (t) =>
                                t.serverKey ===
                                key
                        );

                    serverTabs.forEach(
                        (tab) => {
                            socketRef.current?.send(
                                JSON.stringify(
                                    {
                                        type: "close",
                                        session_id:
                                            tab.id,
                                    }
                                )
                            );
                        }
                    );

                    const remaining =
                        tabs.filter(
                            (t) =>
                                t.serverKey !==
                                key
                        );

                    setTabs(
                        remaining
                    );

                    if (
                        remaining.length >
                        0
                    ) {
                        setActiveTabId(
                            remaining[
                                remaining.length -
                                1
                            ].id
                        );

                        setView(
                            "terminal"
                        );
                    } else {
                        setActiveTabId(
                            null
                        );

                        setView(
                            "empty"
                        );
                    }
                }}
            />

            <div className="flex flex-col flex-1 min-h-0 h-full overflow-hidden bg-[#0a0a0a]">

                {view === "admin" && (
                    <div className="flex-1 p-8 overflow-y-auto">
                        <AdminPanel onBack={() => setView("empty")} />
                    </div>
                )}
                {view ===
                    "terminal" && (
                        <TerminalTabs
                            tabs={
                                visibleTabs
                            }
                            activeTabId={
                                activeTabId
                            }
                            onSwitch={
                                setActiveTabId
                            }
                            onClose={
                                closeTab
                            }
                            onNew={() => {
                                if (
                                    selected
                                ) {
                                    connect(
                                        selected
                                    );
                                }
                            }}
                        />
                    )}

                {view ===
                    "empty" && (
                        <div className="flex-1 flex items-center justify-center text-zinc-500">
                            No Active Session
                        </div>
                    )}

                {view ===
                    "overview" &&
                    selected && (
                        <div className="p-8">
                            <button
                                onClick={() =>
                                    connect(
                                        selected
                                    )
                                }
                                className="h-11 px-5 rounded-xl bg-emerald-500 text-black font-medium"
                            >
                                Connect
                            </button>
                        </div>
                    )}

                {view ===
                    "terminal" && (
                        <div className="relative flex-1 min-h-0 h-full overflow-hidden">
                            {tabs.map(
                                (
                                    tab
                                ) => (
                                    <div
                                        key={
                                            tab.id
                                        }
                                        className={
                                            tab.id === activeTabId
                                                ? "absolute inset-0 visible z-10"
                                                : "absolute inset-0 invisible pointer-events-none z-0"
                                        }
                                    >
                                        <Terminal
                                            sessionId={
                                                tab.id
                                            }
                                            socketRef={
                                                socketRef
                                            }
                                            active={
                                                tab.id ===
                                                activeTabId
                                            }
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    )}
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
                    <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-[#111111] p-6">
                        <ConnectForm
                            onConnect={(
                                c
                            ) => {
                                setConnections(
                                    (
                                        prev
                                    ) => [
                                            ...prev,
                                            c,
                                        ]
                                );

                                setShowForm(
                                    false
                                );
                            }}
                            onClose={() =>
                                setShowForm(
                                    false
                                )
                            }
                        />
                    </div>
                </div>
            )}
        </Layout>
    );
}