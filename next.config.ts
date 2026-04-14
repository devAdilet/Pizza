import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS || false;

let repo = "Pizza";

const nextConfig: NextConfig = {
  // output: "export", // Disabled to allow Vercel API routes
  basePath: isGithubActions ? `/${repo}` : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
