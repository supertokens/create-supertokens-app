export default function SessionInfo() {
    const fetchUserData = async () => {
        const userInfoResponse = await fetch("http://localhost:3000/sessioninfo");
        alert(JSON.stringify(await userInfoResponse.json()));
    };

    return (
        <div onClick={() => fetchUserData()} className="sessionButton">
            Call API
        </div>
    );
}
