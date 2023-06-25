import { Session } from "next-auth";
import supabase from "./supabase";

export const getAuthUser = async (session: any) => {
  console.log("supabase auth", await supabase.auth.getUser());

  console.log("session", session);
  // HACK: this is a hack for demo purposes, implement proper auth
  return session.user;
};
