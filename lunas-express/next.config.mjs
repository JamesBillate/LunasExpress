/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/login",
        destination: "/authcomponents/login",
      },
      {
        source: "/signup",
        destination: "/authcomponents/signup",
      },
      {
        source: "/forgotpw",
        destination: "/authcomponents/forgot-pw",
      },
    ];
  },
};

export default nextConfig;
