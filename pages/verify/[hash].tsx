import Image from "next/image";
import logo from "../../public/logo.png";

import { GetServerSidePropsContext } from "next";

import { supabase_ADMIN_UNSAFE_FULL_ACCESS } from "../../services/supabase";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  //@ts-ignore
  const { hash } = context.params;

  console.log("hash", hash);

  const { data: email, error: error1 } = await supabase_ADMIN_UNSAFE_FULL_ACCESS
    .from("emails")
    .select("sub")
    .eq("hash", hash)
    .limit(1)
    .maybeSingle();

  if (error1) {
    console.error("error1", error1);
    return { props: { error: true } };
  }

  if (!email) {
    res.status(200).json({ rep: 0, isRealHuman: false });
    return;
  }

  const { data: sender, error: error2 } =
    await supabase_ADMIN_UNSAFE_FULL_ACCESS
      .from("reputation")
      .select("rep")
      .eq("sub", email.sub)
      .limit(1)
      .maybeSingle();

  if (error2) {
    console.error("error2", error2);
    return { props: { error: true } };
  }

  const isRealHuman = !!email.sub;

  // if user doesn't exist, return default rep
  if (!sender || !sender.rep) {
    return { props: { error: true } };
  }

  if (Number(sender.rep) < 0) {
    return { props: { error: true } };
  }

  console.log("rep", sender.rep, isRealHuman);
  return { props: { rep: sender.rep, isRealHuman } };
}

export default function Index(props: { error: boolean, rep: string; isRealHuman: boolean }) {
  if (props.error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Image src={logo} alt="Worldcoinemail Logo" />
        <h1>Invalid hash</h1>

      </div>
    )
  }
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Image src={logo} alt="Worldcoinemail Logo" />

      {props.isRealHuman ? (
        <img src="https://em-content.zobj.net/thumbs/240/apple/354/check-mark-button_2705.png" alt="Real" />
      ) : (
        <img src="https://em-content.zobj.net/thumbs/240/apple/354/cross-mark_274c.png" alt="Fake" />
      )}

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
