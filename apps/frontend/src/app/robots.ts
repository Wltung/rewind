import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',     // Áp dụng cho mọi loại Bot trên đời
      disallow: '/',      // Cấm truy cập vào tất cả các đường dẫn
    },
  }
}