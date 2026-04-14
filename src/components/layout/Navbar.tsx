import type { ConnectionInfo, Status } from "../types";

interface Props {
    status: Status;
    connection: ConnectionInfo | null;
    onDisconnect: () => void;
}

export default function Navbar({ status, connection, onDisconnect }: Props) {
    const statusConfig = {
        connected: { text: "Connected", color: "text-green-500" },
        connecting: { text: "Connecting...", color: "text-yellow-500" },
        disconnected: { text: "Disconnected", color: "text-red-500" },
        error: { text: "Error", color: "text-red-500" },
        idle: { text: "Idle", color: "text-slate-400" },
    }[status];

    return (
        <div className="h-12 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4">

            {/* Left */}
            <div className="flex items-center gap-2">
                <span className={`${statusConfig.color} font-bold`}>●</span>
                <span className="font-semibold">WebPutty</span>
            </div>

            {/* Center */}
            <div className={`text-sm ${statusConfig.color}`}>
                {statusConfig.text}
            </div>

            {/* Right */}
            <div className="flex items-center gap-3 text-sm text-slate-400">
                {connection && (
                    <span>
                        {connection.username}@{connection.host}
                    </span>
                )}

                {status === "connected" && (
                    <button
                        onClick={onDisconnect}
                        className="bg-red-600 px-2 py-1 rounded hover:bg-red-700 text-white"
                    >
                        Disconnect
                    </button>
                )}
            </div>
        </div>
    );
}