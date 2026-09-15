'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

export interface RussianCultureIcon {
  id: string;
  name: string;          // Russian name (Cyrillic)
  title: string;         // Vietnamese title
  src: string;           // Asset path
  trivia: string;        // Interesting cultural fact
  tag: string;           // Category tag
  accentColor: string;   // Tailwind gradient classes
}

export const RUSSIAN_CULTURE_ICONS: RussianCultureIcon[] = [
  {
    id: 'saint-basil',
    name: 'Храм Василия Блаженного',
    title: 'Nhà thờ Thánh Basil',
    src: '/icons/russian/saint-basil.png',
    trivia: 'Biểu tượng kiến trúc thế kỷ 16 nổi tiếng bên Quảng trường Đỏ, Moscow với 9 ngọn tháp rực rỡ sắc màu.',
    tag: 'Kiến trúc & Di sản',
    accentColor: 'from-rose-500 via-red-500 to-amber-500',
  },
  {
    id: 'coat-of-arms',
    name: 'Герб России',
    title: 'Quốc huy Liên bang Nga',
    src: '/icons/russian/coat-of-arms.png',
    trivia: 'Hình ảnh đại bàng hai đầu kiêu hãnh dang rộng cánh, một đầu hướng về phương Đông và một đầu hướng về phương Tây.',
    tag: 'Biểu tượng quốc gia',
    accentColor: 'from-amber-500 via-yellow-500 to-amber-600',
  },
  {
    id: 'motherland-calls',
    name: 'Родина-мать зовёт!',
    title: 'Tượng đài Mẹ Tổ quốc',
    src: '/icons/russian/motherland-calls.png',
    trivia: 'Tác phẩm điêu khắc đồ sộ cao 85m sừng sững tại Volgograd, biểu trưng cho ý chí kiên cường bất khuất.',
    tag: 'Lịch sử & Tinh thần',
    accentColor: 'from-slate-600 via-zinc-500 to-stone-700',
  },
  {
    id: 'matryoshka',
    name: 'Матрёшка',
    title: 'Búp bê Matryoshka',
    src: '/icons/russian/matryoshka.png',
    trivia: 'Bộ búp bê gỗ lồng ghép truyền thống xuất hiện từ 1890, tượng trưng cho gia đình, sự màu mỡ và gắn kết.',
    tag: 'Nghệ thuật dân gian',
    accentColor: 'from-red-500 via-rose-500 to-pink-600',
  },
  {
    id: 'samovar',
    name: 'Самовар',
    title: 'Ấm trà Samovar',
    src: '/icons/russian/samovar.png',
    trivia: 'Nét văn hóa thưởng trà quây quần ấm cúng của các gia đình Nga giữa những ngày đông tuyết trắng.',
    tag: 'Phong tục & Ẩm thực',
    accentColor: 'from-amber-500 via-orange-500 to-amber-700',
  },
  {
    id: 'balalaika',
    name: 'Балалайка',
    title: 'Đàn Balalaika',
    src: '/icons/russian/balalaika.png',
    trivia: 'Cây đàn 3 dây thùng tam giác trứ danh, linh hồn của những khúc hát và điệu múa dân gian Nga rộn rã.',
    tag: 'Âm nhạc truyền thống',
    accentColor: 'from-amber-600 via-yellow-600 to-orange-700',
  },
  {
    id: 'kremlin',
    name: 'Спасская башня',
    title: 'Tháp Spasskaya Kremlin',
    src: '/icons/russian/kremlin.png',
    trivia: 'Tháp cổng chính của Điện Kremlin với chiếc đồng hồ điểm chuông đón thời khắc giao thừa linh thiêng.',
    tag: 'Di sản thế giới',
    accentColor: 'from-red-600 via-emerald-600 to-rose-700',
  },
  {
    id: 'sputnik',
    name: 'Спутник-1',
    title: 'Vệ tinh Sputnik',
    src: '/icons/russian/sputnik.svg',
    trivia: 'Vệ tinh nhân tạo đầu tiên bay vào quỹ đạo năm 1957, mở ra kỷ nguyên thám hiểm vũ trụ của nhân loại.',
    tag: 'Khoa học vũ trụ',
    accentColor: 'from-blue-600 via-indigo-500 to-cyan-500',
  },
  {
    id: 'ushanka',
    name: 'Шапка-ушанка',
    title: 'Mũ lông Ushanka',
    src: '/icons/russian/ushanka.svg',
    trivia: 'Chiếc mũ lông trùm tai ấm áp gắn liền với mùa đông tuyết trắng xứ sở bạch dương.',
    tag: 'Trang phục mùa đông',
    accentColor: 'from-slate-600 via-blue-600 to-indigo-700',
  },
  {
    id: 'russian-bear',
    name: 'Русский медведь',
    title: 'Gấu nâu Nga',
    src: '/icons/russian/russian-bear.svg',
    trivia: 'Chúa tể rừng Taiga Siberia hùng vĩ, biểu tượng của sự dũng cảm, sức mạnh và thiên nhiên Nga.',
    tag: 'Thiên nhiên hoang dã',
    accentColor: 'from-amber-800 via-yellow-800 to-amber-950',
  },
];

