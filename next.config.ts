import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.jitsi.net https://meet.jit.si; connect-src 'self' https://*.jitsi.net https://meet.jit.si wss://*.jitsi.net wss://meet.jit.si http://localhost:4000 http://localhost:4000/api; img-src 'self' data: https://*.jitsi.net https://meet.jit.si; style-src 'self' 'unsafe-inline' https://*.jitsi.net https://meet.jit.si; frame-src 'self' https://*.jitsi.net https://meet.jit.si; font-src 'self' https://*.jitsi.net https://meet.jit.si;"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
