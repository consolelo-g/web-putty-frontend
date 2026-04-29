import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { saveToken } from "../utils/auth";

export default function Login() {
    const navigate = useNavigate();

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const handleLogin = async () => {
        if (!password.trim()) return;

        try {
            setLoading(true);
            setError("");

            const res = await fetch(
                "http://127.0.0.1:8000/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        password,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                setError(
                    data.detail ||
                    "Login failed"
                );
                return;
            }

            saveToken(
                data.access_token
            );

            navigate("/app");

        } catch {
            setError(
                "Server unavailable"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">

            <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-[#111111] p-8">

                <h1 className="text-3xl font-semibold text-white">
                    WebPutty
                </h1>

                <p className="mt-2 text-sm text-zinc-500">
                    Secure access required
                </p>

                <div className="mt-6">
                    <label className="text-sm text-zinc-400">
                        Access Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                        onKeyDown={(e) => {
                            if (
                                e.key === "Enter"
                            ) {
                                handleLogin();
                            }
                        }}
                        className="mt-2 w-full h-11 px-4 rounded-xl bg-[#171717] border border-zinc-800 text-white outline-none focus:border-emerald-500"
                        placeholder="Enter password"
                    />
                </div>

                {error && (
                    <p className="mt-3 text-sm text-red-400">
                        {error}
                    </p>
                )}

                <button
                    onClick={
                        handleLogin
                    }
                    disabled={loading}
                    className="mt-6 w-full h-11 rounded-xl bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition disabled:opacity-60"
                >
                    {loading
                        ? "Checking..."
                        : "Enter Workspace"}
                </button>

            </div>

        </div>
    );
}