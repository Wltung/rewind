"use client";
import React from "react";
import PageSpread from "../PageSpread";

// MẶT TRÁI (Lời chúc kết mạc đỏ đô)
export const CelebrationTextBack = () => (
  <PageSpread side="left">
    <div className="relative z-20 w-full h-full flex flex-col items-center justify-center p-12">
      <h2 className="celebration-text text-[3.5rem] md:text-[4.5rem] leading-tight text-center tracking-wide font-bold">
          Chúc em một<br/>ngày 8/3<br/>thật vuiiiii.
      </h2>
    </div>
  </PageSpread>
);

// MẶT PHẢI (Hộp quà bùng nổ)
export const CelebrationBoxFront = ({ isShining }: { isShining: boolean }) => {
  
  // Ma trận tọa độ bắn ra của các hạt (tx, ty là hướng bay; s là độ lớn; r là độ nghiêng)
  const burstItems = [
    { type: 'star', color: '#fbbf24', tx: '0px', ty: '-190px', s: 1.5, r: '15deg', delay: '0s' },
    { type: 'star', color: '#f472b6', tx: '-80px', ty: '-150px', s: 1.2, r: '-15deg', delay: '0.1s' },
    { type: 'star', color: '#2dd4bf', tx: '80px', ty: '-140px', s: 1.4, r: '25deg', delay: '0.2s' },
    { type: 'star', color: '#818cf8', tx: '-40px', ty: '-110px', s: 0.9, r: '45deg', delay: '0.15s' },
    { type: 'star', color: '#fcd34d', tx: '50px', ty: '-90px', s: 1.1, r: '-30deg', delay: '0.25s' },
    { type: 'star', color: '#fb7185', tx: '-110px', ty: '-100px', s: 1.3, r: '10deg', delay: '0.3s' },
    { type: 'star', color: '#34d399', tx: '130px', ty: '-100px', s: 1, r: '-10deg', delay: '0.35s' },

    { type: 'balloon', color: '#c084fc', tx: '-100px', ty: '-210px', s: 1.1, r: '-15deg', delay: '0.4s' },
    { type: 'balloon', color: '#7dd3fc', tx: '90px', ty: '-200px', s: 1, r: '15deg', delay: '0.45s' },
    { type: 'balloon', color: '#fca5a5', tx: '30px', ty: '-240px', s: 0.9, r: '5deg', delay: '0.5s' },

    { type: 'ribbon', color: '#f87171', tx: '-50px', ty: '-70px', s: 1.2, r: '20deg', delay: '0.2s' },
    { type: 'ribbon', color: '#34d399', tx: '60px', ty: '-80px', s: 1.1, r: '65deg', delay: '0.35s' },
    { type: 'ribbon', color: '#fbbf24', tx: '-20px', ty: '-130px', s: 1, r: '-20deg', delay: '0.55s' },

    { type: 'dot', color: '#fbbf24', tx: '-130px', ty: '-160px', s: 1, r: '0deg', delay: '0.3s' },
    { type: 'dot', color: '#f472b6', tx: '120px', ty: '-150px', s: 1.5, r: '0deg', delay: '0.1s' },
    { type: 'dot', color: '#2dd4bf', tx: '-30px', ty: '-170px', s: 1.2, r: '0deg', delay: '0.4s' },
    { type: 'dot', color: '#a78bfa', tx: '40px', ty: '-160px', s: 1.8, r: '0deg', delay: '0.25s' },
    { type: 'dot', color: '#fb7185', tx: '140px', ty: '-70px', s: 1, r: '0deg', delay: '0.6s' },
    { type: 'dot', color: '#34d399', tx: '-90px', ty: '-190px', s: 1.3, r: '0deg', delay: '0.45s' },

    { type: 'note', color: '#5d4037', tx: '150px', ty: '-130px', s: 0.9, r: '15deg', delay: '0.5s' },
    { type: 'note', color: '#5d4037', tx: '-140px', ty: '-90px', s: 0.8, r: '-15deg', delay: '0.6s' },

    { type: 'flower', color: '#f8bbd0', tx: '-150px', ty: '-50px', s: 0.8, r: '10deg', delay: '0.5s' },
    { type: 'flower', color: '#fef08a', tx: '160px', ty: '-80px', s: 0.9, r: '-20deg', delay: '0.4s' },
  ];

  const renderBurstItem = (item: any, i: number) => {
    const style = { '--tx': item.tx, '--ty': item.ty, '--s': item.s, '--r': item.r, animationDelay: item.delay } as React.CSSProperties;

    if (item.type === 'star') return (
      <svg key={i} className="burst-item w-10 h-10 drop-shadow-sm" style={style} viewBox="0 0 24 24" fill={item.color} stroke="#5d4037" strokeWidth="1">
        <path d="M12 2L15 9L22 9L16 14L18 21L12 17L6 21L8 14L2 9L9 9Z" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    );
    if (item.type === 'balloon') return (
      <svg key={i} className="burst-item w-10 h-14 drop-shadow-sm" style={style} viewBox="0 0 20 30">
        <ellipse cx="10" cy="12" rx="8" ry="10" fill={item.color} stroke="#5d4037" strokeWidth="1.5"/>
        <path d="M8 22 L12 22 L10 24 Z" fill={item.color} stroke="#5d4037" strokeWidth="1"/>
        <path d="M10 24 Q12 28 8 30" fill="none" stroke="#5d4037" strokeWidth="1"/>
        <path d="M7 8 A 4 4 0 0 1 11 6" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      </svg>
    );
    if (item.type === 'dot') return (
      <svg key={i} className="burst-item w-4 h-4" style={style} viewBox="0 0 10 10">
        <circle cx="5" cy="5" r="4" fill={item.color} stroke="#5d4037" strokeWidth="1"/>
      </svg>
    );
    if (item.type === 'ribbon') return (
      <svg key={i} className="burst-item w-8 h-8" style={style} viewBox="0 0 20 20">
        <path d="M 2 10 Q 5 0, 10 10 T 18 10" fill="none" stroke={item.color} strokeWidth="3" strokeLinecap="round"/>
      </svg>
    );
    if (item.type === 'note') return (
      <svg key={i} className="burst-item w-6 h-6" style={style} viewBox="0 0 24 24" fill="none" stroke="#5d4037" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3" fill={item.color}></circle><circle cx="18" cy="16" r="3" fill={item.color}></circle>
      </svg>
    );
    if (item.type === 'flower') return (
      <svg key={i} className="burst-item w-8 h-8" style={style} viewBox="0 0 30 30">
        <circle cx="15" cy="15" fill={item.color} r="10" stroke="#5d4037" strokeWidth="1.5"></circle>
        <circle cx="15" cy="15" fill="#fff" r="3"></circle>
        <path d="M 15 5 L 15 10 M 15 20 L 15 25 M 5 15 L 10 15 M 20 15 L 25 15" stroke="#5d4037" strokeWidth="1"/>
      </svg>
    );
    return null;
  };

  return (
    <PageSpread side="right" isOverflowVisible={true}>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-32 pb-12 z-20 pointer-events-none">
        
        {/* VÙNG BUNG TỎA: Tâm phát nổ nằm ở ngay miệng hộp */}
        <div className="relative w-10 h-10 z-10">
          {isShining && burstItems.map((item, i) => renderBurstItem(item, i))}
        </div>

        {/* HỘP QUÀ VẼ TAY (Nằm dưới cùng, miệng hộp hơi há ra) */}
        <div className="relative w-48 h-48 -mt-10 gift-box-wiggle">
          <svg className="w-full h-full drop-shadow-md" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            {/* Lòng hộp */}
            <path d="M 40 100 L 160 100 L 140 120 L 60 120 Z" fill="#d97706" stroke="#5d4037" strokeWidth="2" strokeLinejoin="round"/>
            {/* Thân hộp Isometric */}
            <path d="M 60 120 L 140 120 L 140 180 L 60 180 Z" fill="#fef3c7" stroke="#5d4037" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M 140 120 L 160 100 L 160 160 L 140 180 Z" fill="#fde68a" stroke="#5d4037" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M 40 100 L 60 120 L 60 180 L 40 160 Z" fill="#fcd34d" stroke="#5d4037" strokeWidth="2" strokeLinejoin="round"/>
            {/* Dây ruy băng dọc ngang hộp */}
            <rect x="90" y="120" width="20" height="60" fill="#fca5a5" stroke="#5d4037" strokeWidth="2"/>
            <rect x="60" y="140" width="80" height="20" fill="#fca5a5" stroke="#5d4037" strokeWidth="2"/>
            {/* Nắp hộp lật nghiêng sang trái */}
            <g transform="translate(5, 140) rotate(-35)">
               <path d="M 0 0 L 100 0 L 100 25 L 0 25 Z" fill="#fde68a" stroke="#5d4037" strokeWidth="2"/>
               <rect x="40" y="0" width="20" height="25" fill="#fca5a5" stroke="#5d4037" strokeWidth="2"/>
               {/* Nơ trên nắp */}
               <path d="M 50 0 C 20 -30, -10 -10, 50 0 C 80 -30, 110 -10, 50 0" fill="#ef4444" stroke="#5d4037" strokeWidth="2"/>
            </g>
          </svg>
        </div>

      </div>
    </PageSpread>
  );
}