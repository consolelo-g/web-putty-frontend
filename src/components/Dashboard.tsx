import { useEffect, useRef, useState } from "react";
import Layout from "../components/layout/Layout";
import Terminal from "../components/Terminal";
import ConnectForm from "./ConnectForm";
import TerminalTabs from "../components/TerminalTabs";
import type { Connection, Status, Tab } from "./types";

export default function Dashboard() {
    const socketRef = useRef<WebSocket | null>(null);

    const [tabs, setTabs] = useState<Tab[]>([]);
    const [activeTabId, setActiveTabId] = useState<string | null>(null);
    const [status, setStatus] = useState<Status>("idle");
    const [showForm, setShowForm] = useState(false);

    // 🌐 INIT SINGLE WEBSOCKET
    useEffect(() => {
        const WS_URL = import.meta.env.VITE_WS_URL || "ws://127.0.0.1:8000";
        const socket = new WebSocket(`${WS_URL}/terminal/ws`);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("WebSocket connected");
        };

        socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            if (msg.type === "created") {
                const session_id = msg.session_id;

                setTabs(prev => {
                    const last = prev[prev.length - 1];
                    if (!last) return prev;

                    // attach session_id to last created tab
                    return prev.map((t, i) =>
                        i === prev.length - 1
                            ? { ...t, id: session_id }
                            : t
                    );
                });

                setActiveTabId(session_id);
                setStatus("connected");
            }

            if (msg.type === "output") {
                // handled inside Terminal via event bus (next step)
                window.dispatchEvent(new CustomEvent("terminal-output", {
                    detail: msg
                }));
            }

            if (msg.type === "error") {
                setStatus("error");
            }
        };

        socket.onclose = () => {
            setStatus("disconnected");
        };

        return () => socket.close();
    }, []);

    // ➕ CREATE TAB
    const createTab = (connection: Connection) => {
        setStatus("connecting");

        const tempTab: Tab = {
            id: "pending-" + Date.now(),
            title: connection.host,
            connection
        };

        setTabs(prev => [...prev, tempTab]);

        socketRef.current?.send(JSON.stringify({
            type: "create",
            payload: connection
        }));

        setShowForm(false);
    };

    // ❌ CLOSE TAB
    const closeTab = (id: string) => {
        socketRef.current?.send(JSON.stringify({
            type: "close",
            session_id: id
        }));

        setTabs(prev => prev.filter(t => t.id !== id));

        if (activeTabId === id) {
            const remaining = tabs.filter(t => t.id !== id);
            setActiveTabId(remaining[0]?.id || null);
        }
    };

    const activeTab = tabs.find(t => t.id === activeTabId);

    return (
        <Layout
            setActiveVM={() => { }}
            status={status}
            connection={activeTab ? {
                host: activeTab.connection.host,
                username: activeTab.connection.username
            } : null}
            onDisconnect={() => {
                socketRef.current?.close();
                setTabs([]);
                setActiveTabId(null);
            }}
        >
            <div className="flex flex-col h-full min-h-0">

                {/* 🔥 Tabs */}
                <TerminalTabs
                    tabs={tabs}
                    activeTabId={activeTabId}
                    onSwitch={setActiveTabId}
                    onClose={closeTab}
                    onNew={() => setShowForm(true)}
                />

                {/* 🖥 Terminal */}
                <div className="flex-1 relative min-h-0 overflow-hidden">

                    {tabs.map(tab => (
                        <div
                            key={tab.id}
                            className={`absolute inset-0 min-h-0 ${tab.id === activeTabId ? "block" : "hidden"
                                }`}
                        >
                            <Terminal
                                sessionId={tab.id}
                                socketRef={socketRef}
                            />
                        </div>
                    ))}

                    {tabs.length === 0 && (
                        <div className="flex items-center justify-center h-full text-slate-500">
                            No active terminal
                        </div>
                    )}
                </div>

                {/* 🧾 Connect Modal */}
                {showForm && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="bg-slate-900 p-4 rounded w-[400px]">
                            <ConnectForm
                                onConnect={createTab}
                                onClose={() => setShowForm(false)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}