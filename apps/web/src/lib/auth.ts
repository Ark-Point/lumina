import { type AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
  providers: [], // auth provider
  callbacks: {
    async signIn() {
      // add response data
      {
        try {
          return true;
        } catch (error) {
          throw new Error(`[ Next-Auth - signIn ] Falid API Login / reason: ${error}`);
        }
      }
    },
    async jwt() {
      // { token, account, user, trigger, session }
      try {
        return Promise.resolve(true);
      } catch (error) {
        console.error(error);
        return Promise.resolve({});
      }
    },
    async session({ session, token, user }) {
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
