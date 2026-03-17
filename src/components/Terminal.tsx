import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

interface Props {
    vm: string;
}

export default function Terminal({ vm }: Props) {
    const terminalRef = useRef<HTMLDivElement | null>(null);

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

        term.writeln(`\x1b[32mConnected to ${vm}\x1b[0m`);
        term.write("$ ");

        term.onData((data: string) => {
            term.write(data);
        });

        const resize = () => fitAddon.fit();
        window.addEventListener("resize", resize);

        return () => {
            window.removeEventListener("resize", resize);
            term.dispose();
        };
    }, [vm]);

    return (
        <div className="h-full w-full p-2">
            <div className="h-full w-full border border-slate-800 rounded-lg overflow-hidden shadow-lg">
                <div ref={terminalRef} className="h-full w-full" />
            </div>
        </div>
    );
}