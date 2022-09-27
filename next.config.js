/* eslint-disable @typescript-eslint/no-var-requires */
const { i18n } = require("./next-i18next.config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: "localhost" },
      { hostname: "**.gravatar.com" },
      { hostname: "egliselyongerland.org" },
    ],
  },

  i18n,
};

module.exports = nextConfig;
