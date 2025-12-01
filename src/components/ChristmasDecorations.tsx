const ChristmasDecorations = () => {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Left side trees */}
            <div className="absolute bottom-0 left-0 text-christmas-green opacity-20 text-[200px] leading-none">
                🎄
            </div>
            <div className="absolute bottom-20 left-20 text-christmas-green opacity-15 text-[120px] leading-none">
                🎄
            </div>

            {/* Right side trees */}
            <div className="absolute bottom-0 right-0 text-christmas-green opacity-20 text-[180px] leading-none">
                🎄
            </div>
            <div className="absolute bottom-10 right-32 text-christmas-green opacity-15 text-[100px] leading-none">
                🎄
            </div>

            {/* Scattered decorations */}
            <div className="absolute top-20 left-[10%] opacity-30 text-4xl animate-float">🎁</div>
            <div
                className="absolute top-40 right-[15%] opacity-25 text-3xl animate-float"
                style={{ animationDelay: "1s" }}
            >
                ⭐
            </div>
            <div
                className="absolute bottom-40 left-[20%] opacity-20 text-3xl animate-float"
                style={{ animationDelay: "2s" }}
            >
                🔔
            </div>
            <div
                className="absolute top-60 left-[5%] opacity-25 text-2xl animate-float"
                style={{ animationDelay: "0.5s" }}
            >
                ❄️
            </div>
            <div
                className="absolute bottom-60 right-[10%] opacity-20 text-3xl animate-float"
                style={{ animationDelay: "1.5s" }}
            >
                🎄
            </div>
        </div>
    );
};

export default ChristmasDecorations;
