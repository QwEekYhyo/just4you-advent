import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                <Link to="/" className="font-display text-2xl font-semibold text-gradient-gold">
                    Just4You Advent
                </Link>

                {user ? (
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="text-foreground hover:text-primary hover:bg-primary/10"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Log out
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        asChild
                        className="text-foreground hover:text-primary hover:bg-primary/10"
                    >
                        <Link to="/login">Log in</Link>
                    </Button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
