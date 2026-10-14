import ProductList from "../components/ProductList";
import Cart from "../components/Cart";
import CheckoutForm from "../components/CheckoutForm";

function UserDashboard() {
    return (
        <div>
            <h2>User Dashboard</h2>
            <ProductList />
            <Cart />
            <CheckoutForm />
        </div>
    );
}

export default UserDashboard;