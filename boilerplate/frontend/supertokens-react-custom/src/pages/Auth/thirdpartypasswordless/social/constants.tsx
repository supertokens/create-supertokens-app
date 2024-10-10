import { FaGoogle, FaGithub, FaApple } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";

interface ISupportedProviders {
    key: string;
    name: string;
    icon: React.ReactNode;
}

const SUPPORTED_PROVIDERS: ISupportedProviders[] = [
    {
        key: "google",
        name: "Google",
        icon: <FaGoogle />,
    },
    {
        key: "github",
        name: "Github",
        icon: <FaGithub />,
    },
    {
        key: "twitter",
        name: "X(Twitter)",
        icon: <RiTwitterXLine />,
    },
    {
        key: "apple",
        name: "Apple",
        icon: <FaApple />,
    },
];

export { SUPPORTED_PROVIDERS };
