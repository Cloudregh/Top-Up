import type { NextConfig } from "next";

const API_URL = process.env.API_URL ?? "https://pharma-api-219993612151.europe-west1.run.app";

const nextConfig: NextConfig = {
  // Lets checks/CI build into a separate folder without clobbering a running `next dev`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Proxy the API through our own origin so the httpOnly refresh cookie is
  // first-party and we never fight CORS from the browser.
  async rewrites() {
    return [{ source: "/api/v1/:path*", destination: `${API_URL}/api/v1/:path*` }];
  },
};

export default nextConfig;
