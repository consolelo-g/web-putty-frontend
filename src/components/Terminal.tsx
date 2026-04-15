import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import type { SocketRef } from "./types";

interface Props {
    sessionId: string;
    socketRef: SocketRef;
}

export default function Terminal({ sessionId, socketRef }: Props) {
    const terminalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!terminalRef.current) return;

        const term = new XTerm({
            cursorBlink: true,
            theme: {
                background: "#020617",
                foreground: "#e2e8f0",
            },
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        fitAddon.fit();

        // 🟢 Listen for output
        const handler = (e: any) => {
            const msg = e.detail;

            if (msg.session_id === sessionId) {
                term.write(msg.data);
            }
        };

        window.addEventListener("terminal-output", handler);

        // 🟡 Send input
        term.onData((data) => {
            socketRef.current?.send(JSON.stringify({
                type: "input",
                session_id: sessionId,
                data
            }));
        });

        // 🔵 Resize
        const resize = () => {
            fitAddon.fit();

            socketRef.current?.send(JSON.stringify({
                type: "resize",
                session_id: sessionId,
                cols: term.cols,
                rows: term.rows
            }));
        };

        window.addEventListener("resize", resize);

        return () => {
            window.removeEventListener("terminal-output", handler);
            window.removeEventListener("resize", resize);
            term.dispose();
        };
    }, [sessionId]);

    return (
        <div className="h-full w-full min-h-0 flex">
            <div ref={terminalRef} className="flex-1 min-h-0" />
        </div>
    );
}