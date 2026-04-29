import React from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    Shield,
    TerminalSquare,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
    const navigate = useNavigate();

    const commands = [
        { cmd: "ssh ubuntu@prod-us-1" },
        { cmd: "docker ps" },
        { cmd: "uptime" },
        { cmd: "kubectl get pods" },
        { cmd: "htop" },
    ];

    const staticLines = [
        "Last login: Tue Apr 26 10:14:22 from 10.0.0.12",
        "System load: normal   Disk: 42%   RAM: 38%",
        "Containers: nginx redis api worker",
    ];

    const [currentCmd, setCurrentCmd] =
        React.useState("");

    const [cursor, setCursor] =
        React.useState("_");

    React.useEffect(() => {
        let cmdIndex = 0;
        let charIndex = 0;
        let deleting = false;
        let timer: any;

        const loop = () => {
            const cmd =
                commands[cmdIndex].cmd;

            if (!deleting) {
                if (
                    charIndex <=
                    cmd.length
                ) {
                    setCurrentCmd(
                        cmd.slice(
                            0,
                            charIndex
                        )
                    );

                    charIndex++;

                    timer =
                        setTimeout(
                            loop,
                            120
                        );
                } else {
                    deleting =
                        true;

                    timer =
                        setTimeout(
                            loop,
                            1600
                        );
                }
            } else {
                if (
                    charIndex >= 0
                ) {
                    setCurrentCmd(
                        cmd.slice(
                            0,
                            charIndex
                        )
                    );

                    charIndex--;

                    timer =
                        setTimeout(
                            loop,
                            70
                        );
                } else {
                    deleting =
                        false;

                    cmdIndex =
                        (cmdIndex +
                            1) %
                        commands.length;

                    charIndex = 0;

                    timer =
                        setTimeout(
                            loop,
                            700
                        );
                }
            }
        };

        loop();

        const blink =
            setInterval(() => {
                setCursor(
                    (c) =>
                        c === "_"
                            ? " "
                            : "_"
                );
            }, 550);

        return () => {
            clearTimeout(timer);
            clearInterval(blink);
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">

            {/* Header */}
            <header className="h-16 border-b border-zinc-800 px-6 flex items-center justify-between">

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <TerminalSquare
                            size={18}
                            className="text-emerald-400"
                        />
                    </div>

                    <div>
                        <h1 className="text-sm font-semibold tracking-wide">
                            WebPutty
                        </h1>

                        <p className="text-[11px] text-zinc-500">
                            Browser SSH Workspace
                        </p>
                    </div>
                </div>

                <button
                    onClick={() =>
                        navigate("/app")
                    }
                    className="h-10 px-4 rounded-xl bg-[#111111] border border-zinc-800 hover:bg-[#171717] text-sm transition"
                >
                    Open App
                </button>

            </header>

            {/* Main */}
            <main className="flex-1 flex items-center justify-center px-6 py-10">

                <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-14 items-center">

                    {/* Left */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-[#111111] text-xs text-zinc-400 mb-6">
                            <Shield size={14} />
                            Secure encrypted shell access
                        </div>

                        <h2 className="text-5xl md:text-6xl font-semibold leading-tight tracking-tight">
                            SSH into servers.
                            <span className="block text-emerald-400">
                                Anywhere.
                                Instantly.
                            </span>
                        </h2>

                        <p className="mt-5 text-zinc-400 text-lg leading-relaxed max-w-xl">
                            A clean browser-based terminal workspace for secure remote access without installing desktop clients.
                        </p>

                        {/* Minimal CTA */}
                        <div className="mt-8">
                            <button
                                onClick={() =>
                                    navigate(
                                        "/app"
                                    )
                                }
                                className="h-11 px-5 rounded-xl bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition flex items-center gap-2"
                            >
                                Open Workspace
                                <ArrowRight
                                    size={
                                        16
                                    }
                                />
                            </button>
                        </div>
                    </div>

                    {/* Right Terminal */}
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.6,
                        }}
                        className="rounded-3xl border border-zinc-800 bg-[#111111] overflow-hidden shadow-2xl"
                    >
                        <div className="h-12 border-b border-zinc-800 px-4 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-zinc-700" />
                            <div className="w-3 h-3 rounded-full bg-zinc-700" />
                            <div className="w-3 h-3 rounded-full bg-zinc-700" />

                            <span className="ml-3 text-xs text-zinc-500">
                                live terminal preview
                            </span>
                        </div>

                        <div className="p-6 min-h-[380px] font-mono text-sm space-y-3">

                            {staticLines.map(
                                (
                                    line,
                                    i
                                ) => (
                                    <p
                                        key={
                                            i
                                        }
                                        className="text-zinc-500 whitespace-pre-wrap"
                                    >
                                        {
                                            line
                                        }
                                    </p>
                                )
                            )}

                            <p className="text-zinc-300">
                                <span className="text-emerald-400">
                                    ubuntu@prod
                                </span>
                                :~${" "}
                                {
                                    currentCmd
                                }
                                {
                                    cursor
                                }
                            </p>

                        </div>
                    </motion.div>

                </div>

            </main>
        </div>
    );
}