import { createSignal, onMount, Show } from "solid-js";
import * as Session from "supertokens-web-js/recipe/session";
import "./App.css";

async function getUserInfo() {
    const session = await Session.doesSessionExist();
    if (session) {
        const userId = await Session.getUserId();

        return { userId, session };
    }

    return { userId: null, session: false };
}

async function signOut() {
    await Session.signOut();
    window.location.reload();
}

function redirectToSignIn() {
    window.location.href = "/auth";
}

function App() {
    const [data, setData] = createSignal<{
        userId: string | null;
        session: boolean;
    }>({
        userId: null,
        session: false,
    });

    onMount(async () => {
        const { userId, session } = await getUserInfo();
        setData({ userId, session });
    });

    return (
        <main>
            <div class="body">
                <h1>Hello!</h1>

                <Show when={data().session}>
                    <div>
                        <span>UserId:</span>
                        <h3>{data().userId}</h3>

                        <button onclick={signOut}>Sign Out</button>
                    </div>
                </Show>

                <Show when={!data().session}>
                    <p>
                        Visit the <a href="https://supertokens.com">SuperTokens tutorial</a> to learn how to build Auth
                        under a day.
                    </p>
                    <button onclick={redirectToSignIn}>Sign in</button>
                </Show>
            </div>
        </main>
    );
}

export default App;
