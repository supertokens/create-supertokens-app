interface FooterProps {
    title?: string;
}

export default function Footer({ title }: FooterProps) {
    return <div>{title && <p className="text-white text-pretty text-sm my-5">{title}</p>}</div>;
}
