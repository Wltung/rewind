"use client";
import React from "react";
import PageSpread from "../PageSpread";

export const BloomingCalendarPage = ({ onNext }: { onNext: () => void }) => (
  <PageSpread side="right">
    <div className="relative bg-white w-[90%] h-[85%] shadow-[3px_5px_15px_rgba(0,0,0,0.08)] border border-stone-200 flex flex-col items-center pt-8 pb-4 rounded-sm rotate-[1deg]">
      {/* 4 miếng băng dính */}
      <div className="washi-tape green w-16 h-5 absolute -top-2 -left-4 rotate-[-35deg]"></div>
      <div className="washi-tape pink w-16 h-5 absolute -top-2 -right-4 rotate-[35deg]"></div>
      <div className="washi-tape w-16 h-5 absolute -bottom-2 -left-4 rotate-[25deg]"></div>
      <div className="washi-tape green w-16 h-5 absolute -bottom-2 -right-4 rotate-[-25deg]"></div>
      
      <div className="font-['Courier_Prime'] text-xl text-stone-500 font-bold mb-6 uppercase tracking-widest border-b border-stone-300 pb-2 w-[80%] text-center">March</div>
      
      <div className="grid grid-cols-7 gap-y-4 gap-x-6 text-center font-['Courier_Prime'] text-stone-400 text-sm w-[80%] relative z-30">
        <div className="font-bold text-stone-800">S</div><div className="font-bold text-stone-800">M</div><div className="font-bold text-stone-800">T</div><div className="font-bold text-stone-800">W</div><div className="font-bold text-stone-800">T</div><div className="font-bold text-stone-800">F</div><div className="font-bold text-stone-800">S</div>
        <div></div><div></div><div></div><div>1</div><div>2</div><div>3</div><div>4</div>
        <div>5</div><div>6</div><div>7</div>
        <div className="relative"><span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-['Caveat'] text-7xl font-bold text-pink-500 glowing-eight z-10">8</span></div>
        <div>9</div><div>10</div><div>11</div>
        <div>12</div><div>13</div><div>14</div><div>15</div><div>16</div><div>17</div><div>18</div>
        <div>19</div><div>20</div><div>21</div><div>22</div><div>23</div><div>24</div><div>25</div>
        <div>26</div><div>27</div><div>28</div><div>29</div><div>30</div><div>31</div><div></div>
      </div>

      {/* SVG Dây leo và nụ hoa */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 350 450" xmlns="http://www.w3.org/2000/svg">
        <path className="vine-path" d="M 175 180 C 190 190, 220 200, 240 180 C 260 160, 280 170, 290 200 C 300 230, 310 260, 290 290 C 270 320, 290 350, 310 370 C 330 390, 340 410, 320 430" fill="none" stroke="#7cb342" strokeLinecap="round" strokeWidth="2.5"></path>
        <path className="vine-path" d="M 175 180 C 160 190, 130 200, 110 180 C 90 160, 70 170, 60 200 C 50 230, 40 260, 60 290 C 80 320, 60 350, 40 370 C 20 390, 10 410, 30 430" fill="none" stroke="#7cb342" strokeLinecap="round" strokeWidth="2.5"></path>
        <g className="flower-bud" transform="translate(240, 180) rotate(45)"><path d="M 0 0 C 5 -10, 15 -10, 20 0 C 15 10, 5 10, 0 0" fill="#aed581"></path></g>
        <g className="flower-bud" transform="translate(110, 180) rotate(-45)"><path d="M 0 0 C -5 -10, -15 -10, -20 0 C -15 10, -5 10, 0 0" fill="#aed581"></path></g>
        <g className="flower-bud" transform="translate(290, 200) rotate(15)"><path d="M 0 0 C 5 -8, 12 -8, 15 0 C 12 8, 5 8, 0 0" fill="#aed581"></path></g>
        <g className="flower-bud" transform="translate(60, 200) rotate(-15)"><path d="M 0 0 C -5 -8, -12 -8, -15 0 C -12 8, -5 8, 0 0" fill="#aed581"></path></g>
        <g className="flower-bud" transform="translate(260, 160)"><circle cx="0" cy="0" fill="#ffee58" r="3"></circle><circle cx="0" cy="-5" fill="#f48fb1" r="4"></circle><circle cx="5" cy="0" fill="#f48fb1" r="4"></circle><circle cx="0" cy="5" fill="#f48fb1" r="4"></circle><circle cx="-5" cy="0" fill="#f48fb1" r="4"></circle></g>
        <g className="flower-bud" transform="translate(90, 160)"><circle cx="0" cy="0" fill="#ffee58" r="2.5"></circle><circle cx="0" cy="-4" fill="#ce93d8" r="3.5"></circle><circle cx="4" cy="0" fill="#ce93d8" r="3.5"></circle><circle cx="0" cy="4" fill="#ce93d8" r="3.5"></circle><circle cx="-4" cy="0" fill="#ce93d8" r="3.5"></circle></g>
        <g className="flower-bud" transform="translate(290, 290)"><circle cx="0" cy="0" fill="#ffee58" r="2"></circle><circle cx="0" cy="-3" fill="#81d4fa" r="3"></circle><circle cx="3" cy="0" fill="#81d4fa" r="3"></circle><circle cx="0" cy="3" fill="#81d4fa" r="3"></circle><circle cx="-3" cy="0" fill="#81d4fa" r="3"></circle></g>
        <g className="flower-bud" transform="translate(60, 290)"><circle cx="0" cy="0" fill="#ffee58" r="2"></circle><circle cx="0" cy="-3" fill="#ffab91" r="3"></circle><circle cx="3" cy="0" fill="#ffab91" r="3"></circle><circle cx="0" cy="3" fill="#ffab91" r="3"></circle><circle cx="-3" cy="0" fill="#ffab91" r="3"></circle></g>
      </svg>
      
      {/* Hiệu ứng Bướm bay */}
      <div className="butterfly-container">
        <svg height="30" viewBox="0 0 30 30" width="30" xmlns="http://www.w3.org/2000/svg">
          <g className="butterfly-wing" transform="translate(15, 15)"><path d="M 0 0 C -10 -15, -20 -5, -15 5 C -10 15, -5 10, 0 0" fill="#fff" opacity="0.8" stroke="#f48fb1" strokeWidth="1"></path><path d="M -2 -2 C -8 -10, -12 -2, -10 3" fill="none" opacity="0.6" stroke="#f48fb1" strokeWidth="0.5"></path></g>
          <g className="butterfly-wing-right" transform="translate(15, 15)"><path d="M 0 0 C 10 -15, 20 -5, 15 5 C 10 15, 5 10, 0 0" fill="#fff" opacity="0.8" stroke="#f48fb1" strokeWidth="1"></path><path d="M 2 -2 C 8 -10, 12 -2, 10 3" fill="none" opacity="0.6" stroke="#f48fb1" strokeWidth="0.5"></path></g>
          <ellipse cx="15" cy="15" fill="#4a4a4a" rx="1.5" ry="5"></ellipse><circle cx="15" cy="10" fill="#4a4a4a" r="1.5"></circle>
        </svg>
      </div>
    </div>

    <div className="absolute bottom-8 right-10 z-40 flex items-center gap-2 text-stone-500 opacity-70 hover:opacity-100 transition-opacity cursor-pointer pointer-events-auto" onClick={(e) => { e.stopPropagation(); onNext(); }}>
      <span className="font-['Caveat'] text-2xl font-bold">Còn nữa nè...</span>
      <span className="material-symbols-outlined animate-pulse text-xl">arrow_forward</span>
    </div>
  </PageSpread>
);