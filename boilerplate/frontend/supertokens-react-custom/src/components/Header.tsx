interface HeaderProps {
    title?: string;
}
export default function Header({ title }: HeaderProps) {
    return (
        <div className="flex flex-col items-center justify-center p-5 gap-5">
            <img src="/logo.webp" alt="Supertokens Logo" className="w-40" />
            {title && <h1 className="text-primary text-3xl">{title}</h1>}
        </div>
    );
}
