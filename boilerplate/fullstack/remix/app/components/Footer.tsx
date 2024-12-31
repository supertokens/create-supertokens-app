import { SeparatorLine } from "../../assets/images";

export interface Link {
    name: string;
    onClick: () => void;
    icon: string;
}

interface FooterProps {
    links: Link[];
}

export default function Footer({ links }: FooterProps) {
    return (
        <>
            <div className="bottom-links-container">
                {links.map((link) => (
                    <div className="link" key={link.name}>
                        <img className="link-icon" src={link.icon} alt={link.name} />
                        <div role={"button"} onClick={link.onClick}>
                            {link.name}
                        </div>
                    </div>
                ))}
            </div>
            <img className="separator-line" src={SeparatorLine} alt="separator" />
        </>
    );
}
