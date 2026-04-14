import type { SetActiveVM } from "../types";

interface Props {
    setActiveVM: SetActiveVM;
}

export default function Sidebar({ setActiveVM }: Props) {
    const vms = ["VM-1", "VM-2", "VM-3"];

    return (
        <div className="w-64 bg-slate-900 border-r border-slate-800 p-3">

            <h2 className="text-sm uppercase text-slate-400 mb-3">
                Instances
            </h2>

            {vms.map((vm) => (
                <div
                    key={vm}
                    onClick={() => setActiveVM(vm)}
                    className="px-3 py-2 rounded cursor-pointer hover:bg-slate-800 transition"
                >
                    {vm}
                </div>
            ))}
        </div>
    );
}