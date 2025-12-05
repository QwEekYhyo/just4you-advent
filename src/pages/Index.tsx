import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Snowfall from "@/components/Snowfall";
import ChristmasDecorations from "@/components/ChristmasDecorations";

const Index = () => {
    return (
        <div className="min-h-screen relative overflow-hidden">
            <Snowfall />
            <ChristmasDecorations />
            <Navbar />

            <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-20">
                <div className="max-w-2xl text-center space-y-8">
                    {/* Decorative element */}
                    <div className="text-6xl mb-4">🎄</div>

                    <h1 className="font-christmas text-6xl md:text-7xl lg:text-8xl font-bold text-gradient-gold">
                        Welcome to Your
                        <br />
                        Advent Calendar
                    </h1>

                    <p className="font-christmasCasual text-lg md:text-xl text-foreground/80 leading-relaxed">
                        The holiday season is here, and so is a very special surprise waiting just
                        for you. Behind each door lies a carefully chosen treasure, a small token of
                        appreciation to brighten your December days.
                    </p>

                    <p className="font-christmasCasual text-lg md:text-xl text-foreground/80 leading-relaxed">
                        From the first frost to Christmas Eve, discover twenty-four moments of joy
                        crafted with love.
                    </p>

                    <p className="font-christmasCasual text-xl md:text-2xl font-display text-accent italic">
                        Log in to discover what Logan has chosen especially for you.
                    </p>

                    <Button
                        asChild
                        size="lg"
                        className="font-christmasCasual md:text-2xl mt-8 bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                        <Link to="/calendar">Open Your Calendar</Link>
                    </Button>

                    {/* Decorative candy canes */}
                    <div className="flex justify-center gap-4 mt-8 opacity-60">
                        <span className="text-3xl">🍬</span>
                        <span className="text-3xl">❄️</span>
                        <span className="text-3xl">🍬</span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Index;
