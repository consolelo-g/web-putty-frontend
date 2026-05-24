import { useEffect, useState } from "react";
import { getToken } from "../utils/auth";

type User = {
    email: string;
    role: "admin" | "user";
    is_active: boolean;
};

export default function AdminPanel({ onBack }: { onBack: () => void }) {
    const [users, setUsers] = useState<User[]>([]);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<"user" | "admin">("user");
    const [loading, setLoading] = useState(false);

    const token = getToken();
    const apiUrl = import.meta.env.VITE_API_URL;

    const loadUsers = async () => {
        const res = await fetch(apiUrl + "/admin/users", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) return;

        const data = await res.json();
        setUsers(data);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const addUser = async () => {
        if (!email.trim()) return;

        setLoading(true);

        await fetch(apiUrl + "/admin/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ email, role }),
        });

        setEmail("");
        setRole("user");
        loadUsers();
        setLoading(false);
    };

    const disableUser = async (email: string) => {
        await fetch(apiUrl + "/admin/users", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ email }),
        });

        loadUsers();
    };

    return (
        <div className="text-white">

            <button
                onClick={onBack}
                className="mb-6 text-sm text-zinc-400 hover:text-white"
            >
                ← Back
            </button>

            <h1 className="text-2xl font-semibold mb-6">
                Admin Panel
            </h1>

            {/* Add User */}
            <div className="mb-6 p-4 rounded-2xl border border-zinc-800 bg-[#111111]">
                <div className="flex gap-3">
                    <input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 h-10 px-3 rounded-xl bg-[#171717] border border-zinc-800"
                    />

                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as any)}
                        className="h-10 px-3 rounded-xl bg-[#171717] border border-zinc-800"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>

                    <button
                        onClick={addUser}
                        disabled={loading}
                        className="px-4 h-10 rounded-xl bg-emerald-500 text-black"
                    >
                        Add
                    </button>
                </div>
            </div>

            {/* Users */}
            <div className="rounded-2xl border border-zinc-800 bg-[#111111] overflow-hidden">
                {users.map((u) => (
                    <div
                        key={u.email}
                        className="flex items-center justify-between px-4 py-3 border-b border-zinc-800"
                    >
                        <div>
                            <p className="text-sm">{u.email}</p>
                            <p className="text-xs text-zinc-500">
                                {u.role} • {u.is_active ? "active" : "disabled"}
                            </p>
                        </div>

                        {u.is_active && (
                            <button
                                onClick={() => disableUser(u.email)}
                                className="text-xs text-red-400"
                            >
                                Disable
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}