export interface FlipIconLoaderProps {
  /** Thông điệp chính hiển thị (VD: "AI đang soạn 20 câu hỏi...") */
  message?: string;
  /** Tiêu đề tiếng Nga phụ (VD: "Генерация теста...") */
  subMessage?: string;
  /** Kích thước của thẻ lật: sm (72px), md (104px), lg (132px) */
  size?: 'sm' | 'md' | 'lg';
  /** Có hiển thị kiến thức văn hóa Nga (trivia) bên dưới không */
  showTrivia?: boolean;
  /** Thời gian giữa các lượt lật thẻ (mili giây), mặc định 2500ms */
  flipInterval?: number;
  /** Chế độ hiển thị toàn màn hình với nền mờ frosted glass */
  fullscreen?: boolean;
  /** ClassName bổ sung */
  className?: string;
}

export function FlipIconLoader({
  message = 'Đang xử lý dữ liệu...',
  subMessage = 'Пожалуйста, подождите...',
  size = 'md',
  showTrivia = true,
  flipInterval = 2500,
  fullscreen = false,
  className = '',
}: FlipIconLoaderProps) {
  // Bắt đầu với một icon ngẫu nhiên để luôn tạo sự tươi mới
  const [frontIndex, setFrontIndex] = useState(() => Math.floor(Math.random() * RUSSIAN_CULTURE_ICONS.length));
  const [backIndex, setBackIndex] = useState(() => (frontIndex + 1) % RUSSIAN_CULTURE_ICONS.length);
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const flipCountRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      flipCountRef.current += 1;
      const nextDegree = flipCountRef.current * 180;
      setRotationDegrees(nextDegree);

      // Nếu chuẩn bị lật sang mặt sau (180deg, 540deg, ...)
      // Thì chuẩn bị icon tiếp theo cho mặt đối diện
      setIsFlipped((prev) => {
        const willBeFlipped = !prev;
        if (willBeFlipped) {
          // Chuẩn bị icon mới cho mặt trước khi nó đang úp
          setTimeout(() => {
            setFrontIndex((curr) => (curr + 2) % RUSSIAN_CULTURE_ICONS.length);
          }, 400);
        } else {
          // Chuẩn bị icon mới cho mặt sau khi nó đang úp
          setTimeout(() => {
            setBackIndex((curr) => (curr + 2) % RUSSIAN_CULTURE_ICONS.length);
          }, 400);
        }
        return willBeFlipped;
      });
    }, flipInterval);

    return () => clearInterval(timer);
  }, [flipInterval]);

  const activeIcon = isFlipped ? RUSSIAN_CULTURE_ICONS[backIndex] : RUSSIAN_CULTURE_ICONS[frontIndex];

  // Cấu hình kích thước thẻ
  const sizeConfig = {
    sm: {
      cardSize: 76,
      imageSize: 42,
      textSize: 'text-xs',
      subSize: 'text-[10px]',
      triviaMaxWidth: 'max-w-xs',
      triviaTextSize: 'text-[11px]',
    },
    md: {
      cardSize: 104,
      imageSize: 60,
      textSize: 'text-sm sm:text-base',
      subSize: 'text-xs',
      triviaMaxWidth: 'max-w-md',
      triviaTextSize: 'text-xs',
    },
    lg: {
      cardSize: 136,
      imageSize: 82,
      textSize: 'text-base sm:text-lg',
      subSize: 'text-xs sm:text-sm',
      triviaMaxWidth: 'max-w-lg',
      triviaTextSize: 'text-xs sm:text-[13px]',
    },
  }[size];

  const content = (
    <div className={`flex flex-col items-center justify-center gap-4 text-center select-none ${className}`}>
      {/* ─── Vùng lật thẻ 3D (3D Coin/Card Flip Stage) ─── */}
      <div
        className="perspective-1000 relative flex items-center justify-center"
        style={{ width: sizeConfig.cardSize, height: sizeConfig.cardSize }}
      >
        {/* Hào quang sáng mờ phía sau thẻ (Aura Glow) */}
        <div
          className={`absolute -inset-2 rounded-full bg-gradient-to-tr ${activeIcon.accentColor} opacity-20 blur-xl transition-all duration-700`}
        />

        {/* Khung thẻ 3D lật xoay quanh trục Y */}
        <div
          className="w-full h-full transform-style-3d transition-transform duration-700 ease-out relative cursor-default"
          style={{ transform: `rotateY(${rotationDegrees}deg)` }}
        >
          {/* MẶT TRƯỚC (Front Face) */}
          <div
            className="absolute inset-0 w-full h-full rounded-3xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex items-center justify-center p-3 backface-hidden overflow-hidden group"
          >
            {/* Vòng viền trang trí ánh kim */}
            <div className="absolute inset-1 rounded-2xl border border-slate-100/80 pointer-events-none" />
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={RUSSIAN_CULTURE_ICONS[frontIndex].src}
                alt={RUSSIAN_CULTURE_ICONS[frontIndex].title}
                width={sizeConfig.imageSize}
                height={sizeConfig.imageSize}
                className="object-contain drop-shadow-md transition-transform duration-500 hover:scale-105"
                priority
              />
            </div>
            {/* Hiệu ứng tia sáng chéo qua mặt kính (Glass Sheen) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
          </div>

          {/* MẶT SAU (Back Face - lật 180 độ) */}
          <div
            className="absolute inset-0 w-full h-full rounded-3xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex items-center justify-center p-3 backface-hidden overflow-hidden group"
            style={{ transform: 'rotateY(180deg)' }}
          >
            {/* Vòng viền trang trí ánh kim */}
            <div className="absolute inset-1 rounded-2xl border border-slate-100/80 pointer-events-none" />
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={RUSSIAN_CULTURE_ICONS[backIndex].src}
                alt={RUSSIAN_CULTURE_ICONS[backIndex].title}
                width={sizeConfig.imageSize}
                height={sizeConfig.imageSize}
                className="object-contain drop-shadow-md transition-transform duration-500 hover:scale-105"
                priority
              />
            </div>
            {/* Hiệu ứng tia sáng chéo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ─── Thông báo tiến trình (Progress Message) ─── */}
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-1.5">
          <h3 className={`${sizeConfig.textSize} font-extrabold text-slate-800 tracking-tight flex items-center gap-1`}>
            {message}
          </h3>
          <span className="flex gap-1 items-center ml-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        </div>
        {subMessage && (
          <p className={`${sizeConfig.subSize} font-semibold text-blue-700/80 tracking-wider uppercase font-mono`}>
            {subMessage}
          </p>
        )}
      </div>

      {/* ─── Hộp văn hóa Nga (Russian Trivia Card) ─── */}
      {showTrivia && (
        <div
          className={`w-full ${sizeConfig.triviaMaxWidth} bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs px-4 py-3 flex flex-col items-center gap-1.5 transition-all duration-500 animate-in fade-in`}
        >
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-amber-500 shrink-0" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
              {activeIcon.tag}
            </span>
            <span className="text-xs font-bold text-slate-800">
              {activeIcon.title}
            </span>
            <span className="text-[11px] text-slate-400 italic">
              ({activeIcon.name})
            </span>
          </div>
          <p className={`${sizeConfig.triviaTextSize} text-slate-500 leading-relaxed line-clamp-2`}>
            {activeIcon.trivia}
          </p>
        </div>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/90 max-w-lg w-full">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center py-6">
      {content}
    </div>
  );
}
