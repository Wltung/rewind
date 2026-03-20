import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        // Khi trình duyệt gọi /api/...
        source: '/api/:path*',
        // Vercel sẽ ngầm chuyển tiếp đến Render
        destination: 'https://rewind-api-2muu.onrender.com/api/:path*', 
      },
      {
        // ---> THÊM ĐOẠN NÀY: Khi trình duyệt đòi tải ảnh tĩnh <---
        source: '/uploads/:path*',
        destination: 'https://rewind-api-2muu.onrender.com/uploads/:path*', 
      },
    ]
  },
};

export default nextConfig;
