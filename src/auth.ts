import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },

  pages: {
    signIn: "/login", // your custom login page
  },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();

        // select('+password') because we set select:false on the field
        const user = await User.findOne({ email: credentials.email }).select(
          "+password",
        );
        if (!user) return null;

        const isValid = await user.comparePassword(
          credentials.password as string,
        );
        if (!isValid) return null;

        // this object becomes the JWT token payload
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    // jwt() runs when token is created or updated
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // inject role into token
      }
      return token;
    },

    // session() runs whenever session is accessed in your app
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string; // expose role to client
      }
      return session;
    },
  },
});
