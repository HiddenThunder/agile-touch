import LoginButton from "../components/login-btn";
import Profile from "../components/profile";
import { useCallback } from "react";
import { IDKitWidget } from "@worldcoin/idkit";
import styles from "../styles/Home.module.css";
import type { ISuccessResult } from "@worldcoin/idkit";

export default function Index() {
  const handleProof = useCallback((result: ISuccessResult) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 3000);
      // NOTE: Example of how to decline the verification request and show an error message to the user
    });
  }, []);

  const onSuccess = (result: ISuccessResult) => {
    console.log(result);
  };

  return (
    <>
      <LoginButton />
      <Profile />
    </>
  );
}
