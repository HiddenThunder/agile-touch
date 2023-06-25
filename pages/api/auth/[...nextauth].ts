import NextAuth from "next-auth";

import { authOptions } from "../../../services/nextAuthOptions";

// @ts-ignore
export default NextAuth(authOptions);
