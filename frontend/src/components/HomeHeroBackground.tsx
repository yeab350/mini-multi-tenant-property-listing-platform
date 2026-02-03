"use client";

import { useEffect, useRef } from "react";

const APARTMENT_BACKGROUNDS = [
  // Aesthetic apartment / interior shots (Unsplash)
  "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=2400&q=80",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=2400&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2400&q=80",
  "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=2400&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=2400&q=80",
] as const;

export function HomeHeroBackground() {
  const bgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const i = Math.floor(Math.random() * APARTMENT_BACKGROUNDS.length);
    const el = bgRef.current;
    if (!el) return;
    el.style.backgroundImage = `url(${APARTMENT_BACKGROUNDS[i]})`;
  }, []);

  return (
    <div className="fixed inset-0 -z-10" aria-hidden>
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundColor: "#f4f4f5" }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.78) 45%, rgba(255,255,255,0.88) 100%)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 520px at 15% 10%, rgba(99, 102, 241, 0.22), transparent 60%), radial-gradient(900px 520px at 85% 20%, rgba(14, 165, 233, 0.18), transparent 55%), radial-gradient(900px 520px at 50% 100%, rgba(217, 119, 6, 0.16), transparent 55%)",
        }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.06),rgba(0,0,0,0))]" />
    </div>
  );
}
