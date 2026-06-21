import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" }, // demo testimonial avatars
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google avatars
    ],
  },
};

export default nextConfig;
