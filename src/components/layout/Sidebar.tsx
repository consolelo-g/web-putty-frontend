import {
    Plus,
    Server,
    Power,
} from "lucide-react";

import type {
    Connection,
    Tab,
} from "../types";

interface Props {
    connections: Connection[];
    selected?: Connection | null;

    tabs: Tab[];

    onSelect: (
        c: Connection
    ) => void;

    onAdd: () => void;

    onDisconnectServer: (
        c: Connection
    ) => void;
}

const getKey = (
    c: Connection
) =>
    `${c.host}:${c.port}:${c.username}`;

export default function Sidebar({
    connections,
    selected,
    tabs,
    onSelect,
    onAdd,
    onDisconnectServer,
}: Props) {
    return (
        <aside className="w-72 shrink-0 border-r border-zinc-800 bg-[#111111] flex flex-col min-h-0">

            {/* Header */}
            <div className="h-14 px-4 border-b border-zinc-800 flex items-center justify-between">

                <span className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
                    Servers
                </span>

                <button
                    onClick={onAdd}
                    className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition flex items-center justify-center"
                >
                    <Plus
                        size={16}
                    />
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-2 py-3 space-y-2">

                {connections.length ===
                    0 && (
                        <div className="px-3 py-4 rounded-2xl border border-dashed border-zinc-800 text-sm text-zinc-500 text-center">
                            No saved servers
                        </div>
                    )}

                {connections.map(
                    (
                        c,
                        i
                    ) => {
                        const active =
                            selected ===
                            c;

                        const key =
                            getKey(
                                c
                            );

                        const count =
                            tabs.filter(
                                (
                                    t
                                ) =>
                                    t.serverKey ===
                                    key
                            )
                                .length;

                        const connected =
                            count >
                            0;

                        return (
                            <button
                                key={
                                    i
                                }
                                onClick={() =>
                                    onSelect(
                                        c
                                    )
                                }
                                className={`group w-full text-left rounded-2xl px-3 py-3 transition border
                                ${active
                                        ? "bg-emerald-500/10 border-emerald-500/20"
                                        : "bg-[#171717] border-zinc-800 hover:bg-[#1d1d1d]"
                                    }`}
                            >
                                <div className="flex items-center gap-3 min-w-0">

                                    <div
                                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                                        ${active
                                                ? "bg-emerald-500/15 text-emerald-400"
                                                : "bg-zinc-800 text-zinc-400"
                                            }`}
                                    >
                                        <Server
                                            size={
                                                16
                                            }
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm text-white truncate">
                                            {
                                                c.host
                                            }
                                        </p>

                                        <p className="text-xs text-zinc-500 truncate">
                                            {
                                                c.username
                                            }
                                            @
                                            {
                                                c.port
                                            }
                                        </p>

                                        {connected && (
                                            <p className="text-[11px] text-emerald-400 mt-1">
                                                {
                                                    count
                                                }{" "}
                                                active
                                                tab
                                                {count >
                                                    1
                                                    ? "s"
                                                    : ""}
                                            </p>
                                        )}
                                    </div>

                                    {connected && (
                                        <span
                                            onClick={(
                                                e
                                            ) => {
                                                e.stopPropagation();

                                                onDisconnectServer(
                                                    c
                                                );
                                            }}
                                            className="opacity-0 group-hover:opacity-100 transition w-8 h-8 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center"
                                        >
                                            <Power
                                                size={
                                                    14
                                                }
                                            />
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    }
                )}
            </div>
        </aside>
    );
}