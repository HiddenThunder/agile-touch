import { Session } from "next-auth";

export const getAuth = (session: Session) => {
  // HACK: this is a hack for demo purposes, implement proper auth
  return true;
};
