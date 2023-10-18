"use client";

import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { useRouter } from "next/navigation";
import Session from "supertokens-auth-react/recipe/session";

export const SignOut = () => {
  const session = useSessionContext();
  const router = useRouter();

  if (session.loading === true) {
    return null;
  }

  const signOut = async () => {
    await Session.signOut();
    router.refresh();
  };

  return <button onClick={signOut}>Sign out</button>;
};
