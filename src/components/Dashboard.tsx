import { useRef, useState } from "react";
import Layout from "../components/layout/Layout";
import Terminal from "../components/Terminal";
import ConnectForm from "./ConnectForm";
import type { Connection, Status } from "./types";

export default function Dashboard() {
    const socketRef = useRef<WebSocket | null>(null);
    const [connection, setConnection] = useState<Connection | null>(null);
    const [status, setStatus] = useState<Status>("idle");
    const [showForm, setShowForm] = useState(true);
    const [lastConnection, setLastConnection] = useState<Omit<Connection, "password"> | null>(null);

    return (
        <Layout
            setActiveVM={() => { }}
            status={status}
            connection={connection}
            onDisconnect={() => {
                socketRef.current?.close();
                setConnection(null);
                setStatus("disconnected");
            }}
        >
            <div className="flex flex-col h-full">

                {/* Top bar
                <ConnectForm onConnect={setConnection} /> */}

                {/* Terminal area */}
                <div className="h-full w-full">
                    {connection ? (
                        <Terminal
                            connection={connection}
                            setStatus={setStatus}
                            socketRef={socketRef}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
                            <div>No connection. Please connect to a VM to get started.</div>

                            {lastConnection && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
                                >
                                    Reconnect
                                </button>
                            )}
                        </div>
                    )}
                </div>
                {showForm && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

                        <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-4 w-[400px]">

                            <ConnectForm
                                initialData={lastConnection || undefined}
                                onConnect={(data) => {
                                    setConnection(data);
                                    setLastConnection({
                                        host: data.host,
                                        port: data.port,
                                        username: data.username,
                                    });
                                    setStatus("connecting");
                                    setShowForm(false);
                                }}
                                onClose={() => setShowForm(false)}
                            />

                        </div>
                    </div>
                )}

            </div>
        </Layout>
    );
}