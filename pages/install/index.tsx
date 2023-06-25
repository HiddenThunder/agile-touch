import React, { useEffect } from "react";

// redirect to https://github.com/worldcoin-email/extension

export default function Index() {

  useEffect(() => {
    window.location.href = "https:///github.com/worldcoin-email/extension";
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1>Redirecting to
        <a href="https:///github.com/worldcoin-email/extension">https:///github.com/worldcoin-email/extension</a>
      </h1>
    </div>
  )
}
