import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";

interface NavbarProps {
    setPage: (page: string) => void;
}

function Navbar({ setPage }: NavbarProps) {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const clearCart = useCartStore((state) => state.clearCart);

    const handleLogout = () => {
        logout();
        clearCart();
        setPage("products");
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand" onClick={() => setPage("products")}>
                SmartCart
            </div>

            <div className="navbar-links">
                <button onClick={() => setPage("products")}>Home</button>

                {!user && (
                    <>
                        <button onClick={() => setPage("signin")}>Sign In</button>
                        <button onClick={() => setPage("signup")}>Sign Up</button>
                    </>
                )}

                {user && user.role === "ADMIN" && (
                    <button onClick={() => setPage("admin")}>
                        Admin Dashboard
                    </button>
                )}

                {user && user.role === "USER" && (
                    <button onClick={() => setPage("user")}>
                        User Dashboard
                    </button>
                )}

                {user && (
                    <>
                        <span className="welcome-user">
                            Welcome, {user.name}
                        </span>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;