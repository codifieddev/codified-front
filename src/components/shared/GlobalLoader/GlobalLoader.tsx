"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";

export default function GlobalLoader() {
  const { isAllPageFetched, isLoading } = useSelector((state: RootState) => state.pages);
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Hide the loader once all pages are fetched and no longer loading.
    if (isAllPageFetched && !isLoading) {
      setFade(true);
      const timer = setTimeout(() => {
        setShow(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAllPageFetched, isLoading]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[999999] flex items-center justify-center bg-[#0a0a0a] transition-opacity duration-500 ease-in-out ${
        fade ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-20 md:w-56 md:h-28 mb-8 animate-pulse">
          <Image
            src="/img/logo-white.svg"
            alt="Codified"
            fill
            className="object-contain"
            priority
          />
        </div>
        
        {/* Loading Bar */}
        <div className="w-48 md:w-64 h-1 bg-white/10 rounded-full overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full bg-white/80 w-1/3 rounded-full animate-loader-progress"></div>
        </div>
        
        <p className="mt-6 text-white/50 text-xs md:text-sm tracking-[0.2em] font-mono uppercase">
          Loading
        </p>
      </div>

      <style jsx>{`
        @keyframes loader-progress {
          0% {
            left: -33%;
          }
          100% {
            left: 100%;
          }
        }
        .animate-loader-progress {
          animation: loader-progress 1.5s infinite cubic-bezier(0.65, 0, 0.35, 1);
        }
      `}</style>
    </div>
  );
}
