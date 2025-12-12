import NextAuth, { NextAuthOptions, Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { proxyToPHP } from '@/lib/php-api';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // Call PHP backend for authentication
          const response = await proxyToPHP('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            const error = await response.json();
            if (error.error === 'Account banned') {
              throw new Error('Account banned');
            }
            throw new Error('Invalid credentials');
          }

          const data = await response.json();
          const { token, role } = data;

          // Decode JWT to get user info (simplified - in production, verify signature)
          const payload = JSON.parse(atob(token.split('.')[1]));
          
          return {
            id: payload.id.toString(),
            email: payload.email,
            role: role as 'admin' | 'coordinator' | 'driver',
            adminRole: role === 'admin' ? 'admin' : null,
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.role = user.role;
        token.adminRole = user.adminRole;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.adminRole = token.adminRole;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };