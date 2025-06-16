// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     reactStrictMode: true,
//     images: {
//         remotePatterns: [
//             {
//                 protocol: 'https',
//                 hostname: 'ui-avatars.com',
//                 port: '',
//                 pathname: '/api/**',
//             },
//         ],
//     },
// }
// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ui-avatars.com',
                port: '',
                pathname: '/api/**',
            },
        ],
    },
}
export default nextConfig;