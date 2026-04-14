import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import type { Connection, SetStatus, SocketRef } from "./types";

interface Props {
    connection: Connection;
    setStatus: SetStatus;
    socketRef: SocketRef;
}

export default function Terminal({ connection, setStatus, socketRef }: Props) {
    const terminalRef = useRef<HTMLDivElement | null>(null);
    // const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!terminalRef.current) return;

        const term = new XTerm({
            cursorBlink: true,
            scrollback: 2000,
            fontSize: 14,
            lineHeight: 1.2,
            fontFamily: "monospace",
            scrollOnUserInput: true,
            theme: {
                background: "#020617",
                foreground: "#e2e8f0",
                cursor: "#22c55e",
            },
        });

        const fitAddon = new FitAddon();

        term.loadAddon(fitAddon);
        term.open(terminalRef.current);

        // ===== Connect WebSocket =====
        const WS_URL = import.meta.env.VITE_WS_URL || "ws://127.0.0.1:8000";
        const socket = new WebSocket(`${WS_URL}/terminal/ws`);
        socketRef.current = socket;

        const resizeTerminal = () => {
            fitAddon.fit();

            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: "resize",
                    cols: term.cols,
                    rows: term.rows
                }));
            }
        };

        const observer = new ResizeObserver(() => {
            resizeTerminal();
        });

        observer.observe(terminalRef.current!);

        requestAnimationFrame(() => {
            fitAddon.fit();
        });


        socket.onopen = () => {
            term.writeln("\x1b[33mConnecting to server...\x1b[0m");
            socket.send(JSON.stringify(connection));
            socket.send(JSON.stringify({
                type: "resize",
                cols: term.cols,
                rows: term.rows
            }));
        };

        socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            if (msg.type === "connected") {
                setStatus("connected");
                term.writeln("\x1b[32mConnected to VM\x1b[0m\r\n");
            }

            if (msg.type === "output") {
                term.write(msg.data);
            }

            if (msg.type === "error") {
                setStatus("error");
                term.writeln(`\x1b[31m${msg.message}\x1b[0m`);
            }
        };

        socket.onerror = () => {
            setStatus("error");
            term.writeln("\x1b[31mConnection error\x1b[0m");
        };

        socket.onclose = () => {
            setStatus("disconnected");
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
            setTimeout(() => {
                fitAddon.fit();

                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({
                        type: "resize",
                        cols: term.cols,
                        rows: term.rows
                    }));
                }
            }, 50);
        };

        return () => {
            observer.disconnect();
            socket.close();
            term.dispose();
        };
    }, [connection]);

    return (
        <div className="h-full w-full flex min-h-0">
            <div className="h-full w-full border border-slate-800 rounded-lg overflow-hidden flex-1 shadow-lg shadow-green-500/10">
                <div ref={terminalRef} className="w-full h-full min-h-0" />
            </div>
        </div>
    );
}