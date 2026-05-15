"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Marquee() {
  const [text, setText] = useState("🔥 En büyük indirimler — ⚡ Günlük fırsatlar — 💸 Kaçırılmayacak kampanyalar — ⏳ Fiyatlar anlık değişebilir");

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "marquee_text")
        .single();
      
      if (data?.value) {
        setText(data.value);
      }
    }
    fetchSettings();
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 py-2.5 shadow-lg border-b border-white/10 z-40">
      <div className="flex animate-marquee whitespace-nowrap">
        <span className="text-[20px] font-black tracking-wider text-white uppercase px-4">
          {text}
        </span>
        <span className="text-[20px] font-black tracking-wider text-white uppercase px-4">
          {text}
        </span>
        <span className="text-[20px] font-black tracking-wider text-white uppercase px-4">
          {text}
        </span>
      </div>

      <style jsx>{`
        .animate-marquee {
          display: inline-flex;
          animation: marquee 30s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  );
}
