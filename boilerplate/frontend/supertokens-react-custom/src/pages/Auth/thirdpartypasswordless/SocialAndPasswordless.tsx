import Social from "./social/SocialLogin";
import PasswordLess from "./passwordless/PasswordlessSignIn";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SocialAndPasswordless() {
    return (
        <div className="flex flex-col items-center justify-center">
            <Header />
            <Social />
            <h1 className="text-white text-bold text-3xl">OR</h1>
            <PasswordLess />
            <Footer title="Thirdparty(Social) or Passwordless React Demo App" />
        </div>
    );
}
