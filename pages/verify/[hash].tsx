import Image from "next/image";
import logo from "../../public/logo.png";

import { GetServerSidePropsContext } from "next";

import { supabase_ADMIN_UNSAFE_FULL_ACCESS } from "../../services/supabase";
import { getServerSession } from "next-auth";

import { authOptions } from "../../services/nextAuthOptions";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  //@ts-ignore
  const { hash } = req.query;

  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return null;
  }
  console.log("session", session);

  // HACK: this is a hack for demo purposes, implement proper auth
  const authUser = session.user;

  if (!authUser) {
    return { props: {} };
  }

  // get sender from database
  const [senderRes, emailRes] = await Promise.all([
    supabase_ADMIN_UNSAFE_FULL_ACCESS.from("senders").select("hash").match({
      hash,
    }),
    supabase_ADMIN_UNSAFE_FULL_ACCESS.from("emails").select("sub").match({
      hash,
    }),
  ]);

  const sender = senderRes.data?.[0] as unknown as {
    sub: string;
    rep: string;
    created_at: string;
  };

  const isRealHuman =
    emailRes.data?.length && emailRes.data.length > 0 ? true : false;
  // if user doesn't exist, return error
  if (!sender) {
    return { props: {} };
  }

  if (Number(sender.rep) < 0) {
    return { props: {} };
  }

  return { rep: sender.rep, isRealHuman };
}

export default function Index(props: { rep: string; isRealHuman: boolean }) {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Image src={logo} alt="Worldcoinemail Logo" />
      {props.isRealHuman ? (
        <h1>We are pretty sure this email was sent to you by a real person</h1>
      ) : (
        <h1>We are pretty sure this email was sent to you by a bot</h1>
      )}

      <a
        href="https://google.com"
        rel="noopener noreferrer"
        target="_blank"
        className="mt-auto mb-4"
      >
        Unsubscribe
      </a>
    </div>
  );
}
