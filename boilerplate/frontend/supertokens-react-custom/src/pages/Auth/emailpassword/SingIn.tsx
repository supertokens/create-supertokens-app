import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "supertokens-auth-react/recipe/emailpassword";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await signIn({
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
                response.formFields.forEach((formField) => {
                    if (formField.id === "email") {
                        // Email validation failed (for example incorrect email syntax).
                        window.alert(formField.error);
                    }
                });
            } else if (response.status === "WRONG_CREDENTIALS_ERROR") {
                window.alert("Email password combination is incorrect.");
            } else if (response.status === "SIGN_IN_NOT_ALLOWED") {
                // the reason string is a user friendly message
                // about what went wrong. It can also contain a support code which users
                // can tell you so you know why their sign in was not allowed.
                window.alert(response.reason);
            } else {
                // sign in successful. The session tokens are automatically handled by
                // the frontend SDK.
                navigate("/dashboard", { replace: true });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            if (err.isSuperTokensGeneralError === true) {
                // this may be a custom error message sent from the API by you.
                window.alert(err.message);
            } else {
                window.alert("Oops! Something went wrong.");
            }
        }
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
}
