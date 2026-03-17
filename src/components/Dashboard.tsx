import { useState } from "react";
import Layout from "../components/layout/Layout";
import Terminal from "../components/Terminal";

export default function Dashboard() {
    const [activeVM, setActiveVM] = useState("VM-1");

    return (
        <Layout setActiveVM={setActiveVM}>
            <Terminal vm={activeVM} />
        </Layout>
    );
}