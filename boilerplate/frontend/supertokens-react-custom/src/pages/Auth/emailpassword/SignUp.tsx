import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "supertokens-auth-react/recipe/emailpassword";

export default function SignUp() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const [isLoading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmpassword) {
            alert("Password do not match");
            return;
        }
        setLoading(true);
        try {
            const response = await signUp({
                formFields: [
                    {
                        id: "email",
                        value: email,
                    },
                    {
                        id: "password",
                        value: password,
                    },
                ],
            });

            if (response.status === "FIELD_ERROR") {
                // one of the input formFields failed validation
                response.formFields.forEach((formField) => {
                    if (formField.id === "email") {
                        // Email validation failed (for example incorrect email syntax),
                        // or the email is not unique.
                        window.alert(formField.error);
                    } else if (formField.id === "password") {
                        // Password validation failed.
                        // Maybe it didn't match the password strength
                        window.alert(formField.error);
                    }
                });
            } else if (response.status === "SIGN_UP_NOT_ALLOWED") {
                // the reason string is a user friendly message
                // about what went wrong. It can also contain a support code which users
                // can tell you so you know why their sign up was not allowed.
                window.alert(response.reason);
            } else {
                // sign up successful. The session tokens are automatically handled by
                // the frontend SDK.
                navigate("/signin", { replace: true });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            if (err.isSuperTokensGeneralError === true) {
                // this may be a custom error message sent from the API by you.
                window.alert(err.message);
            } else {
                window.alert("Oops! Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <h1>Sign Up</h1>
            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "300px",
                    gap: "10px",
                }}
            >
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmpassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="submit" disabled={isLoading}>
                    Sign Up
                </button>
            </form>
        </div>
    );
}
