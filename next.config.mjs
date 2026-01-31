/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    if (isServer) {
      // This ensures Prisma binaries are included in the serverless bundle
      config.externals = config.externals || [];
      config.externals.push({
        '@prisma/client': 'commonjs @prisma/client',
      });
    }
    return config;
  },
  experimental: {
    // This tells Vercel to include your custom prisma path in the serverless function
    outputFileTracingIncludes: {
      '/api/**/*': ['./lib/generated/prisma/**/*'],
    },
    outputFileTracingRoot: process.cwd(),
  },
};

export default nextConfig;
