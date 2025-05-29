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
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Resolve Node.js core modules that are not available in the browser for Webpack
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        fs: false, // fs cannot be polyfilled for the browser, use false or a no-op module
        net: false,
        tls: false,
        cardinal: false,
        child_process: false,
        crypto: require.resolve('crypto-browserify'),
        os: require.resolve('os-browserify/browser'), // Use os-browserify polyfill
        path: false, // Or require.resolve('path-browserify') if needed
        stream: require.resolve('stream-browserify'),
        http: false, // Or require.resolve('stream-http') if needed
        https: false, // Or require.resolve('https-browserify') if needed
        zlib: require.resolve('browserify-zlib'),
        buffer: require.resolve('buffer/'),
        url: require.resolve('url/'), // Use url polyfill
        util: false, // Or require.resolve('util/') if needed
      };
    }
    return config;
  },
  turbopack: {
    resolveAlias: {
      fs: "next/dist/shared/lib/noop",
      net: "next/dist/shared/lib/noop",
      tls: "next/dist/shared/lib/noop",
      cardinal: "next/dist/shared/lib/noop",
      child_process: "next/dist/shared/lib/noop",
      crypto: "crypto-browserify",
      os: "os-browserify/browser", // Use os-browserify polyfill
      path: "next/dist/shared/lib/noop", // Or "path-browserify"
      stream: "stream-browserify",
      http: "next/dist/shared/lib/noop", // Or "stream-http"
      https: "next/dist/shared/lib/noop", // Or "https-browserify"
      zlib: "browserify-zlib",
      buffer: "buffer/",
      url: "url/", // Use url polyfill
      util: "next/dist/shared/lib/noop", // Or "util/"
    },
  },
};

export default nextConfig;