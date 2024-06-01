/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/sync/',
                destination: 'https://mickcarter-slink-64.deno.dev/locals/',
            },
        ]
    }
}

module.exports = nextConfig
