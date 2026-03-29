'use client';

import React, { useState } from 'react';

export function TelegramButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-16 right-0 bg-primary-light border border-white/10 rounded-lg px-4 py-2 text-sm text-white whitespace-nowrap animate-fade-in shadow-xl">
          Заказать через Telegram
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-primary-light border-r border-b border-white/10 rotate-45" />
        </div>
      )}

      {/* Button */}
      <a
        href="https://t.me/JPGSTYLE_SMARTWASH"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#2AABEE] hover:bg-[#229ED9] shadow-lg shadow-[#2AABEE]/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-[#2AABEE]/40"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#2AABEE] animate-ping opacity-20" />
        
        {/* Telegram icon */}
        <svg className="w-6 h-6 text-white relative z-10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.248-.024c-.106.024-1.793 1.14-5.062 3.345-.479.329-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.12.098.153.228.168.327.016.099.035.323.02.498z"/>
        </svg>
      </a>
    </div>
  );
}
