
import { useState, type FormEvent } from "react";
import { signin } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

interface SigninPageProps {
    setPage: (page: string) => void;
}

function SigninPage({ setPage }: SigninPageProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const login = useAuthStore((state) => state.login);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        setError("");

        try {
            const user = await signin({
                email,
                password,
            });

            login(user);

            if (user.role === "ADMIN") {
                setPage("admin");
            } else {
                setPage("user");
            }
        } catch {
            setError("Invalid Email or Password");
        }
    };

    return (
        <div className="auth-container">
            <h2>Sign In</h2>

            <form onSubmit={handleSubmit}>
                <label>Email</label>

                <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
                    required
                />

                <label>Password</label>

                <input
                    type="password"
                    value={password}
                    onChange={(event) =>
                        setPassword(event.target.value)
                    }
                    required
                />

                <button type="submit">Sign In</button>
            </form>

            {error && (
                <p className="error-message">{error}</p>
            )}
        </div>
    );
}

export default SigninPage;