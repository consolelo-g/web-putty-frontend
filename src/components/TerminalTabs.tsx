interface Props {
    tabs: any[];
    activeTabId: string | null;
    onSwitch: (id: string) => void;
    onClose: (id: string) => void;
    onNew: () => void;
}

export default function TerminalTabs({
    tabs,
    activeTabId,
    onSwitch,
    onClose,
    onNew
}: Props) {
    return (
        <div className="flex bg-slate-900 border-b border-slate-800">

            {tabs.map(tab => (
                <div
                    key={tab.id}
                    onClick={() => onSwitch(tab.id)}
                    className={`px-4 py-2 cursor-pointer flex items-center gap-2
                        ${activeTabId === tab.id ? "bg-slate-800" : ""}
                    `}
                >
                    {tab.title}

                    <span
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose(tab.id);
                        }}
                        className="text-red-400"
                    >
                        ×
                    </span>
                </div>
            ))}

            <button
                onClick={onNew}
                className="px-3 py-2 text-green-400"
            >
                +
            </button>
        </div>
    );
}