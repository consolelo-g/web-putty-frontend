import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface Props {
    children: React.ReactNode;
    setActiveVM: (vm: string) => void;
}

export default function Layout({ children, setActiveVM }: Props) {
    return (
        <div className="h-screen flex flex-col bg-slate-950 text-slate-200">

            <Navbar />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar setActiveVM={setActiveVM} />

                <main className="flex-1 bg-slate-950">
                    {children}
                </main>
            </div>
        </div>
    );
}