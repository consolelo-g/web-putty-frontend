import {
    Plus,
    X,
    Monitor,
} from "lucide-react";

import type {
    Tab,
} from "../components/types";

interface Props {
    tabs: Tab[];
    activeTabId: string | null;

    onSwitch: (
        id: string
    ) => void;

    onClose: (
        id: string
    ) => void;

    onNew: () => void;
}

export default function TerminalTabs({
    tabs,
    activeTabId,
    onSwitch,
    onClose,
    onNew,
}: Props) {
    return (
        <div className="h-14 px-3 border-b border-zinc-800 bg-[#111111] flex items-center gap-2 overflow-x-auto scrollbar-none">

            {tabs.map((tab) => {
                const active =
                    activeTabId ===
                    tab.id;

                return (
                    <button
                        key={tab.id}
                        onClick={() =>
                            onSwitch(
                                tab.id
                            )
                        }
                        className={`group shrink-0 max-w-[220px] h-10 px-4 rounded-xl border flex items-center gap-3 transition-all
                        ${active
                                ? "bg-emerald-500/10 border-emerald-500/20 text-white"
                                : "bg-[#171717] border-zinc-800 text-zinc-400 hover:bg-[#1d1d1d]"
                            }`}
                    >
                        <Monitor
                            size={14}
                            className={
                                active
                                    ? "text-emerald-400"
                                    : ""
                            }
                        />

                        <span className="truncate text-sm">
                            {tab.title}
                        </span>

                        <span
                            onClick={(
                                e
                            ) => {
                                e.stopPropagation();

                                onClose(
                                    tab.id
                                );
                            }}
                            className="ml-1 opacity-60 hover:opacity-100 text-zinc-500 hover:text-red-400 transition"
                        >
                            <X
                                size={
                                    14
                                }
                            />
                        </span>
                    </button>
                );
            })}

            {/* Add New Tab */}
            <button
                onClick={onNew}
                title="New Tab"
                className="shrink-0 w-10 h-10 rounded-xl border border-zinc-800 bg-[#171717] hover:bg-[#1d1d1d] text-zinc-400 hover:text-emerald-400 transition flex items-center justify-center"
            >
                <Plus
                    size={16}
                />
            </button>
        </div>
    );
}