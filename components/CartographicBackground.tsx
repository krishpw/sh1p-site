import React from 'react';

export function CartographicBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Denser Grid lines - latitude/longitude style - Increased opacity from 0.06 to 0.12 */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <pattern id="grid-fine" width="15" height="15" patternUnits="userSpaceOnUse">
            <path d="M 15 0 L 0 0 0 15" fill="none" stroke="currentColor" strokeWidth="0.2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" className="text-amber-300" />
        <rect width="100%" height="100%" fill="url(#grid-fine)" className="text-amber-200" />
      </svg>

      {/* Large Compass Rose - positioned prominently - Increased opacity from 0.08 to 0.15 */}
      <svg
        className="absolute top-[8%] right-[5%] w-72 h-72 md:w-96 md:h-96 opacity-[0.15]"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="100" cy="100" r="98" stroke="currentColor" strokeWidth="0.5" className="text-amber-200" />
        <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.5" className="text-amber-200" />
        <circle cx="100" cy="100" r="75" stroke="currentColor" strokeWidth="0.5" className="text-amber-200" />
        <circle cx="100" cy="100" r="55" stroke="currentColor" strokeWidth="0.5" className="text-amber-200" />
        <circle cx="100" cy="100" r="35" stroke="currentColor" strokeWidth="0.5" className="text-amber-200" />
        {/* Main compass points - thicker */}
        <path d="M100 2 L108 100 L100 198 L92 100 Z" fill="currentColor" className="text-amber-200" />
        <path d="M2 100 L100 92 L198 100 L100 108 Z" fill="currentColor" className="text-amber-200" />
        {/* Diagonal points */}
        <path d="M25 25 L92 92 L175 175 L108 108 Z" fill="currentColor" className="text-amber-200" opacity="0.6" />
        <path d="M175 25 L108 92 L25 175 L92 108 Z" fill="currentColor" className="text-amber-200" opacity="0.6" />
        {/* Fine diagonals */}
        <path d="M55 15 L96 96 L145 185 L104 104 Z" fill="currentColor" className="text-amber-200" opacity="0.3" />
        <path d="M145 15 L104 96 L55 185 L96 104 Z" fill="currentColor" className="text-amber-200" opacity="0.3" />
        <path d="M15 55 L96 96 L185 145 L104 104 Z" fill="currentColor" className="text-amber-200" opacity="0.3" />
        <path d="M15 145 L96 104 L185 55 L104 96 Z" fill="currentColor" className="text-amber-200" opacity="0.3" />
        {/* Center ornament */}
        <circle cx="100" cy="100" r="12" stroke="currentColor" strokeWidth="1.5" className="text-amber-200" />
        <circle cx="100" cy="100" r="6" stroke="currentColor" strokeWidth="1" className="text-amber-200" />
        <circle cx="100" cy="100" r="3" fill="currentColor" className="text-amber-200" />
        {/* Fleur de lis at N */}
        <path d="M100 8 L103 15 L100 12 L97 15 Z" fill="currentColor" className="text-amber-200" />
        <text
          x="100"
          y="25"
          textAnchor="middle"
          fontSize="8"
          fill="currentColor"
          className="text-amber-300"
          fontFamily="serif"
        >
          N
        </text>
        <text
          x="100"
          y="193"
          textAnchor="middle"
          fontSize="8"
          fill="currentColor"
          className="text-amber-200"
          fontFamily="serif"
        >
          S
        </text>
        <text
          x="188"
          y="103"
          textAnchor="middle"
          fontSize="8"
          fill="currentColor"
          className="text-amber-200"
          fontFamily="serif"
        >
          E
        </text>
        <text
          x="12"
          y="103"
          textAnchor="middle"
          fontSize="8"
          fill="currentColor"
          className="text-amber-200"
          fontFamily="serif"
        >
          W
        </text>
      </svg>

      {/* Ship silhouette - larger and more detailed - Increased opacity from 0.07 to 0.12 */}
      <svg
        className="absolute bottom-[15%] left-[3%] w-80 h-60 md:w-[450px] md:h-[350px] opacity-[0.12]"
        viewBox="0 0 300 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Hull with more detail */}
        <path
          d="M15 165 Q50 200 150 200 Q250 200 285 165 L270 155 L30 155 Z"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
          className="text-amber-200"
        />
        <path d="M35 160 L265 160" stroke="currentColor" strokeWidth="0.5" className="text-amber-200" />
        <path d="M45 165 L255 165" stroke="currentColor" strokeWidth="0.5" className="text-amber-200" />
        {/* Masts */}
        <line x1="90" y1="155" x2="90" y2="25" stroke="currentColor" strokeWidth="1.5" className="text-amber-200" />
        <line x1="170" y1="155" x2="170" y2="40" stroke="currentColor" strokeWidth="1.5" className="text-amber-200" />
        <line x1="240" y1="155" x2="240" y2="60" stroke="currentColor" strokeWidth="1.2" className="text-amber-200" />
        {/* Crow's nest */}
        <rect
          x="83"
          y="55"
          width="14"
          height="8"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          className="text-amber-200"
        />
        {/* Sails - more detailed */}
        <path d="M90 25 Q130 45 90 75" stroke="currentColor" strokeWidth="0.8" fill="none" className="text-amber-200" />
        <path d="M90 25 Q50 45 90 75" stroke="currentColor" strokeWidth="0.8" fill="none" className="text-amber-200" />
        <path
          d="M90 80 Q140 100 90 140"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
          className="text-amber-200"
        />
        <path
          d="M90 80 Q40 100 90 140"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
          className="text-amber-200"
        />
        <path
          d="M170 40 Q215 60 170 95"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
          className="text-amber-200"
        />
        <path
          d="M170 40 Q125 60 170 95"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
          className="text-amber-200"
        />
        <path
          d="M170 100 Q220 120 170 145"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
          className="text-amber-200"
        />
        <path
          d="M170 100 Q120 120 170 145"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
          className="text-amber-200"
        />
        <path
          d="M240 60 Q275 80 240 110"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
          className="text-amber-200"
        />
        <path
          d="M240 60 Q205 80 240 110"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
          className="text-amber-200"
        />
        {/* Rigging - extensive */}
        <line x1="90" y1="25" x2="15" y2="155" stroke="currentColor" strokeWidth="0.4" className="text-amber-200" />
        <line x1="90" y1="25" x2="170" y2="40" stroke="currentColor" strokeWidth="0.4" className="text-amber-200" />
        <line x1="170" y1="40" x2="240" y2="60" stroke="currentColor" strokeWidth="0.4" className="text-amber-200" />
        <line x1="240" y1="60" x2="285" y2="155" stroke="currentColor" strokeWidth="0.4" className="text-amber-200" />
        <line x1="90" y1="55" x2="30" y2="155" stroke="currentColor" strokeWidth="0.3" className="text-amber-200" />
        <line x1="170" y1="70" x2="90" y2="55" stroke="currentColor" strokeWidth="0.3" className="text-amber-200" />
        {/* Flag */}
        <path d="M90 25 L90 15 L110 20 L90 25" fill="currentColor" className="text-amber-200" opacity="0.5" />
        {/* Waves underneath */}
        <path
          d="M0 205 Q30 195 60 205 Q90 215 120 205 Q150 195 180 205 Q210 215 240 205 Q270 195 300 205"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          className="text-amber-200"
          opacity="0.5"
        />
      </svg>

      {/* Hot air balloon - larger - Increased opacity to 0.12 */}
      <svg
        className="absolute top-[35%] left-[8%] w-40 h-56 md:w-52 md:h-72 opacity-[0.12]"
        viewBox="0 0 120 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="60" cy="55" rx="48" ry="52" stroke="currentColor" strokeWidth="1" className="text-amber-200" />
        <ellipse cx="60" cy="55" rx="40" ry="44" stroke="currentColor" strokeWidth="0.3" className="text-amber-200" />
        {/* Balloon pattern - vertical sections */}
        <path d="M60 3 Q60 55 60 107" stroke="currentColor" strokeWidth="0.5" className="text-amber-200" />
        <path d="M35 10 Q35 55 35 100" stroke="currentColor" strokeWidth="0.4" className="text-amber-200" />
        <path d="M85 10 Q85 55 85 100" stroke="currentColor" strokeWidth="0.4" className="text-amber-200" />
        <path d="M18 30 Q18 55 18 80" stroke="currentColor" strokeWidth="0.3" className="text-amber-200" />
        <path d="M102 30 Q102 55 102 80" stroke="currentColor" strokeWidth="0.3" className="text-amber-200" />
        {/* Horizontal bands */}
        <ellipse
          cx="60"
          cy="30"
          rx="42"
          ry="8"
          stroke="currentColor"
          strokeWidth="0.3"
          fill="none"
          className="text-amber-200"
        />
        <ellipse
          cx="60"
          cy="55"
          rx="48"
          ry="10"
          stroke="currentColor"
          strokeWidth="0.3"
          fill="none"
          className="text-amber-200"
        />
        <ellipse
          cx="60"
          cy="80"
          rx="42"
          ry="8"
          stroke="currentColor"
          strokeWidth="0.3"
          fill="none"
          className="text-amber-200"
        />
        {/* Netting pattern */}
        <path d="M20 90 L30 107" stroke="currentColor" strokeWidth="0.3" className="text-amber-200" />
        <path d="M40 95 L40 107" stroke="currentColor" strokeWidth="0.3" className="text-amber-200" />
        <path d="M60 97 L60 107" stroke="currentColor" strokeWidth="0.3" className="text-amber-200" />
        <path d="M80 95 L80 107" stroke="currentColor" strokeWidth="0.3" className="text-amber-200" />
        <path d="M100 90 L90 107" stroke="currentColor" strokeWidth="0.3" className="text-amber-200" />
        {/* Ropes to basket */}
        <line x1="30" y1="107" x2="38" y2="140" stroke="currentColor" strokeWidth="0.6" className="text-amber-200" />
        <line x1="90" y1="107" x2="82" y2="140" stroke="currentColor" strokeWidth="0.6" className="text-amber-200" />
        <line x1="60" y1="107" x2="60" y2="140" stroke="currentColor" strokeWidth="0.6" className="text-amber-200" />
        <line x1="45" y1="107" x2="48" y2="140" stroke="currentColor" strokeWidth="0.4" className="text-amber-200" />
        <line x1="75" y1="107" x2="72" y2="140" stroke="currentColor" strokeWidth="0.4" className="text-amber-200" />
        {/* Basket with weave pattern */}
        <rect
          x="35"
          y="140"
          width="50"
          height="28"
          stroke="currentColor"
          strokeWidth="1"
          rx="2"
          fill="none"
          className="text-amber-200"
        />
        <line x1="35" y1="147" x2="85" y2="147" stroke="currentColor" strokeWidth="0.4" className="text-amber-200" />
        <line x1="35" y1="154" x2="85" y2="154" stroke="currentColor" strokeWidth="0.4" className="text-amber-200" />
        <line x1="35" y1="161" x2="85" y2="161" stroke="currentColor" strokeWidth="0.4" className="text-amber-200" />
        <line x1="45" y1="140" x2="45" y2="168" stroke="currentColor" strokeWidth="0.3" className="text-amber-200" />
        <line x1="55" y1="140" x2="55" y2="168" stroke="currentColor" strokeWidth="0.3" className="text-amber-200" />
        <line x1="65" y1="140" x2="65" y2="168" stroke="currentColor" strokeWidth="0.3" className="text-amber-200" />
        <line x1="75" y1="140" x2="75" y2="168" stroke="currentColor" strokeWidth="0.3" className="text-amber-200" />
      </svg>

      {/* Steam locomotive - right side middle - Increased opacity to 0.12 */}
      <svg
        className="absolute top-[55%] right-[6%] w-48 h-32 md:w-64 md:h-44 opacity-[0.12]"
        viewBox="0 0 200 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Boiler */}
        <rect
          x="60"
          y="40"
          width="100"
          height="40"
          rx="20"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-amber-200"
        />
        <ellipse
          cx="160"
          cy="60"
          rx="10"
          ry="20"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
          className="text-amber-200"
        />
        {/* Smokestack */}
        <rect
          x="70"
          y="20"
          width="20"
          height="25"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-amber-200"
        />
        <ellipse
          cx="80"
          cy="20"
          rx="12"
          ry="4"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
          className="text-amber-200"
        />
        {/* Smoke puffs */}
        <circle cx="80" cy="10" r="6" stroke="currentColor" strokeWidth="0.4" fill="none" className="text-amber-200" />
        <circle cx="72" cy="5" r="4" stroke="currentColor" strokeWidth="0.3" fill="none" className="text-amber-200" />
        <circle cx="88" cy="3" r="5" stroke="currentColor" strokeWidth="0.3" fill="none" className="text-amber-200" />
        {/* Cab */}
        <rect
          x="145"
          y="25"
          width="35"
          height="55"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-amber-200"
        />
        <rect
          x="155"
          y="35"
          width="15"
          height="15"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          className="text-amber-200"
        />
        {/* Wheels */}
        <circle cx="85" cy="90" r="15" stroke="currentColor" strokeWidth="1" fill="none" className="text-amber-200" />
        <circle cx="85" cy="90" r="10" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-amber-200" />
        <circle cx="85" cy="90" r="3" fill="currentColor" className="text-amber-200" />
        <circle cx="125" cy="90" r="15" stroke="currentColor" strokeWidth="1" fill="none" className="text-amber-200" />
        <circle
          cx="125"
          cy="90"
          r="10"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          className="text-amber-200"
        />
        <circle cx="125" cy="90" r="3" fill="currentColor" className="text-amber-200" />
        <circle
          cx="165"
          cy="90"
          r="12"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
          className="text-amber-200"
        />
        <circle cx="165" cy="90" r="3" fill="currentColor" className="text-amber-200" />
        {/* Connecting rods */}
        <line x1="85" y1="90" x2="125" y2="90" stroke="currentColor" strokeWidth="0.8" className="text-amber-200" />
        <line x1="85" y1="80" x2="50" y2="70" stroke="currentColor" strokeWidth="0.5" className="text-amber-200" />
        {/* Cowcatcher */}
        <path
          d="M60 80 L40 100 L60 100 Z"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
          className="text-amber-200"
        />
        {/* Rails */}
        <line x1="20" y1="105" x2="190" y2="105" stroke="currentColor" strokeWidth="0.8" className="text-amber-200" />
        <line x1="20" y1="110" x2="190" y2="110" stroke="currentColor" strokeWidth="0.8" className="text-amber-200" />
      </svg>

      {/* Vintage automobile - bottom right - Increased opacity to 0.12 */}
      <svg
        className="absolute bottom-[8%] right-[20%] w-44 h-28 md:w-56 md:h-36 opacity-[0.12]"
        viewBox="0 0 180 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Body */}
        <path
          d="M30 60 L30 45 Q50 35 80 35 L120 35 Q140 35 150 50 L160 50 L160 60 L155 65 L35 65 L30 60 Z"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-amber-200"
        />
        {/* Cabin */}
        <path
          d="M60 35 L65 20 Q90 15 115 20 L120 35"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
          className="text-amber-200"
        />
        <line x1="90" y1="35" x2="90" y2="18" stroke="currentColor" strokeWidth="0.5" className="text-amber-200" />
        {/* Wheels with spokes */}
        <circle cx="55" cy="70" r="18" stroke="currentColor" strokeWidth="1" fill="none" className="text-amber-200" />
        <circle cx="55" cy="70" r="12" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-amber-200" />
        <circle cx="55" cy="70" r="4" fill="currentColor" className="text-amber-200" />
        <line x1="55" y1="52" x2="55" y2="88" stroke="currentColor" strokeWidth="0.3" className="text-amber-200" />
        <line x1="37" y1="70" x2="73" y2="70" stroke="currentColor" strokeWidth="0.3" className="text-amber-200" />
        <line x1="43" y1="58" x2="67" y2="82" stroke="currentColor" strokeWidth="0.3" className="text-amber-200" />
        <line x1="43" y1="82" x2="67" y2="58" stroke="currentColor" strokeWidth="0.3" className="text-amber-200" />
        <circle cx="135" cy="70" r="18" stroke="currentColor" strokeWidth="1" fill="none" className="text-amber-200" />
        <circle
          cx="135"
          cy="70"
          r="12"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          className="text-amber-200"
        />
        <circle cx="135" cy="70" r="4" fill="currentColor" className="text-amber-200" />
        <line x1="135" y1="52" x2="135" y2="88" stroke="currentColor" strokeWidth="0.3" className="text-amber-200" />
        <line x1="117" y1="70" x2="153" y2="70" stroke="currentColor" strokeWidth="0.3" className="text-amber-200" />
        {/* Headlamps */}
        <circle cx="25" cy="55" r="5" stroke="currentColor" strokeWidth="0.8" fill="none" className="text-amber-200" />
        <circle cx="165" cy="55" r="4" stroke="currentColor" strokeWidth="0.6" fill="none" className="text-amber-200" />
        {/* Steering wheel hint */}
        <circle cx="75" cy="40" r="6" stroke="currentColor" strokeWidth="0.4" fill="none" className="text-amber-200" />
      </svg>

      {/* Secondary compass - bottom center area - Increased opacity to 0.1 */}
      <svg
        className="absolute bottom-[35%] left-[40%] w-32 h-32 md:w-44 md:h-44 opacity-[0.1]"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.5" className="text-amber-200" />
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" className="text-amber-200" />
        <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.3" className="text-amber-200" />
        <path d="M50 2 L54 50 L50 98 L46 50 Z" fill="currentColor" className="text-amber-200" />
        <path d="M2 50 L50 46 L98 50 L50 54 Z" fill="currentColor" className="text-amber-200" />
        <circle cx="50" cy="50" r="5" fill="currentColor" className="text-amber-200" />
      </svg>

      {/* Ornate border elements - Increased opacity to 0.12 */}
      <svg className="absolute top-0 left-0 w-24 h-24 md:w-32 md:h-32 opacity-[0.12]" viewBox="0 0 100 100" fill="none">
        <path d="M0 30 Q15 15 30 0" stroke="currentColor" strokeWidth="1" fill="none" className="text-amber-200" />
        <path d="M0 50 Q25 25 50 0" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-amber-200" />
        <path d="M0 70 Q35 35 70 0" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-amber-200" />
        <circle cx="15" cy="15" r="3" fill="currentColor" className="text-amber-200" />
      </svg>
      <svg
        className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 opacity-[0.12]"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path d="M100 30 Q85 15 70 0" stroke="currentColor" strokeWidth="1" fill="none" className="text-amber-200" />
        <path d="M100 50 Q75 25 50 0" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-amber-200" />
        <path d="M100 70 Q65 35 30 0" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-amber-200" />
        <circle cx="85" cy="15" r="3" fill="currentColor" className="text-amber-200" />
      </svg>
      <svg
        className="absolute bottom-0 left-0 w-24 h-24 md:w-32 md:h-32 opacity-[0.12]"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path d="M0 70 Q15 85 30 100" stroke="currentColor" strokeWidth="1" fill="none" className="text-amber-200" />
        <path d="M0 50 Q25 75 50 100" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-amber-200" />
        <circle cx="15" cy="85" r="3" fill="currentColor" className="text-amber-200" />
      </svg>
      <svg
        className="absolute bottom-0 right-0 w-24 h-24 md:w-32 md:h-32 opacity-[0.12]"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path d="M100 70 Q85 85 70 100" stroke="currentColor" strokeWidth="1" fill="none" className="text-amber-200" />
        <path
          d="M100 50 Q75 75 50 100"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          className="text-amber-200"
        />
        <circle cx="85" cy="85" r="3" fill="currentColor" className="text-amber-200" />
      </svg>

      {/* Star/diamond symbols scattered more densely - bumped opacities */}
      {[
        { top: "8%", left: "25%", size: "w-3 h-3", opacity: "0.2" },
        { top: "18%", left: "45%", size: "w-2 h-2", opacity: "0.15" },
        { top: "28%", right: "30%", size: "w-4 h-4", opacity: "0.18" },
        { top: "42%", left: "22%", size: "w-2 h-2", opacity: "0.14" },
        { top: "55%", left: "55%", size: "w-3 h-3", opacity: "0.16" },
        { top: "68%", right: "45%", size: "w-2 h-2", opacity: "0.18" },
        { top: "75%", left: "35%", size: "w-3 h-3", opacity: "0.14" },
        { top: "85%", left: "60%", size: "w-2 h-2", opacity: "0.16" },
        { top: "12%", right: "55%", size: "w-2 h-2", opacity: "0.12" },
        { top: "92%", left: "15%", size: "w-3 h-3", opacity: "0.16" },
      ].map((star, i) => (
        <div
          key={i}
          className={`absolute ${star.size}`}
          style={{
            top: star.top,
            left: star.left,
            right: star.right,
            opacity: star.opacity,
          }}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="text-amber-200">
            <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" />
          </svg>
        </div>
      ))}

      {/* Latitude lines - more of them */}
      <div className="absolute inset-0">
        {[15, 30, 45, 60, 75, 90].map((pos) => (
          <div
            key={pos}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/15 to-transparent"
            style={{ top: `${pos}%` }}
          />
        ))}
      </div>

      {/* Decorative cartouche frame elements - Increased opacity to 0.12 */}
      <svg className="absolute top-[25%] right-[2%] w-6 h-48 opacity-[0.12]" viewBox="0 0 20 150" fill="none">
        <path
          d="M10 0 Q20 15 10 30 Q0 45 10 60 Q20 75 10 90 Q0 105 10 120 Q20 135 10 150"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-amber-200"
        />
      </svg>
      <svg className="absolute top-[45%] left-[2%] w-6 h-48 opacity-[0.12]" viewBox="0 0 20 150" fill="none">
        <path
          d="M10 0 Q0 15 10 30 Q20 45 10 60 Q0 75 10 90 Q20 105 10 120 Q0 135 10 150"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-amber-200"
        />
      </svg>
    </div>
  )
}