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
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" }
			},

			async authorize(credentials) {
				// Connect to database
				await connectDB()

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

            if(account?.provider === "credentials" || account?.provider === "google" || account?.provider === "github") {
                return true
            }

            return false 
		},


		async jwt({ token, user }) {
			console.log(user)
			
			if (user) {
				//Add custom field to the token
				token.id = user.id
				//token.role = user.role
			}
			return token
		},

		
		async session({ session, token }) {
			session.user.id = token.id
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
		signIn: '/login', // Custom login page 
		
	},
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }