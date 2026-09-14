'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface RussianLoaderProps {
  message?: string;
  subMessage?: string;
  fullscreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  autoCycle?: boolean;
}

const RUSSIAN_ICONS = [
  {
    name: 'Saint Basil',
    src: '/icons/russian/saint-basil.png',
    title: 'Nhà thờ Thánh Basil',
  },
  {
    name: 'Coat of Arms',
    src: '/icons/russian/coat-of-arms.png',
    title: 'Quốc huy Nga',
  },
  {
    name: 'Motherland Calls',
    src: '/icons/russian/motherland-calls.png',
    title: 'Mẹ Tổ quốc kêu gọi',
  },
  {
    name: 'Matryoshka',
    src: '/icons/russian/matryoshka.png',
    title: 'Búp bê Matryoshka',
  },
];

export function RussianLoader({
  message = 'Đang tải dữ liệu...',
  subMessage = 'Загрузка...',
  fullscreen = false,
  size = 'md',
  autoCycle = true,
}: RussianLoaderProps) {
  // Bắt đầu với 1 icon ngẫu nhiên để mỗi lần load đều mới lạ
  const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * RUSSIAN_ICONS.length));
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!autoCycle) return;

    // Tự động luân chuyển nhẹ nhàng qua các biểu tượng sau mỗi 2.8s
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % RUSSIAN_ICONS.length);
        setIsFading(false);
      }, 300);
    }, 2800);

    return () => clearInterval(interval);
  }, [autoCycle]);

  const currentIcon = RUSSIAN_ICONS[currentIndex];

  const sizeConfig = {
    sm: {
      ringSize: 64,
      imageSize: 34,
      strokeWidth: 3,
      textSize: 'text-xs',
      subTextSize: 'text-[10px]',
    },
    md: {
      ringSize: 96,
      imageSize: 52,
      strokeWidth: 3.5,
      textSize: 'text-sm',
      subTextSize: 'text-xs',
    },
    lg: {
      ringSize: 128,
      imageSize: 72,
      strokeWidth: 4,
      textSize: 'text-base',
      subTextSize: 'text-sm',
    },
  }[size];

  const radius = (sizeConfig.ringSize - sizeConfig.strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${circumference * 0.7} ${circumference * 0.3}`;

  const content = (
    <div className="flex flex-col items-center justify-center gap-4 select-none">
      {/* Khối Spinner tròn với icon ở tâm */}
      <div 
        className="relative flex items-center justify-center"
        style={{ width: sizeConfig.ringSize, height: sizeConfig.ringSize }}
      >
        {/* Vòng đệm nền (Track ring) */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${sizeConfig.ringSize} ${sizeConfig.ringSize}`}
        >
          <circle
            cx={sizeConfig.ringSize / 2}
            cy={sizeConfig.ringSize / 2}
            r={radius}
            fill="none"
            stroke="rgba(226, 232, 240, 0.8)"
            strokeWidth={sizeConfig.strokeWidth}
          />
        </svg>

        {/* Vòng quay hoạt ảnh SVG (Animated spinner ring) */}
        <svg
          className="absolute inset-0 w-full h-full animate-spin"
          style={{ animationDuration: '1.4s' }}
          viewBox={`0 0 ${sizeConfig.ringSize} ${sizeConfig.ringSize}`}
        >
          <defs>
            <linearGradient id="russianLoaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>
          <circle
            cx={sizeConfig.ringSize / 2}
            cy={sizeConfig.ringSize / 2}
            r={radius}
            fill="none"
            stroke="url(#russianLoaderGradient)"
            strokeWidth={sizeConfig.strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
          />
        </svg>

        {/* Biểu tượng văn hóa Nga ở chính giữa */}
        <div
          className={`relative z-10 flex items-center justify-center transition-all duration-300 transform ${
            isFading ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
          }`}
          style={{ width: sizeConfig.imageSize, height: sizeConfig.imageSize }}
        >
          <Image
            src={currentIcon.src}
            alt={currentIcon.title}
            width={sizeConfig.imageSize}
            height={sizeConfig.imageSize}
            className="object-contain drop-shadow-sm transition-transform duration-700 hover:scale-110"
            priority
          />
        </div>
      </div>

      {/* Dòng chữ thông báo tải */}
      <div className="flex flex-col items-center text-center gap-0.5">
        <p className={`${sizeConfig.textSize} font-bold text-slate-800 tracking-tight`}>
          {message}
        </p>
        {subMessage && (
          <p className={`${sizeConfig.subTextSize} font-semibold text-blue-800/80 tracking-widest uppercase`}>
            {subMessage}
          </p>
        )}
      </div>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/90 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return (
    <div className="flex h-full w-full min-h-[220px] items-center justify-center p-6">
      {content}
    </div>
  );
}
