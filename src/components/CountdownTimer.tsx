"use client";
import { useState, useEffect } from "react";

interface CountdownTimerProps {
  endsAt?: string;
}

export default function CountdownTimer({ endsAt }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!endsAt) return;

    const calculateTimeLeft = () => {
      const targetDate = new Date(endsAt).getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [endsAt]);

  if (isExpired) {
    return (
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-center">
        <span className="text-rose-600 font-black text-sm uppercase tracking-wider">
          ⌛ Bu fırsat sona erdi!
        </span>
      </div>
    );
  }

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-gray-900 text-white w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black shadow-lg shadow-gray-200">
        {value.toString().padStart(2, "0")}
      </div>
      <span className="text-[10px] font-bold text-gray-400 uppercase mt-2 tracking-tighter">
        {label}
      </span>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
        <span className="text-xs font-black text-gray-700 uppercase tracking-widest">
          Fiyat Değişimi İçin Kalan Süre
        </span>
      </div>
      
      <div className="flex gap-3">
        <TimeBlock value={timeLeft.days} label="Gün" />
        <div className="pt-3 font-black text-gray-300">:</div>
        <TimeBlock value={timeLeft.hours} label="Saat" />
        <div className="pt-3 font-black text-gray-300">:</div>
        <TimeBlock value={timeLeft.minutes} label="Dak" />
        <div className="pt-3 font-black text-gray-300">:</div>
        <TimeBlock value={timeLeft.seconds} label="Sn" />
      </div>
    </div>
  );
}
