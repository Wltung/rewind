import React, { useEffect, useState, useRef } from "react";
import NOTEBOOK_ICONS from "@/assets/material_symbol_icons.json";

export function Notebook() {
  const today = new Date();
  const currentDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;

  const [weatherText, setWeatherText] = useState("Đang nhìn ra cửa sổ... ☁️");

  // State cho Nội dung
  const [title, setTitle] = useState("Hello");
  const [bodyText, setBodyText] = useState("try\nagain!");
  const [footerText, setFooterText] = useState("- Let's song 🎧");
  
  // State cho Icon Material Symbols
  const [iconName, setIconName] = useState(NOTEBOOK_ICONS[0].id);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [bodyText]);

  useEffect(() => {
    // 1. Tách hàm fetch thành một hàm nhận tham số lat và lon
    const fetchWeatherAndLocation = async (lat: number, lon: number) => {
      try {
        const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=vi`);
        const geoData = await geoRes.json();

        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const weatherData = await weatherRes.json();
        
        const code = weatherData.current_weather.weathercode;
        let weatherIcon = "☁️";
        let condition = "Cloudy";
        
        if (code === 0) { weatherIcon = "☀️"; condition = "Sunny"; }
        else if (code === 1 || code === 2 || code === 3) { weatherIcon = "⛅"; condition = "Partly Cloudy"; }
        else if (code >= 45 && code <= 48) { weatherIcon = "🌫️"; condition = "Foggy"; }
        else if (code >= 51 && code <= 67) { weatherIcon = "🌧️"; condition = "Rainy"; }
        else if (code >= 80 && code <= 82) { weatherIcon = "☔"; condition = "Heavy Rain"; }
        else if (code >= 95 && code <= 99) { weatherIcon = "⛈️"; condition = "Thunderstorm"; }

        setWeatherText(`${geoData.locality} - ${condition} ${weatherIcon}`);
      } catch (error) {
        setWeatherText("Thời tiết đẹp 🌤️"); 
      }
    };

    // 2. Tọa độ mặc định (Fallback)
    const defaultLat = 10.789167378446649;
    const defaultLon = 106.73059096401705;

    // 3. Lấy vị trí từ thiết bị
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Thành công: Dùng tọa độ thực tế
          fetchWeatherAndLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          // Lỗi (người dùng từ chối, timeout...): Dùng tọa độ mặc định
          console.warn("Không lấy được vị trí, dùng tọa độ mặc định:", error.message);
          fetchWeatherAndLocation(defaultLat, defaultLon);
        },
        {
          enableHighAccuracy: true, // Ưu tiên GPS độ chính xác cao
          timeout: 10000,           // Timeout 10s
          maximumAge: 0             // Không dùng cache vị trí cũ
        }
      );
    } else {
      // Trình duyệt không hỗ trợ Geolocation
      fetchWeatherAndLocation(defaultLat, defaultLon);
    }
  }, []);

  return (
    <div className="relative md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full max-w-2xl bg-[#FDFBF7] shadow-paper rounded-sm p-8 md:p-12 rotate-1 z-10">
      <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-red-200/50" />
      <div className="relative flex flex-col gap-6 font-hand text-ink">
        <div className="flex justify-between items-start border-b border-primary/20 pb-2">
          <span className="font-typewriter text-sm text-gray-500">Date: {currentDate}</span>
          <span className="font-typewriter text-sm text-gray-500">{weatherText}</span>
        </div>
        
        <div className="text-2xl md:text-3xl pl-8 flex flex-col" style={{ backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #e5e7eb 32px)", lineHeight: "32px", paddingBottom: "4px" }}>
          
          {/* Khúc 1: Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-primary font-bold bg-transparent outline-none w-full placeholder-primary/50 p-0 m-0 mb-[32px] border-none block"
            style={{ lineHeight: "32px" }}
            placeholder="Nhập tiêu đề..."
          />

          {/* Khúc 2: Main Text */}
          <textarea
            ref={textareaRef}
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            className="bg-transparent outline-none w-full resize-none overflow-hidden placeholder-gray-400 p-0 m-0 border-none block"
            style={{ lineHeight: "32px", minHeight: "32px" }}
            rows={bodyText.split('\n').length}
            placeholder="Viết gì đó đi..."
          />

          {/* Khúc 3: Footer */}
          <input
            type="text"
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            className="text-xl text-gray-500 bg-transparent outline-none w-full placeholder-gray-400 p-0 m-0 mt-[32px] border-none block"
            style={{ lineHeight: "32px" }}
            placeholder="Nhập chữ ký hoặc bài hát..."
          />

        </div>

        {/* Khu vực thay đổi Icon ma thuật */}
        <div className="absolute bottom-4 right-8 transform rotate-12 opacity-80">
          <select
            value={iconName}
            onChange={(e) => setIconName(e.target.value)}
            title="Nhấn để đổi Icon"
            className="material-symbols-outlined text-4xl text-primary bg-transparent outline-none border-none appearance-none cursor-pointer pr-1"
          >
            {NOTEBOOK_ICONS.map((icon) => (
              <option key={icon.id} value={icon.id} className="font-sans text-base text-gray-800">
                {icon.id}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Lỗ gáy sổ */}
      <div className="absolute left-[-10px] top-10 w-6 h-6 rounded-full border-4 border-gray-400 bg-[#FDFBF7]" />
      <div className="absolute left-[-10px] bottom-10 w-6 h-6 rounded-full border-4 border-gray-400 bg-[#FDFBF7]" />
      <div className="absolute left-[-10px] top-1/2 w-6 h-6 rounded-full border-4 border-gray-400 bg-[#FDFBF7] -translate-y-1/2" />
    </div>
  );
}