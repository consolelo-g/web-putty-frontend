import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { saveToken } from "../utils/auth";

export default function Login() {
    const navigate = useNavigate();

    const [step, setStep] = useState<"email" | "otp">("email");

    const wsUrl = import.meta.env.VITE_WS_URL;

    const apiUrl = import.meta.env.VITE_API_URL;

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ----------------------------
    // REQUEST OTP
    // ----------------------------
    const handleRequestOtp = async () => {
        if (!email.trim()) return;

        try {
            setLoading(true);
            setError("");

            const res = await fetch(
                apiUrl + "/auth/request-otp",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                }
            );

            await res.json(); // always generic response

            setStep("otp");

        } catch {
            setError("Server unavailable");
        } finally {
            setLoading(false);
        }
    };

    // ----------------------------
    // VERIFY OTP
    // ----------------------------
    const handleVerifyOtp = async () => {
        if (!otp.trim()) return;

        try {
            setLoading(true);
            setError("");

            const res = await fetch(
                apiUrl + "/auth/verify-otp",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        otp,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                setError(data.detail || "Invalid OTP");
                return;
            }

            saveToken(data.access_token);
            navigate("/app");

        } catch {
            setError("Server unavailable");
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
                    {step === "email"
                        ? "Enter your email to receive OTP"
                        : "Enter the OTP sent to your email"}
                </p>

                {/* EMAIL STEP */}
                {step === "email" && (
                    <div className="mt-6">
                        <label className="text-sm text-zinc-400">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleRequestOtp();
                                }
                            }}
                            className="mt-2 w-full h-11 px-4 rounded-xl bg-[#171717] border border-zinc-800 text-white outline-none focus:border-emerald-500"
                            placeholder="Enter your email"
                        />
                    </div>
                )}

                {/* OTP STEP */}
                {step === "otp" && (
                    <div className="mt-6">
                        <label className="text-sm text-zinc-400">
                            OTP
                        </label>

                        <input
                            type="text"
                            value={otp}
                            onChange={(e) =>
                                setOtp(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleVerifyOtp();
                                }
                            }}
                            className="mt-2 w-full h-11 px-4 rounded-xl bg-[#171717] border border-zinc-800 text-white outline-none focus:border-emerald-500 tracking-widest text-center"
                            placeholder="Enter 6-digit OTP"
                        />

                        <button
                            onClick={() => setStep("email")}
                            className="mt-3 text-xs text-zinc-500 hover:text-white"
                        >
                            Change email
                        </button>
                    </div>
                )}

                {error && (
                    <p className="mt-3 text-sm text-red-400">
                        {error}
                    </p>
                )}

                <button
                    onClick={
                        step === "email"
                            ? handleRequestOtp
                            : handleVerifyOtp
                    }
                    disabled={loading}
                    className="mt-6 w-full h-11 rounded-xl bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition disabled:opacity-60"
                >
                    {loading
                        ? "Please wait..."
                        : step === "email"
                            ? "Send OTP"
                            : "Verify & Enter"}
                </button>

            </div>

        </div>
    );
}