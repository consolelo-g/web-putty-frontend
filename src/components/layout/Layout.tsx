import Navbar from "./Navbar";
import type { Status } from "../types";

interface Props {
    children: React.ReactNode;
    status: Status;
    activeSession?: string | null;
    onDisconnectAll: () => void;
}

export default function Layout({
    children,
    status,
    activeSession,
    onDisconnectAll,
}: Props) {
    return (
        <div className="h-screen w-screen bg-[#0a0a0a] text-white flex flex-col overflow-hidden">

            <Navbar
                status={status}
                activeSession={activeSession}
                onDisconnectAll={onDisconnectAll}
            />

            <main className="flex-1 min-h-0 flex overflow-hidden">
                {children}
            </main>

        </div>
    );
}