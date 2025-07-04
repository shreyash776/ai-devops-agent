import React from 'react';

interface CircularProgressBarProps {
  value: number; // 0-100
  label: string;
  color?: string; 
}

export default function CircularProgressBar({
  value,
  label,
  color = 'text-lime-500',
}: CircularProgressBarProps) {
  const radius = 30;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={color}
        />
      </svg>
      <span className="text-xl font-bold mt-2">{value}%</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}
