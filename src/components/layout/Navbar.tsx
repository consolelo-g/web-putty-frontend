export default function Navbar() {
    return (
        <div className="h-12 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4">

            {/* Left */}
            <div className="flex items-center gap-2">
                <span className="text-green-500 font-bold">●</span>
                <span className="font-semibold">WebPutty</span>
            </div>

            {/* Center */}
            <div className="text-sm text-slate-400">
                Connected
            </div>

            {/* Right */}
            <div className="text-sm text-slate-400">
                user@vm
            </div>
        </div>
    );
}