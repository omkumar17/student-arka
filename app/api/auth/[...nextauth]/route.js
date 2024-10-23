import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id:'enrollment',
      name: 'Credentials',
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "Password", type: "password" },
        userType: { label: "UserType", type: "text" },
      },
      async authorize(credentials, req) {
        try {
          const res = await fetch("https://bus-arka-server.vercel.app/StudentLogin", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              enrollment: credentials.username,
              userType: credentials.userType,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            throw new Error('Failed to authorize');
          }

          const user = await res.json();
          
          
          if (user && user.enrollment && user.userType) {
            return user;
          } else {
            return null;
          }
        } catch (error) {
          console.error("Authorization error:", error.message);
          return null;
        }
      },
    }),

    CredentialsProvider({
      id:'otp',
      name: 'otpCredentials',
      credentials: {
        email2: { label: "email2", type: "text" }, 
        enrollment: { label: "enrollment", type: "text" }, 
        userType2: { label: "User Type2", type: "text" },
        firstName2: { label: "User Type2", type: "text" },
       
      },
      async authorize(credentials, req) {
        
       
          const user = {enrollment:credentials.enrollment,email:credentials.email2,userType:credentials.userType2,firstName:credentials.firstName2};
            return user;
        
      },
    }),
  

  ],
  callbacks: {
    async jwt({ token, user }) {
      // Attach user properties to token if available
      
      if (user && user.userType==='student') {
        token.id = user.enrollment;
        token.email = user.email;
        token.userType = user.userType;
        token.firstName = user.firstName;
      }
      return token;
    },
    async session({ session, token }) {
      try {
        // Ensure token has necessary fields
        if (token && token.id) {
          session.user.enrollment = token.id;
          session.user.email = token.email;
          session.user.userType = token.userType;
          session.user.firstName = token.firstName;
        } else {
          throw new Error("ID not available in token");
        }
        return session;
      } catch (error) {
        console.error("Session error:", error.message);
        return null;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
