import { useState } from "react";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import CheckoutForm from "./components/CheckoutForm";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import { useAuthStore } from "./store/authStore";

function App() {
    const [page, setPage] = useState("products");
    const user = useAuthStore((state) => state.user);

    const renderPage = () => {
        switch (page) {
            case "signup":
                return <SignupPage />;

            case "signin":
                return <SigninPage setPage={setPage} />;

            case "admin":
                return user?.role === "ADMIN" ? (
                    <AdminDashboard />
                ) : (
                    <p className="error-message">
                        Access denied. Please sign in as ADMIN.
                    </p>
                );

            case "user":
                return user?.role === "USER" ? (
                    <UserDashboard />
                ) : (
                    <p className="error-message">
                        Access denied. Please sign in as USER.
                    </p>
                );

            case "products":
            default:
                return (
                    <>
                        <h1>E-Commerce Product Management System</h1>
                        <p className="subtitle">Browse Products</p>
                        <ProductList />
                        <Cart />
                        <CheckoutForm />
                    </>
                );
        }
    };

    return (
        <>
            <Navbar setPage={setPage} />
            <div className="container">{renderPage()}</div>
        </>
    );
}

export default App;