import { useState } from "react";

interface Props {
    onConnect: (data: any) => void;
}

export default function ConnectForm({ onConnect }: Props) {
    const [form, setForm] = useState({
        host: "",
        port: 22,
        username: "",
        password: "",
    });

    return (
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex gap-2">

            <input
                placeholder="Host"
                className="bg-slate-800 px-2 py-1 rounded"
                onChange={(e) => setForm({ ...form, host: e.target.value })}
            />

            <input
                type="number"
                placeholder="Port"
                className="bg-slate-800 px-2 py-1 rounded w-20"
                onChange={(e) => setForm({ ...form, port: Number(e.target.value) })}
            />

            <input
                placeholder="Username"
                className="bg-slate-800 px-2 py-1 rounded"
                onChange={(e) => setForm({ ...form, username: e.target.value })}
            />

            <input
                type="password"
                placeholder="Password"
                className="bg-slate-800 px-2 py-1 rounded"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button
                onClick={() => onConnect(form)}
                className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
            >
                Connect
            </button>
        </div>
    );
}