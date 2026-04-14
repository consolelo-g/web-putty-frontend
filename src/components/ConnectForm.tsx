import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import type { Connection } from "./types";

interface Props {
    onConnect: (data: Connection) => void;
    onClose: () => void;
    initialData?: Omit<Connection, "password">;
}

export default function ConnectForm({ onConnect, onClose, initialData }: Props) {
    const [form, setForm] = useState({
        host: initialData?.host || "",
        port: initialData?.port || 22,
        username: initialData?.username || "",
        password: "",
    });

    const [error, setError] = useState("");
    const isReconnect = !!initialData;

    const isValid = isReconnect
        ? form.password.trim() !== ""
        : form.host.trim() !== "" &&
        form.username.trim() !== "" &&
        form.password.trim() !== "" &&
        form.port > 0;

    const handleSubmit = () => {
        if (!isValid) {
            setError("All fields are required and must be valid.");
            return;
        }

        setError("");
        onConnect(form);
    };

    const hostRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (isReconnect) {
            passwordRef.current?.focus();
        } else {
            hostRef.current?.focus();
        }
    }, [isReconnect]);

    return (
        <div
            className="flex flex-col gap-4 relative"
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    handleSubmit();
                }
            }}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded transition"
            >
                <X size={18} />
            </button>

            {/* Title */}
            <h2 className="text-lg font-semibold text-white pt-4">
                {isReconnect ? "Reconnect to VM" : "Connect to VM"}
            </h2>

            {/* Host */}
            {!isReconnect && (
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-slate-400">Host</label>
                    <input
                        ref={hostRef}
                        placeholder="e.g. 192.168.1.10"
                        className="bg-slate-800 px-3 py-2 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={form.host}
                        onChange={(e) =>
                            setForm({ ...form, host: e.target.value })
                        }
                    />
                </div>
            )}

            {/* Port */}
            {!isReconnect && (
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-slate-400">Port</label>
                    <input
                        type="number"
                        value={form.port}
                        className="bg-slate-800 px-3 py-2 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        onChange={(e) =>
                            setForm({ ...form, port: Number(e.target.value) })
                        }
                    />
                </div>
            )}

            {/* Username */}
            {!isReconnect && (
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-slate-400">Username</label>
                    <input
                        value={form.username}
                        placeholder="Enter username"
                        className="bg-slate-800 px-3 py-2 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        onChange={(e) =>
                            setForm({ ...form, username: e.target.value })
                        }
                    />
                </div>
            )}

            {isReconnect && (
                <div className="text-sm text-slate-400 bg-slate-800 px-3 py-2 rounded border border-slate-700">
                    {form.username}@{form.host}:{form.port}
                </div>
            )}

            {/* Password */}
            <div className="flex flex-col gap-1">
                <label className="text-sm text-slate-400">Password</label>
                <input
                    ref={passwordRef}
                    type="password"
                    placeholder="Enter password"
                    className="bg-slate-800 px-3 py-2 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                />
            </div>

            {/* Error Message */}
            {error && (
                <div className="text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Button */}
            <button
                onClick={handleSubmit}
                disabled={!isValid}
                className={`mt-2 py-2 rounded font-medium transition ${isValid
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-slate-700 cursor-not-allowed"
                    }`}
            >
                {isReconnect ? "Reconnect" : "Connect"}
            </button>
        </div>
    );
}