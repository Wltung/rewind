import React, { useEffect, useState, useRef } from "react";
import NOTEBOOK_ICONS from "@/assets/material_symbol_icons.json";
import { useNotebook } from "@/hooks/useNotebook";

export function Notebook() {
  const today = new Date();
  const currentDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;

  const [weatherText, setWeatherText] = useState("Đang nhìn ra cửa sổ... ☁️");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sử dụng Hook tự tạo
  const {
    title, setTitle,
    bodyText, setBodyText,
    footerText, setFooterText,
    iconName, setIconName,
    isSaving,
    isLoading
  } = useNotebook();

  // Resize Textarea tự động
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [bodyText]);

  // Lấy thời tiết & định vị
  useEffect(() => {
    const fetchWeatherAndLocation = async (lat: number, lon: number) => {
      try {
        const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=vi`);
        const geoData = await geoRes.json();

        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const weatherData = await weatherRes.json();
        
        const code = weatherData.current_weather.weathercode;
        let weatherIcon = "☁️"; let condition = "Cloudy";
        if (code === 0) { weatherIcon = "☀️"; condition = "Sunny"; }
        else if (code <= 3) { weatherIcon = "⛅"; condition = "Partly Cloudy"; }
        else if (code <= 48) { weatherIcon = "🌫️"; condition = "Foggy"; }
        else if (code <= 67) { weatherIcon = "🌧️"; condition = "Rainy"; }
        else if (code <= 82) { weatherIcon = "☔"; condition = "Heavy Rain"; }
        else if (code <= 99) { weatherIcon = "⛈️"; condition = "Thunderstorm"; }

        setWeatherText(`${geoData.locality} - ${condition} ${weatherIcon}`);
      } catch (error) {
        setWeatherText("Thời tiết đẹp 🌤️"); 
      }
    };

    const defaultLat = 10.789167378446649;
    const defaultLon = 106.73059096401705;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeatherAndLocation(pos.coords.latitude, pos.coords.longitude),
        (error) => {
          console.warn("Không lấy được vị trí, dùng tọa độ mặc định:", error.message);
          fetchWeatherAndLocation(defaultLat, defaultLon);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      fetchWeatherAndLocation(defaultLat, defaultLon);
    }
  }, []);

  return (
    <div className="relative md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full max-w-2xl bg-[#FDFBF7] shadow-paper rounded-sm p-8 md:p-12 rotate-1 z-10">
      
      {isSaving && (
        <span className="absolute top-4 right-4 text-xs text-gray-400 font-sans animate-pulse">
          Đang lưu...
        </span>
      )}
      
      {isLoading && (
        <span className="absolute top-4 right-4 text-xs text-gray-400 font-sans animate-pulse">
          Đang tải...
        </span>
      )}

      {/* Vạch đỏ: Thêm pointer-events-none */}
      <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-red-200/50 pointer-events-none" />
      
      <div className="relative flex flex-col gap-6 font-hand text-ink">
        <div className="flex justify-between items-start border-b border-primary/20 pb-2">
          <span className="font-typewriter text-sm text-gray-500">Date: {currentDate}</span>
          <span className="font-typewriter text-sm text-gray-500">{weatherText}</span>
        </div>
        
        <div className="text-2xl md:text-3xl pl-8 flex flex-col relative" style={{ backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #e5e7eb 32px)", lineHeight: "32px", paddingBottom: "4px" }}>
          
          {/* TITLE: Đổi thành Textarea 1 dòng */}
          <textarea
            value={title}
            // replace(/\n/g, '') để cấm người dùng gõ Enter xuống dòng
            onChange={(e) => setTitle(e.target.value.replace(/\n/g, ''))}
            disabled={isLoading}
            rows={1}
            className="text-primary font-bold bg-transparent outline-none w-full resize-none overflow-hidden placeholder-primary/50 p-0 m-0 mb-[32px] border-none block disabled:opacity-50 relative z-20"
            style={{ lineHeight: "32px", minHeight: "32px", height: "32px" }}
            placeholder="Nhập tiêu đề..."
          />

          {/* BODY: Giữ nguyên Textarea */}
          <textarea
            ref={textareaRef}
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            disabled={isLoading}
            className="bg-transparent outline-none w-full resize-none overflow-hidden placeholder-gray-400 p-0 m-0 border-none block disabled:opacity-50 relative z-20"
            style={{ lineHeight: "32px", minHeight: "32px" }}
            rows={Math.max(1, bodyText.split('\n').length)}
            placeholder="Viết gì đó đi..."
          />

          {/* FOOTER: Đổi thành Textarea 1 dòng, thêm pr-24 để né hẳn cái Icon */}
          <textarea
            value={footerText}
            onChange={(e) => setFooterText(e.target.value.replace(/\n/g, ''))}
            disabled={isLoading}
            rows={1}
            className="text-xl text-gray-500 bg-transparent outline-none w-full resize-none overflow-hidden placeholder-gray-400 p-0 m-0 mt-[32px] border-none block disabled:opacity-50 relative z-20 pr-24"
            style={{ lineHeight: "32px", minHeight: "32px", height: "32px" }}
            placeholder="Nhập chữ ký hoặc bài hát..."
          />

        </div>

        {/* Icon Chọn: Giới hạn kích thước hộp thẻ select lại (w-12) để không đè footer */}
        <div className="absolute bottom-4 right-8 transform rotate-12 opacity-80 z-30 w-12 h-12 flex justify-center items-center">
          <select
            value={iconName}
            onChange={(e) => setIconName(e.target.value)}
            disabled={isLoading}
            title="Nhấn để đổi Icon"
            className="material-symbols-outlined text-4xl text-primary bg-transparent outline-none border-none appearance-none cursor-pointer disabled:opacity-50 w-full h-full text-center"
          >
            {NOTEBOOK_ICONS.map((icon) => (
              <option key={icon.id} value={icon.id} className="font-sans text-base text-gray-800">
                {icon.id}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Lỗ gáy sổ: Thêm pointer-events-none */}
      <div className="absolute left-[-10px] top-10 w-6 h-6 rounded-full border-4 border-gray-400 bg-[#FDFBF7] pointer-events-none" />
      <div className="absolute left-[-10px] bottom-10 w-6 h-6 rounded-full border-4 border-gray-400 bg-[#FDFBF7] pointer-events-none" />
      <div className="absolute left-[-10px] top-1/2 w-6 h-6 rounded-full border-4 border-gray-400 bg-[#FDFBF7] -translate-y-1/2 pointer-events-none" />
    </div>
  );
}