export default function ProgressBar({ current, total }) {
    const percentage = Math.round((current / total) * 100) || 0;

    return (
        <div className="w-full" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-bb-green uppercase tracking-widest" style={{ textShadow: "0 0 5px rgba(16,185,129,0.8)" }}>Series Progress</span>
                <span className="text-xl font-black text-bb-green" style={{ textShadow: "0 0 8px rgba(16,185,129,0.8)" }}>{percentage}%</span>
            </div>

            <div className="w-full h-6 bg-bb-dark border-2 border-bb-green p-1 relative shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <div
                    className="h-full bg-bb-green transition-all duration-1000 relative shadow-[0_0_15px_rgba(16,185,129,0.8)] overflow-hidden"
                    style={{ width: `${percentage}%` }}
                >
                    {/* Retro Striped Overlay */}
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 10px, transparent 10px, transparent 20px)',
                            backgroundSize: '28px 28px'
                        }}
                    ></div>

                    {/* Pulsing Bloom */}
                    <div className="absolute inset-0 bg-white-20 w-full animate-pulse blur-sm mix-blend-overlay"></div>

                    {/* Animated shine effect */}
                    <div className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-r from-transparent via-white-20 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                </div>
            </div>

            <p className="text-xs font-bold text-bb-green mt-2 text-right uppercase tracking-wider opacity-80">
                <span className="text-white" style={{ textShadow: "0 0 5px rgba(255,255,255,0.8)" }}>{current}</span> / {total} DATA LOGS
            </p>
        </div>
    );
}
