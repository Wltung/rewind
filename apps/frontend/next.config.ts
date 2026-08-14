import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    const isDev = process.env.NODE_ENV === 'development';

    return [
      {
        // Khi trình duyệt gọi /api/...
        source: '/api/:path*',
        // Vercel sẽ ngầm chuyển tiếp đến Render
        destination: isDev 
          ? 'http://localhost:8080/api/:path*' // Nếu là Dev (Local): Chọc xuống Backend Go
          : 'https://rewind-api-2muu.onrender.com/api/:path*', // Nếu là Prod: Giữ nguyên 
      },
      {
        // ---> THÊM ĐOẠN NÀY: Khi trình duyệt đòi tải ảnh tĩnh <---
        source: '/uploads/:path*',
        destination: isDev 
          ? 'http://localhost:8080/uploads/:path*'
          : 'https://rewind-api-2muu.onrender.com/uploads/:path*',
      },
    ]
  },
};

export default nextConfig;
