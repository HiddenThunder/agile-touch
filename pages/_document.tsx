import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  // eslint-disable-page @next/next/no-sync-scripts 
  return (
    <Html lang="en">
      <Head>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}