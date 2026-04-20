/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},

  async redirects() {
    return [
      {
        source: '/:path*',
        destination: 'https://successdoor.vercel.app/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;