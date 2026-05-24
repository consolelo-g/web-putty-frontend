import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import { getToken } from "../utils/auth";

import type { Connection } from "./types";

interface Props {
    onConnect: (data: Connection) => void;
    onClose: () => void;
    initialData?: Omit<
        Connection,
        "password"
    >;
}

export default function ConnectForm({
    onConnect,
    onClose,
    initialData,
}: Props) {
    const [form, setForm] =
        useState({
            host:
                initialData?.host ||
                "",
            port:
                initialData?.port ||
                22,
            username:
                initialData?.username ||
                "",
            password: "",
        });

    const apiUrl = import.meta.env.VITE_API_URL;

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const hostRef =
        useRef<HTMLInputElement | null>(
            null
        );

    useEffect(() => {
        hostRef.current?.focus();
    }, []);

    const valid =
        form.host.trim() &&
        form.username.trim() &&
        form.password.trim();

    const submit =
        async () => {
            if (!valid) return;

            try {
                setLoading(true);
                setError("");

                const token =
                    getToken();

                await fetch(
                    apiUrl + "/sessions/",
                    {
                        method:
                            "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                            Authorization:
                                `Bearer ${token}`,
                        },
                        body: JSON.stringify(
                            {
                                host: form.host,
                                port: form.port,
                                username:
                                    form.username,
                            }
                        ),
                    }
                );

                onConnect(
                    form
                );

            } catch {
                setError(
                    "Unable to save server"
                );
            } finally {
                setLoading(false);
            }
        };

    return (
        <div
            className="relative"
            onKeyDown={(
                e
            ) => {
                if (
                    e.key ===
                    "Enter"
                ) {
                    submit();
                }
            }}
        >
            {/* Close */}
            <button
                onClick={
                    onClose
                }
                className="absolute top-0 right-0 w-9 h-9 rounded-xl border border-zinc-800 bg-[#171717] hover:bg-[#1d1d1d] flex items-center justify-center text-zinc-400"
            >
                <X size={16} />
            </button>

            <h2 className="text-2xl font-semibold text-white">
                New Connection
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
                Save and connect to SSH server
            </p>

            {/* Inputs */}
            <div className="mt-6 space-y-4">

                <input
                    ref={
                        hostRef
                    }
                    placeholder="Host / IP"
                    value={
                        form.host
                    }
                    onChange={(
                        e
                    ) =>
                        setForm({
                            ...form,
                            host: e
                                .target
                                .value,
                        })
                    }
                    className="w-full h-11 px-4 rounded-xl bg-[#171717] border border-zinc-800 text-white outline-none focus:border-emerald-500"
                />

                <input
                    type="number"
                    placeholder="Port"
                    value={
                        form.port
                    }
                    onChange={(
                        e
                    ) =>
                        setForm({
                            ...form,
                            port: Number(
                                e
                                    .target
                                    .value
                            ),
                        })
                    }
                    className="w-full h-11 px-4 rounded-xl bg-[#171717] border border-zinc-800 text-white outline-none focus:border-emerald-500"
                />

                <input
                    placeholder="Username"
                    value={
                        form.username
                    }
                    onChange={(
                        e
                    ) =>
                        setForm({
                            ...form,
                            username:
                                e
                                    .target
                                    .value,
                        })
                    }
                    className="w-full h-11 px-4 rounded-xl bg-[#171717] border border-zinc-800 text-white outline-none focus:border-emerald-500"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={
                        form.password
                    }
                    onChange={(
                        e
                    ) =>
                        setForm({
                            ...form,
                            password:
                                e
                                    .target
                                    .value,
                        })
                    }
                    className="w-full h-11 px-4 rounded-xl bg-[#171717] border border-zinc-800 text-white outline-none focus:border-emerald-500"
                />

            </div>

            {error && (
                <p className="mt-4 text-sm text-red-400">
                    {error}
                </p>
            )}

            <button
                onClick={
                    submit
                }
                disabled={
                    loading ||
                    !valid
                }
                className="mt-6 w-full h-11 rounded-xl bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition disabled:opacity-60"
            >
                {loading
                    ? "Saving..."
                    : "Save & Connect"}
            </button>

        </div>
    );
}