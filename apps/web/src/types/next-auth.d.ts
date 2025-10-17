import { DefaultJWT, DefaultUser } from "next-auth";

/* session.user.customProperty used to App */
declare module "next-auth" {
  interface Session {
    user?: {
      id: number;
      name: string;
      email: string;
      picture: string;
    };
  }

  /* add customProperty to User */
  interface User extends DefaultUser {
    access_token: string;
    refresh_token: string;
    id_token: string;
  }
}

/* add customProperty to JWT*/
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: string; // from access_token
    access_token?: string;
    refresh_token?: string;
    id_token?: string;
    expired_at?: number; // from access_token
  }
}
