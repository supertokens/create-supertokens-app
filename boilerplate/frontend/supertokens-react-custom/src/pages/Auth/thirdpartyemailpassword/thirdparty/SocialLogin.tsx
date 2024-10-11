/**
 * This is a dummy component which would be replaced during runtime
 */

interface SocialLoginProps {
    showHeader?: boolean;
    showFooter?: boolean;
    rootStyle?: React.CSSProperties;
    view?: "full" | "compact";
}

const SocialLogin: React.FC<SocialLoginProps> = () => <></>;

export default SocialLogin;
