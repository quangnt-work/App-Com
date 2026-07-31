'use client';

import React from 'react';
import type { SpeechSpeed } from '@/types/shadowing';
import { SPEED_CONFIG } from '@/types/shadowing';

interface SpeedControlProps {
  currentSpeed: SpeechSpeed;
  onSpeedChange: (speed: SpeechSpeed) => void;
}

const speeds: SpeechSpeed[] = ['slow', 'normal', 'fast'];

export function SpeedControl({ currentSpeed, onSpeedChange }: SpeedControlProps) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
      {speeds.map((speed) => {
        const config = SPEED_CONFIG[speed];
        const isActive = currentSpeed === speed;

        return (
          <button
            key={speed}
            onClick={() => onSpeedChange(speed)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
              ${isActive
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }`}
            title={`Tốc độ ${config.label} (${config.rate}x)`}
          >
            <span className="text-base">{config.icon}</span>
            <span className="hidden sm:inline">{config.label}</span>
          </button>
        );
      })}
    </div>
  );
}
