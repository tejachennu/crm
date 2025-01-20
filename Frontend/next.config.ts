// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: [
//       'scontent-lhr6-2.cdninstagram.com',
//       'scontent.cdninstagram.com',
//       'scontent-lhr8-1.cdninstagram.com',
//       'scontent-lhr8-2.cdninstagram.com',
//       'scontent-lhr6-1.cdninstagram.com',
//       'scontent-lhr8-1.xx.fbcdn.net',
//       'scontent-lhr6-2.xx.fbcdn.net',
//       'scontent-lhr8-2.xx.fbcdn.net',
//       'scontent-lhr6-1.xx.fbcdn.net'
//     ],
//   },
// }

// module.exports = nextConfig


module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};
