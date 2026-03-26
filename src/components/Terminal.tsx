import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

interface Props {
    connection: {
        host: string;
        port: number;
        username: string;
        password: string;
    };
}

export default function Terminal({ connection }: Props) {
    const terminalRef = useRef<HTMLDivElement | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!terminalRef.current) return;

        const term = new XTerm({
            cursorBlink: true,
            fontSize: 14,
            fontFamily: "Fira Code, monospace",
            theme: {
                background: "#020617",
                foreground: "#e2e8f0",
                cursor: "#22c55e",
            },
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        term.open(terminalRef.current);
        fitAddon.fit();

        // ===== Connect WebSocket =====
        const WS_URL = import.meta.env.VITE_WS_URL || "ws://127.0.0.1:8000";
        const socket = new WebSocket(`${WS_URL}/terminal/ws`);
        socketRef.current = socket;

        socket.onopen = () => {
            term.writeln("\x1b[33mConnecting to server...\x1b[0m");

            // Send credentials (TEMP HARDCODE)
            socket.send(JSON.stringify(connection));
        };

        socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            if (msg.type === "connected") {
                term.writeln("\x1b[32mConnected to VM\x1b[0m\r\n");
            }

            if (msg.type === "output") {
                term.write(msg.data);
            }

            if (msg.type === "error") {
                term.writeln(`\x1b[31m${msg.message}\x1b[0m`);
            }
        };

        socket.onerror = () => {
            term.writeln("\x1b[31mConnection error\x1b[0m");
        };

        socket.onclose = () => {
            term.writeln("\r\n\x1b[31mDisconnected\x1b[0m");
        };

        // ===== Send Input to Backend =====
        term.onData((data: string) => {
            console.log("User input:", data);
            if (socket.readyState === WebSocket.OPEN) {
                console.warn("WebSocket is open, sending data.");
                socket.send(JSON.stringify({
                    type: "input",
                    data: data
                }));
            }
        });

        // ===== Resize Handling =====
        const handleResize = () => {
            fitAddon.fit();

            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: "resize",
                    cols: term.cols,
                    rows: term.rows
                }));
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            socket.close();
            term.dispose();
        };
    }, [connection]);

    return (
        <div className="h-full w-full p-2">
            <div className="h-full w-full border border-slate-800 rounded-lg overflow-hidden shadow-lg shadow-green-500/10">
                <div ref={terminalRef} className="h-full w-full" />
            </div>
        </div>
    );
}