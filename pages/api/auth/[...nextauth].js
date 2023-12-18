import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import getAdmins from '../../../services/admins/get'

export const authOptions = {
  // Configure one or more authentication providers
  debug: true,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  callbacks: {
     async jwt({ token, account, profile }) {
      if (profile && profile.login) {
        token.login = profile.login
      }
      return token;
    },
    async session({ session, token }) {
      if (token && token.login) {
        session.login = token.login

        try {
          const admins = getAdmins()
          session.admin = admins.includes(session.login)
        } catch {
          session.admin = false
        }
      }
      return session;
    },
  }
}

export default NextAuth(authOptions)
