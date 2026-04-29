import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

import type { SocketRef } from "./types";

interface Props {
    sessionId: string;
    socketRef: SocketRef;
    active: boolean;
}

export default function Terminal({
    sessionId,
    socketRef,
    active,
}: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const termRef = useRef<XTerm | null>(null);
    const fitRef = useRef<FitAddon | null>(null);
    const resizeRef = useRef<ResizeObserver | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const term = new XTerm({
            cursorBlink: true,
            fontSize: 14,
            fontFamily: "Consolas, monospace",
            scrollback: 5000,
            convertEol: true,
            theme: {
                background: "#0a0a0a",
                foreground: "#e4e4e7",
                cursor: "#10b981",
            },
        });

        const fitAddon = new FitAddon();

        term.loadAddon(fitAddon);
        term.open(containerRef.current);

        termRef.current = term;
        fitRef.current = fitAddon;

        const send = (payload: any) => {
            const socket = socketRef.current;

            if (socket?.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(payload));
            }
        };

        const fit = () => {
            if (!containerRef.current) return;

            try {
                fitAddon.fit();

                send({
                    type: "resize",
                    session_id: sessionId,
                    cols: term.cols,
                    rows: term.rows,
                });

                term.refresh(0, term.rows - 1);
            } catch { }
        };

        const outputHandler = (e: any) => {
            const msg = e.detail;

            if (msg.session_id === sessionId) {
                term.write(msg.data, () => {
                    if (active) term.scrollToBottom();
                });
            }
        };

        term.onData((data) => {
            send({
                type: "input",
                session_id: sessionId,
                data,
            });
        });

        window.addEventListener(
            "terminal-output",
            outputHandler
        );

        window.addEventListener("resize", fit);

        const ro = new ResizeObserver(() => {
            if (active) fit();
        });

        ro.observe(containerRef.current);
        resizeRef.current = ro;

        setTimeout(fit, 100);

        return () => {
            window.removeEventListener(
                "terminal-output",
                outputHandler
            );

            window.removeEventListener(
                "resize",
                fit
            );

            ro.disconnect();
            term.dispose();
        };
    }, [sessionId]);

    useEffect(() => {
        if (!active) return;

        const run = () => {
            const term = termRef.current;
            const fitAddon = fitRef.current;

            if (!term || !fitAddon) return;

            fitAddon.fit();

            term.refresh(0, term.rows - 1);

            requestAnimationFrame(() => {
                term.scrollToBottom();
                term.focus();
            });
        };

        setTimeout(run, 50);
    }, [active]);

    return (
        <div className="w-full h-full min-h-0 p-2 bg-[#0a0a0a] overflow-hidden">
            <div
                ref={containerRef}
                className="w-full h-full min-h-0 rounded-2xl border border-zinc-800 overflow-hidden"
            />
        </div>
    );
}