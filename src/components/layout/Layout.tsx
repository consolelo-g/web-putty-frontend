import Navbar from "./Navbar";
import type { Status } from "../types";

interface Props {
    children: React.ReactNode;
    status: Status;
    activeSession?: string | null;
    onDisconnectAll: () => void;
    onOpenAdmin?: () => void;
    isAdmin?: boolean;
}

export default function Layout({
    children,
    status,
    activeSession,
    onDisconnectAll,
    onOpenAdmin,
    isAdmin,
}: Props) {
    return (
        <div className="h-screen w-screen bg-[#0a0a0a] text-white flex flex-col overflow-hidden">

            <Navbar
                status={status}
                activeSession={activeSession}
                onDisconnectAll={onDisconnectAll}
                onOpenAdmin={onOpenAdmin}
                isAdmin={isAdmin}
            />

            <main className="flex-1 min-h-0 flex overflow-hidden">
                {children}
            </main>

        </div>
    );
}