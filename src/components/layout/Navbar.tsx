import {
    Shield,
    Plug,
    PlugZap,
    LogOut,
    Settings
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { logout } from "../../utils/auth";

import type { Status } from "../types";

interface Props {
    status: Status;
    activeSession?: string | null;
    onDisconnectAll: () => void;
    onOpenAdmin?: () => void;
    isAdmin?: boolean;
}

export default function Navbar({
    status,
    activeSession,
    onDisconnectAll,
    onOpenAdmin,
    isAdmin
}: Props) {
    const navigate = useNavigate();

    const connected = status === "connected";

    const handleLogout = () => {
        onDisconnectAll();
        logout();
        navigate("/login");
    };

    return (
        <header className="h-14 border-b border-zinc-800 bg-[#111111] px-5 flex items-center justify-between">

            {/* Left */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Shield size={16} />
                </div>

                <div>
                    <p className="text-sm font-semibold text-white">
                        WebPutty
                    </p>
                    <p className="text-xs text-zinc-500">
                        Secure SSH Workspace
                    </p>
                </div>
            </div>

            {/* Center */}
            <div className="hidden md:flex items-center gap-3 text-sm">
                <div className="flex items-center gap-2 text-zinc-400">
                    {connected ? (
                        <Plug size={14} className="text-emerald-400" />
                    ) : (
                        <PlugZap size={14} className="text-red-400" />
                    )}

                    <span className="capitalize">{status}</span>
                </div>

                {activeSession && (
                    <div className="px-3 h-8 rounded-xl bg-[#171717] border border-zinc-800 flex items-center text-zinc-300 max-w-xs truncate">
                        {activeSession}
                    </div>
                )}
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">

                {isAdmin && (
                    <button
                        onClick={onOpenAdmin}
                        className="h-10 px-4 rounded-xl bg-[#171717] border border-zinc-800 hover:bg-[#1d1d1d] transition text-sm text-zinc-300 flex items-center gap-2"
                    >
                        <Settings size={15} />
                        Admin
                    </button>
                )}

                <button
                    onClick={handleLogout}
                    className="h-10 px-4 rounded-xl bg-[#171717] border border-zinc-800 hover:bg-[#1d1d1d] transition text-sm text-zinc-300 flex items-center gap-2"
                >
                    <LogOut size={15} />
                    Logout
                </button>

            </div>
        </header>
    );
}