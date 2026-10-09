import React from 'react';
import { Wifi, BatteryMedium, Signal, RefreshCw, Laptop, Smartphone } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  layoutMode: 'auto' | 'laptop' | 'phone';
  onChangeLayoutMode: (mode: 'auto' | 'laptop' | 'phone') => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  layoutMode,
  onChangeLayoutMode,
}) => {
  // If not phone mode, render full responsive view (laptop / auto-detect)
  if (layoutMode !== 'phone') {
    return <div className="w-full min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#070d18] py-4 px-2 sm:px-4 flex flex-col items-center justify-center">
      {/* Phone Mockup Frame */}
      <div className="relative w-full max-w-[430px] h-[870px] bg-stone-950 rounded-[50px] p-3 shadow-2xl ring-1 ring-white/20 ring-inset flex flex-col overflow-hidden">
        {/* Hardware details: Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-center pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-800 mr-2"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-900/80"></div>
        </div>

        {/* Inner Phone Screen */}
        <div className="relative w-full h-full bg-stone-50 rounded-[40px] overflow-hidden flex flex-col">
          {/* Status Bar */}
          <div className="h-10 pt-2 px-6 flex items-center justify-between text-[11px] font-bold text-stone-900 bg-white/90 backdrop-blur-xs shrink-0 select-none z-40 border-b border-stone-100">
            <span>15:21</span>
            <div className="flex items-center gap-1.5 text-stone-800">
              <span className="text-[9px] font-mono font-medium">Vodacom SA</span>
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <BatteryMedium className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Screen Content */}
          <div className="flex-1 overflow-y-auto relative pb-16">
            {children}
          </div>

          {/* Home indicator bar at bottom of mobile screen */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-stone-400/80 rounded-full z-50 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};
