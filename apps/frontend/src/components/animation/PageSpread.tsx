"use client";
import React from "react";

interface Props {
  children?: React.ReactNode;
  side: "left" | "right";
  isOverflowVisible?: boolean;
}

export default function PageSpread({ children, side, isOverflowVisible = false }: Props) {
  const paperNoise = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjY1IiBudW1PY3RhdmVzPSIzIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2YpIiBvcGFjaXR5PSIu0DUiLz48L3N2Zz4=";

  return (
    <div 
      // Đổi thành template string để nhúng isOverflowVisible
      className={`relative w-full h-full paper-grain flex flex-col z-10 ${isOverflowVisible ? 'overflow-visible' : 'overflow-hidden'}
      ${side === "left" ? "page-shadow-left border-r border-black/10 rounded-l-sm" : "page-shadow-right rounded-r-sm"}`}
    >
      <div className="absolute inset-0 pointer-events-none opacity-50 z-0" style={{ backgroundImage: `url(${paperNoise})` }}></div>
      
      {side === "left" ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/5 pointer-events-none z-30"></div>
          <div className="absolute top-0 right-2 w-px h-full bg-black/5 z-30"></div>
        </>
      ) : (
        <>
          <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-black/20 via-black/5 to-transparent pointer-events-none z-30"></div>
          <div className="absolute top-0 left-2 w-px h-full bg-black/10 z-30"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-transparent via-transparent to-black/5 pointer-events-none z-30"></div>
          <div className="absolute top-0 right-0 w-4 h-full bg-gradient-to-l from-white/40 to-transparent pointer-events-none z-30"></div>
        </>
      )}

      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center p-8 md:p-12">
         {children}
      </div>
    </div>
  );
}