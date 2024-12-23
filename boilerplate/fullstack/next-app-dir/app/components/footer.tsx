"use client";

import { BlogsIcon, GuideIcon, SeparatorLine, SignOutIcon } from "../../assets/images";
import Image from "next/image";
import { recipeDetails } from "../config/frontend";
import Session from "supertokens-auth-react/recipe/session/index.js";
import SuperTokens from "supertokens-auth-react";

export interface Link {
    name: string;
    onClick: () => void;
    icon: string;
}

function openLink(url: string) {
    window.open(url, "_blank");
}

async function logoutClicked() {
    await Session.signOut();
    SuperTokens.redirectToAuth();
}

const links: Link[] = [
    {
        name: "Blogs",
        onClick: () => openLink("https://supertokens.com/blog"),
        icon: BlogsIcon,
    },
    {
        name: "Documentation",
        onClick: () => openLink(recipeDetails.docsLink),
        icon: GuideIcon,
    },
    {
        name: "Sign Out",
        onClick: logoutClicked,
        icon: SignOutIcon,
    },
];

export default function Footer() {
    return (
        <>
            <div className="bottom-links-container">
                {links.map((link) => (
                    <div className="link" key={link.name}>
                        <Image className="link-icon" src={link.icon} alt={link.name} width={20} height={20} />
                        <div role={"button"} onClick={link.onClick}>
                            {link.name}
                        </div>
                    </div>
                ))}
            </div>
            <Image className="separator-line" src={SeparatorLine} alt="separator" />
        </>
    );
}
