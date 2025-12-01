import { useEffect, useState } from "react";

interface Snowflake {
    id: number;
    left: number;
    delay: number;
    duration: number;
    size: number;
}

const Snowfall = () => {
    const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

    useEffect(() => {
        const flakes: Snowflake[] = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 10,
            duration: 10 + Math.random() * 10,
            size: 0.5 + Math.random() * 0.8,
        }));
        setSnowflakes(flakes);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {snowflakes.map((flake) => (
                <div
                    key={flake.id}
                    className="snowflake text-christmas-snow"
                    style={{
                        left: `${flake.left}%`,
                        animationDelay: `${flake.delay}s`,
                        animationDuration: `${flake.duration}s`,
                        fontSize: `${flake.size}rem`,
                    }}
                >
                    ❄
                </div>
            ))}
        </div>
    );
};

export default Snowfall;
