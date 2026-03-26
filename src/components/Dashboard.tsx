import { useState } from "react";
import Layout from "../components/layout/Layout";
import Terminal from "../components/Terminal";
import ConnectForm from "./ConnectForm";

export default function Dashboard() {
    const [connection, setConnection] = useState(null);

    return (
        <Layout setActiveVM={() => { }}>
            <ConnectForm onConnect={setConnection} />

            {connection ? (
                <Terminal connection={connection} />
            ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                    Enter credentials to connect
                </div>
            )}
        </Layout>
    );
}