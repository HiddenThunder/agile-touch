import React from "react";
import { GetServerSidePropsContext } from "next";

import Script from "next/script";
import { getToken } from "next-auth/jwt";

import LoginButton from "../components/login-btn";
import Profile from "../components/profile";

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const token = await getToken({
        req: context.req,
        secret: process.env.JWT_SECRET,
    });

    return {
        props: {
            token,
        },
    };
}

export const Auth: React.FC<{ token: string }> = (props) => {
    const { token } = props;

    if (!token)
        return (
            <>
                <LoginButton />
            </>
        );

    return (
        <>
            <LoginButton />

            <h1>Logged in! You can now close this window.</h1>

            <Script id="token-set">
                {`
                window.localStorage.setItem('token', '${JSON.stringify(token)}');
                window.__WORLDCOIN_EMAIL_ACCESS_TOKEN__ = ${JSON.stringify(token)};
            `}
            </Script>
        </>
    );
};

export default Auth;
