"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type HoverSpotlightProps = {
  children: React.ReactNode;
  className?: string;
  spotlightClassName?: string;
  spotlightColor?: string;
};

const HoverSpotlight = ({
  children,
  className,
  spotlightClassName,
  spotlightColor = "rgba(255,255,255,0.18)",
}: HoverSpotlightProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: "50%", y: "50%" });
  const [opacity, setOpacity] = useState(0);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setPosition({ x: `${x}%`, y: `${y}%` });
    setOpacity(1);
  };

  const handlePointerLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn("relative h-full w-full", className)}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300",
          spotlightClassName
        )}
        style={{
          opacity,
          background: `radial-gradient(480px circle at ${position.x} ${position.y}, ${spotlightColor}, transparent 65%)`,
          mixBlendMode: "screen",
          zIndex: 5,
        }}
      />
      <div className="relative h-full w-full" style={{ zIndex: 10 }}>
        {children}
      </div>
    </div>
  );
};

export default HoverSpotlight;
