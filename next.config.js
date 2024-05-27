/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/sync/:path*',
                destination: 'https://mickcarter-slink-64.deno.dev/locals/:path*',
            },
        ]
    }
}

module.exports = nextConfig
