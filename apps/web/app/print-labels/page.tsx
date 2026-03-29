"use client";

import Image from 'next/image';

export default function PrintLabelsPage() {
  return (
    <div className="bg-neutral-100 min-h-screen p-8 text-black print:p-0 print:bg-white flex flex-col items-center gap-12 font-sans">
      <div className="print:hidden bg-white p-6 rounded-lg shadow-md max-w-2xl text-center">
        <h1 className="text-2xl font-bold mb-4">Printable Labels 🖨️ / Печать Этикеток</h1>
        <p className="text-neutral-600 mb-4">
          Я использовал Nanobanana (встроенный ИИ для генерации макетов и фонов), чтобы создать 
          индивидуальные дизайны оформления 1 в 1 по вашим примерам.
          Текст наложен поверх изображений в векторе для идеальной резкости при печати!
        </p>
        <p className="text-sm text-neutral-500 mb-6">
          Нажмите <strong>Ctrl+P</strong> (или <strong>Cmd+P</strong> на Mac), чтобы отправить на печать. 
          Важно: включите <strong>«Печать фона» (Background graphics)</strong> в настройках печати.
        </p>
        <button 
          onClick={() => typeof window !== 'undefined' && window.print()}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition"
        >
          🖨️ Распечатать этикетки
        </button>
      </div>

      {/* Grid wrapper: shown as grid on screen, block when printed */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-start justify-items-center w-full max-w-7xl print:block print:w-full print:max-w-none print:space-y-[4cm]">
        
        {/* Label 1: Dry Fog */}
        <div className="relative w-[7cm] h-[15cm] rounded-[4px] overflow-hidden flex flex-col items-center border border-neutral-200 print:border-none shadow-xl print:shadow-none print:break-after-page" style={{ background: 'linear-gradient(to bottom, #2b113a, #1a0b1f)', color: '#d4af37' }}>
          <div className="absolute inset-0 bottom-0 opacity-80 pointer-events-none flex items-end justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/labels/1-lavender.png" alt="lavender bg" className="w-full object-cover object-bottom" />
          </div>
          <div className="relative z-10 w-full h-full p-2 flex flex-col items-center text-center m-2 rounded-sm">
            <div className="border border-[#d4af37]/30 w-full h-full flex flex-col items-center pt-8">
              <div className="w-12 h-0.5 bg-[#d4af37] mb-6"></div>
              <h2 className="font-serif text-3xl font-bold tracking-widest text-[#e8c050]">JPG-STYLE</h2>
              <div className="h-px w-24 bg-[#d4af37]/50 my-3"></div>
              <h3 className="font-serif text-2xl mb-12 text-[#f4d982]">SmartWash</h3>
              
              <h1 className="font-serif text-[1.6rem] font-bold leading-tight mb-2 text-[#d4af37]">Сухой Туман</h1>
              <h2 className="text-3xl font-bold tracking-widest mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">DRY FOG</h2>
              
              <p className="text-[0.7rem] uppercase tracking-wider text-gray-300 mb-auto leading-relaxed px-4">
                Car Interior Freshener<br/>& Odor Eliminator
              </p>

              <div className="mb-8 flex flex-col items-center mt-12">
                <span className="text-2xl font-bold text-[#d4af37]">450ml</span>
                <span className="text-xs tracking-widest text-[#f4d982] mt-2 uppercase font-serif pb-4">Lavender Scent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Label 2: Tire Shine Matte */}
        <div className="relative w-[12.5cm] h-[12.5cm] rounded-[10px] overflow-hidden flex flex-col border border-neutral-300 print:border-none shadow-xl print:shadow-none print:break-after-page text-white bg-black">
          <div className="absolute inset-0">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src="/labels/2-matte.png" alt="matte bg" className="w-full h-full object-cover opacity-60 mix-blend-screen" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-black/60"></div>
          
          <div className="relative z-10 flex flex-col h-full font-sans tracking-wide">
            {/* Top Logo */}
            <div className="w-full p-6 pb-4">
               <h2 className="text-[2.5rem] font-bold tracking-[0.15em] text-gray-100 flex items-center justify-center">JPG-STYLE</h2>
            </div>
            <div className="w-full border-b-[1.5px] border-gray-600/70 shadow-sm"></div>
            
            {/* Content */}
            <div className="flex-1 flex flex-col items-start justify-center p-8 pl-10 text-left w-full h-full relative">
               <h3 className="text-2xl font-semibold tracking-widest text-gray-300 mb-6 drop-shadow-md">SMARTWASH</h3>
               <h1 className="text-[3.2rem] font-serif font-bold leading-none drop-shadow-lg mb-2">ЧЕРНИТЕЛЬ<br/>РЕЗИНЫ</h1>
               <div className="text-[1.4rem] font-medium tracking-[0.2em] text-gray-300 mt-3 drop-shadow-md">МАТОВЫЙ</div>
               
               <div className="my-8 border-b-2 border-gray-400 w-32"></div>
               
               <h2 className="text-2xl font-medium tracking-[0.25em] text-gray-200 drop-shadow-md uppercase">Tire Shine Matte</h2>
            </div>
            
            {/* Footer Features */}
            <div className="bg-[#0f0f0f]/90 p-5 px-8 flex items-end justify-between border-t border-[#333]">
                <div className="flex flex-col gap-1.5 text-[0.65rem] text-gray-400 uppercase tracking-widest flex-1">
                  <span>Natural Matte Finish</span>
                  <span>UV Protection</span>
                </div>
                <div className="text-6xl font-black text-gray-100 tracking-tighter self-center shrink-0 w-24 text-center">10L</div>
                <div className="flex flex-col gap-1.5 text-[0.65rem] text-gray-400 uppercase tracking-widest text-right flex-1">
                  <span>Water Repellent</span>
                  <span>Professional Formula</span>
                </div>
            </div>
          </div>
        </div>

        {/* Label 3: Tire Shine Gloss */}
        <div className="relative w-[11.5cm] h-[13.5cm] rounded-[8px] overflow-hidden flex flex-col border border-neutral-300 print:border-none shadow-xl print:shadow-none print:break-after-page text-white bg-[#0A0A0A]">
          {/* Background Tire */}
          <div className="absolute inset-0 overflow-hidden flex justify-end">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src="/labels/3-glossy.png" alt="glossy bg" className="h-full object-cover opacity-90 object-left" style={{ width: '150%' }} />
             <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/70 to-[#0A0A0A]"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent h-full opacity-60"></div>
          </div>
          
          <div className="relative z-10 flex flex-col h-full font-sans p-5 pt-8">
             {/* Red Header Panel */}
             <div className="bg-[#E4161C] rounded-md p-4 w-full shadow-lg border border-red-500 flex flex-col items-center">
                <div className="text-4xl font-black italic tracking-wider text-black w-full text-center">JPG-Style</div>
               <div className="text-[1.7rem] font-bold tracking-wide text-black mt-0 leading-none">SmartWash</div>
             </div>

             <div className="mt-8 mb-auto flex flex-col items-end text-right pr-2">
                <h1 className="text-[3.2rem] font-black text-[#E4161C] mt-8 leading-[1.1] drop-shadow-lg tracking-tight uppercase">Чернитель</h1>
                <h1 className="text-[3.2rem] font-black text-[#E4161C] leading-[1.1] drop-shadow-lg tracking-tight uppercase">Резины</h1>
                <h2 className="text-[2.5rem] font-black text-[#0A0A0A] mt-2 drop-shadow-md bg-white px-3 pb-1 rounded-sm uppercase tracking-tight">Глянцевый</h2>
             </div>
             
             <div className="mt-auto self-end flex items-center pr-2 mb-6 gap-4">
                <div className="bg-[#E4161C] px-5 py-2 text-[1.4rem] font-black italic shadow-lg uppercase tracking-tight drop-shadow-md text-white border-2 border-[#E4161C]">Tire Shine Gloss</div>
             </div>
             
             <div className="flex self-end items-center pr-2 mb-8">
                 <div className="border-4 border-white px-6 py-2 pb-3 text-6xl font-black bg-[#E4161C] text-white shadow-2xl skew-x-[-5deg]">10L</div>
             </div>
          </div>
        </div>

        {/* Label 4: Bubble Gum Wax */}
        <div className="relative w-[9.5cm] h-[14cm] rounded-[4px] overflow-hidden flex flex-col border border-neutral-300 print:border-none shadow-xl print:shadow-none print:break-after-page text-[#2b1855]">
          <div className="absolute inset-0">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src="/labels/4-bubble.png" alt="bubble bg" className="w-full h-full object-cover opacity-95 saturate-150 relative top-10" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#8eb5dd] via-transparent to-[#e87abb] opacity-80 mix-blend-color"></div>
          
          <div className="relative z-10 w-full h-full p-4 flex flex-col pb-8">
             <div className="flex-1 border-[3px] border-[#d8b066] rounded-md flex flex-col p-5 bg-white/20 backdrop-blur-sm shadow-[inset_0_0_20px_rgba(255,255,255,0.8),_0_0_15px_rgba(0,0,0,0.1)] relative">
                {/* Vintage Frame Line */}
                <div className="absolute inset-1.5 border-[1.5px] border-[#d8b066]/80 rounded text-center pointer-events-none"></div>
                
                <div className="w-full flex justify-center mt-3 mb-2">
                  <div className="w-16 h-12 bg-transparent border-[2.5px] border-[#10306c] rounded-full flex items-center justify-center">
                     <span className="text-xl text-[#10306c] font-black drop-shadow-md pb-1">♛</span>
                  </div>
                </div>
                
                <h2 className="font-serif text-[2.2rem] font-bold tracking-widest text-[#d8b066] drop-shadow-[1px_1px_0px_#10306c] text-center" style={{ transform: 'scaleY(1.1)' }}>JPG-STYLE</h2>
                
                <h3 className="font-serif text-[2.2rem] mt-3 mb-4 text-[#10306c] shadow-white font-black text-center" style={{ textShadow: '0 0 10px white, 0 0 20px white' }}>SmartWash</h3>
                
                <div className="flex flex-col items-center justify-center w-full mt-2 mb-2">
                  <h4 className="text-xl font-bold tracking-widest text-[#10306c] font-serif uppercase bg-white/60 px-4 py-1 rounded-sm backdrop-blur-md">Bock / Wax</h4>
                </div>
                
                <div className="w-full flex justify-center">
                  <h1 className="text-[2.6rem] font-black font-serif my-6 text-[#ff6cb6] uppercase text-center drop-shadow-lg" style={{ letterSpacing: '1px', textShadow: '2px 2px 0px white, -1px -1px 0px white, 1px -1px 0px white, -1px 1px 0px white' }}>BUBBLE GUM</h1>
                </div>
                
                <div className="w-full flex justify-center mt-auto mb-6">
                  <div className="bg-[#10306c] text-white px-2 py-1.5 text-[0.6rem] font-bold tracking-[0.2em] uppercase shadow-lg text-center w-[90%] border-t-2 border-b-2 border-[#d8b066]">
                     Protective Coating & Shine
                  </div>
                </div>
                
                <div className="mt-2 border-t-[1.5px] border-[#d8b066] pt-4 w-full text-center pb-2">
                   <p className="text-[#10306c] font-bold tracking-wide text-[0.65rem] uppercase bg-white/40 inline-block px-2 rounded-sm backdrop-blur-md">Fragrance: Sweet Bubble Gum</p>
                   <p className="text-[#10306c] font-black text-2xl mt-2 tracking-widest" style={{ textShadow: '1px 1px 0px white' }}>5L <span className="text-sm font-normal tracking-normal text-[#10306c]/80">| 1.32 US GAL</span></p>
                </div>
             </div>
          </div>
        </div>

        {/* Label 5: Truck Chemistry */}
        <div className="relative w-[13cm] h-[13cm] rounded-[6px] overflow-hidden flex flex-col border border-neutral-300 print:border-none shadow-xl print:shadow-none bg-[#11161d] text-white font-sans font-medium">
          <div className="absolute inset-0">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src="/labels/5-truck.png" alt="truck bg" className="w-full h-full object-cover opacity-[0.35] grayscale contrast-125 saturate-50" />
             <div className="absolute inset-0 bg-gradient-to-br from-[#1b2636]/90 to-[#0e1217]/90 mix-blend-multiply"></div>
          </div>
          
          <div className="relative z-10 w-full h-full flex flex-row">
             {/* Left Main Content */}
             <div className="flex-1 flex flex-col p-8 pr-6">
                {/* Header Logo Row */}
                <div className="flex items-center gap-3 mb-10">
                   <div className="font-bold text-[1.8rem] tracking-tight text-white italic drop-shadow-md">JPG-Style<sup className="text-sm font-normal ml-0.5">®</sup></div>
                   <div className="bg-[#1b639e] text-white px-3 py-0.5 text-xl font-black italic shadow-lg flex items-center gap-1.5 border-2 border-[#3f8ebc] rounded-lg">
                      <div className="w-3 h-3 bg-white rounded-full ml-1"></div>
                      <span className="mr-1">SmartWash</span>
                   </div>
                </div>
                
                <h2 className="text-[2.2rem] font-sans font-black uppercase text-white leading-[1.05] tracking-tight mb-3 opacity-95">
                   Активная Химия<br/>Для Грузовиков
                </h2>
                
                <h1 className="text-[2.4rem] font-sans font-black uppercase text-[#619cc9] leading-none tracking-tighter drop-shadow-lg border-b-4 border-[#619cc9]/40 pb-8 mb-auto w-full">
                   TRUCK CHEMISTRY
                </h1>
                
                <div className="bg-[#1f2835]/90 backdrop-blur-md border border-[#3f506b] rounded p-5 flex gap-5 items-center shadow-xl">
                   <div className="bg-[#e4e4e4] text-[#111] font-black text-6xl px-4 py-2 pt-3 rounded-sm tracking-tighter shadow-inner flex items-baseline">
                      20 <span className="text-3xl font-bold ml-1">KG</span>
                   </div>
                   <div className="flex flex-col justify-center max-w-[50%]">
                      <div className="text-[0.65rem] tracking-[0.1em] font-bold mb-1.5 text-gray-200 uppercase">Профессиональная Формула / Professional Grade</div>
                      <div className="text-[0.6rem] tracking-wider text-[#79afe0] leading-tight font-bold">ДЛЯ ТЯЖЕЛЫХ ГРУЗОВИКОВ И ТЕХНИКИ<br/>FOR HEAVY TRUCKS & EQUIPMENT</div>
                      <div className="flex flex-wrap gap-2 gap-y-1.5 mt-3">
                         <span className="text-[0.55rem] flex items-center gap-1.5 text-gray-300 bg-white/10 px-1.5 py-0.5 rounded">📦 HEAVY DUTY</span>
                         <span className="text-[0.55rem] flex items-center gap-1.5 text-gray-300 bg-white/10 px-1.5 py-0.5 rounded">⚡ STRONG CLEANING</span>
                         <span className="text-[0.55rem] flex items-center gap-1.5 text-gray-300 bg-white/10 px-1.5 py-0.5 rounded">🛠 INDUSTRIAL USE</span>
                      </div>
                   </div>
                </div>
             </div>
             
             {/* Right Hazard Column */}
             <div className="w-[3.8cm] bg-[#dedede] text-black flex flex-col p-5 border-l-[6px] border-[#da291c] h-full shadow-[-10px_0_20px_rgba(0,0,0,0.5)]">
                 {/* Hazard symbols container */}
                 <div className="flex flex-col items-center gap-6 mb-auto pt-6">
                    <div className="w-16 h-16 border-[5px] border-[#da291c] bg-white rotate-45 flex items-center justify-center rounded-sm shadow-md">
                       <span className="text-[#da291c] text-4xl font-black -rotate-45 block transform scale-y-[1.2]">!</span>
                    </div>
                    <div className="w-16 h-16 border-[5px] border-[#da291c] bg-white rotate-45 flex items-center justify-center rounded-sm mt-6 shadow-md">
                        {/* simplified flame icon */}
                       <span className="text-black text-3xl -rotate-45 block">🔥</span>
                    </div>
                 </div>
                 
                 <div className="mt-8 text-[0.45rem] leading-snug text-[#000] border-t-2 border-[#111] pt-3 text-justify font-bold uppercase">
                    Опасно: Вызывает серьезные повреждения глаз и кожи. Хранить в недоступном для детей месте. Опасный груз. Только для промышленного применения. Срок годности 3 года.
                 </div>
                 
                 {/* Fake barcode block */}
                 <div className="mt-5 w-full bg-white p-1 pb-0 shadow-sm border border-gray-300">
                    <div className="flex w-full h-8 justify-between">
                       {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(v => (
                          <div key={v} className="bg-black text-transparent h-full" style={{ width: v % 2 === 0 ? '3px' : '1.5px', marginLeft: v % 3 === 0 ? '2px' : '1px' }}></div>
                       ))}
                    </div>
                    <div className="text-[0.45rem] tracking-[0.1em] text-center mt-1 text-black font-bold">4603728 102937</div>
                 </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
