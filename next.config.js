/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "wp.egliselyongerland.org", "1.gravatar.com"],
  },
};

module.exports = nextConfig;
