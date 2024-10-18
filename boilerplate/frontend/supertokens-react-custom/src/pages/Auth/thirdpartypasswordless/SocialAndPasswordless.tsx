import Social from "./thirdparty/SocialLogin";
import PasswordLess from "./passwordless/PasswordlessSignIn";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SocialAndPasswordless() {
    return (
        <div className="flex flex-col items-center justify-center gap-5">
            <Header />
            <PasswordLess showHeader={false} showFooter={false} rootStyle={{ margin: 0 }} />
            <div className="flex flex-col items-center justify-center">
                <p className="text-white text-bold text-md">or</p>
                <p className="text-white text-bold text-xl">SignIn with</p>
            </div>
            <Social showHeader={false} showFooter={false} rootStyle={{ margin: 0 }} view="compact" />
            <Footer title="Thirdparty(Social) or Passwordless React Demo App" />
        </div>
    );
}
