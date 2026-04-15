import type { ConnectionInfo, SetActiveVM, Status } from "../types";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface Props {
    children: React.ReactNode;
    setActiveVM: SetActiveVM;

    status: Status;
    connection: ConnectionInfo | null;
    onDisconnect: () => void;
}

export default function Layout({
    children,
    setActiveVM,
    status,
    connection,
    onDisconnect,
}: Props) {
    return (
        <div className="h-screen flex flex-col bg-slate-950 text-slate-200">

            <Navbar
                status={status}
                connection={connection}
                onDisconnect={onDisconnect}
            />

            <div className="flex flex-1 overflow-hidden min-h-0">
                <main className="flex-1 bg-slate-950 min-h-0 flex flex-col">
                    {children}
                </main>
            </div>
        </div>
    );
}