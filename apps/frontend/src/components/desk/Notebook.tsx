import React, { useEffect, useState } from "react";

export function Notebook() {
  const today = new Date();
  const currentDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;

  const [weatherText, setWeatherText] = useState("Đang nhìn ra cửa sổ... ☁️");

  useEffect(() => {
    const fetchWeatherAndLocation = async () => {
      try {
        // Tọa độ cứng bạn đã cung cấp
        const LAT = 20.269356716491323;
        const LON = 106.47622764740456;

        // 1. Gọi API Dịch ngược tọa độ (Lấy tên Xã/Huyện/Tỉnh)
        // Dùng BigDataCloud free tier, trả về tiếng Việt
        const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${LAT}&longitude=${LON}&localityLanguage=vi`);
        const geoData = await geoRes.json();

        // 2. Gọi API Thời tiết chính xác tại tọa độ đó
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true`);
        const weatherData = await weatherRes.json();
        
        // 3. Vietsub mã thời tiết
        const code = weatherData.current_weather.weathercode;
        let weatherIcon = "☁️";
        let condition = "Cloudy";
        
        if (code === 0) { weatherIcon = "☀️"; condition = "Sunny"; }
        else if (code === 1 || code === 2 || code === 3) { weatherIcon = "⛅"; condition = "Partly Cloudy"; }
        else if (code >= 45 && code <= 48) { weatherIcon = "🌫️"; condition = "Foggy"; }
        else if (code >= 51 && code <= 67) { weatherIcon = "🌧️"; condition = "Rainy"; }
        else if (code >= 80 && code <= 82) { weatherIcon = "☔"; condition = "Heavy Rain"; }
        else if (code >= 95 && code <= 99) { weatherIcon = "⛈️"; condition = "Thunderstorm"; }

        // Kết quả: "Trời có mây ⛅ (Giao Hoà)"
        setWeatherText(`Weather: ${condition} ${weatherIcon}`);

      } catch (error) {
        setWeatherText("Thời tiết đẹp 🌤️"); 
      }
    };

    fetchWeatherAndLocation();
  }, []);

  return (
    <div className="relative md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full max-w-2xl bg-[#FDFBF7] shadow-paper rounded-sm p-8 md:p-12 rotate-1 z-10">
      <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-red-200/50" />
      <div className="relative flex flex-col gap-6 font-hand text-ink">
        <div className="flex justify-between items-start border-b border-primary/20 pb-2">
          <span className="font-typewriter text-sm text-gray-500">Date: {currentDate}</span>
          <span className="font-typewriter text-sm text-gray-500">{weatherText}</span>
        </div>
        <div className="space-y-4 text-2xl md:text-3xl leading-relaxed pl-8" style={{ backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #e5e7eb 32px)", lineHeight: "32px", paddingBottom: "4px" }}>
          <p className="text-primary font-bold">Hello cô gái!</p>
          <p>Một chút niềm vui nhỏ cho em...</p>
          <p>Hy vọng em sẽ thích nó.</p>
          <p className="text-xl text-gray-500 mt-4">- Đeo tai nghe nha! 🎧</p>
        </div>
        <div className="absolute bottom-4 right-8 transform rotate-12 opacity-80">
          <span className="material-symbols-outlined text-4xl text-primary">sentiment_satisfied</span>
        </div>
      </div>
      <div className="absolute left-[-10px] top-10 w-6 h-6 rounded-full border-4 border-gray-400 bg-[#FDFBF7]" />
      <div className="absolute left-[-10px] bottom-10 w-6 h-6 rounded-full border-4 border-gray-400 bg-[#FDFBF7]" />
      <div className="absolute left-[-10px] top-1/2 w-6 h-6 rounded-full border-4 border-gray-400 bg-[#FDFBF7] -translate-y-1/2" />
    </div>
  );
}