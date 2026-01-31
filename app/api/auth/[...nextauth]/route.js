import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'; 

export const authOptions = {
	providers: [
		// Email & Password login
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: { label: "email", type: "email" },
				password: { label: "password", type: "password" }
			},

			async authorize(credentials) {
				// Find user by email
				//const mongiUser = await User.findOne({ email: credentials.email })

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email  }
                });
				
				// Check if user exists and has password
				if (!user || !user.password) {
				    throw new Error('Invalid credentials')
				}

				// Check if password matches
				const passwordMatch = await bcrypt.compare(credentials.password, user.password)
				
				if (!passwordMatch) {
				    throw new Error('Invalid credentials')
				}

				// Return user data
				return {
                    id: user.user_id,
                    name: user.name,
                    email: user.email,
				}
			}
		}),

		// Google OAuth login
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),

		// GitHub OAuth
		GitHubProvider({
			clientId: process.env.AUTH_GITHUB_ID,
			clientSecret: process.env.AUTH_GITHUB_SECRET,
		}),
	],

	callbacks: {
		async signIn({user, account, profile }) {
            console.log('user ==== ', user)  //{ id: '696b60b875b88eaeecc82914', email: 'k.shaujie@gmail.com' }
            console.log("account ==== ", account)
            console.log("profile ==== ",profile)  

            if(account?.provider === "credentials") {
                return true
            } 
			
			if (account?.provider === "google" || account?.provider === "github") {
				if (!user.email) {
					throw new Error("Email not provided by OAuth provider");
				}

				// check if they already had account
				const accountExist = await prisma.user.findUnique({
					where: { email: user.email }
				});

				// if no, register the user
				if (!accountExist) {
					await prisma.user.create({
						data: {
							email: user.email,
							image: user.image, // Next-Auth normalizes this from picture/avatar_url
							name: user.name
						}
					});
				}
				return true;
			}

            return false 
		},


		async jwt({ token, user, account, trigger }) {
			console.log("jwt token line 101:: ", token)
			console.log("jwt user line 102:: ", user)
			console.log("the acc line 103", account)
			// Initial sign in
			if (user) {
				const dbUser = await prisma.user.findUnique({
					where: { email: user.email }
				});
				token.id = dbUser?.user_id;
				token.picture = dbUser?.image
				
			}
			console.log('token line 115', token)
			return token;
		},

		async session({ session, token }) {
			console.log("session session line 120:: ", session)
			console.log("session token line 121:: ", token)
			session.user_id = token.id

			console.log("session final ----- IMPORTANT ---- line 124:: ", session)
			return session
		}
	},

	session: {
		strategy: 'jwt', 
		maxAge: 30 * 24 * 60 * 60, // 30 days (in seconds)
		updateAge: 24 * 60 * 60,   //If user is active, refresh session every 24 hours
	},


	secret: process.env.NEXTAUTH_SECRET, 

	pages: {
		signIn: '/', // Redirects to your home page instead of /api/auth/signin
    	error: '/',  // Redirects login errors back to your home page
	},
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }