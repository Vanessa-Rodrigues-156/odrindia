/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Security headers
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(self), geolocation=(), interest-cohort=()',
          },
          // Content Security Policy - customize for production
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.jitsi.net https://meet.jit.si; connect-src 'self' https://*.jitsi.net https://meet.jit.si wss://*.jitsi.net wss://meet.jit.si; style-src 'self' 'unsafe-inline' https://*.jitsi.net https://meet.jit.si; img-src 'self' data: blob: https://*.jitsi.net https://meet.jit.si; media-src 'self' blob: https://*.jitsi.net https://meet.jit.si; frame-src 'self' https://*.jitsi.net https://meet.jit.si;`,
          },
        ],
      },
    ];
  },
  
  // Enable image optimization
  images: {
    //domains: ['meet.jit.si'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.jitsi.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Production optimizations
  swcMinify: true,
  
  // Output configuration for containerized deployments
  output: 'standalone',
};

export default nextConfig;
