import { useSession } from "next-auth/react";

export default function AccessToken() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Start the demo by signing in.</p>;
  }

  return (
    <div>
      <p className="text-sm my-2">
        Hi {session?.user?.name || "Unknown"}. This is your profile based on the
        consented claims you approved.
      </p>

      <h3 className="text-2xl my-1 mt-4">System Identifier</h3>
      <i className="text-sm">Your unique digital identifier</i>
      <p>{(session?.user as any).id || "No system identifier claim found"}</p>
    </div>
  );
}
