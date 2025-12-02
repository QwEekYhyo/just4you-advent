import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Snowfall from "@/components/Snowfall";
import ChristmasDecorations from "@/components/ChristmasDecorations";
import { toast } from "sonner";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        const success = await login(username, password);
        if (success) {
            toast.success("Welcome back! 🎄");
            navigate("/calendar");
        } else {
            toast.error("Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            <Snowfall />
            <ChristmasDecorations />
            <Navbar />

            <main className="font-christmasCasual relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-20">
                <div className="w-full max-w-md">
                    <div className="bg-card/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-border">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <span className="text-5xl mb-4 block">🎁</span>
                            <h1 className="font-christmas text-6xl font-bold text-gradient-gold mb-2">
                                Welcome Back
                            </h1>
                            <p className="text-muted-foreground">
                                Enter your credentials to access your calendar
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-foreground">
                                    Username
                                </Label>
                                <Input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    className="bg-background/50 border-border focus:border-primary focus:ring-primary"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-foreground">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="bg-background/50 border-border focus:border-primary focus:ring-primary"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="animate-spin">❄️</span>
                                        Loading...
                                    </span>
                                ) : (
                                    "Log In"
                                )}
                            </Button>
                        </form>

                        {/* Footer decoration */}
                        <div className="flex justify-center gap-2 mt-6 opacity-50">
                            <span>🎄</span>
                            <span>⭐</span>
                            <span>🎄</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;
