import React from 'react';

// Official PGRI Emblem Vector
export const PgriEmblemSvg: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#059669" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="43" fill="#047857" />
    {/* Inner ring */}
    <circle cx="50" cy="50" r="38" fill="#F8FAFC" />
    {/* Open Book */}
    <path d="M30 65 C40 60, 48 62, 50 67 C52 62, 60 60, 70 65 L70 52 C60 48, 52 50, 50 55 C48 50, 40 48, 30 52 Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
    {/* Torch handle */}
    <rect x="47" y="38" width="6" height="25" rx="1.5" fill="#D97706" stroke="#92400E" strokeWidth="1" />
    <path d="M44 40 L56 40 L54 36 L46 36 Z" fill="#B45309" />
    {/* Flame 4 leaves */}
    <path d="M50 20 C46 26, 44 32, 50 36 C56 32, 54 26, 50 20 Z" fill="#DC2626" />
    <path d="M50 24 C47 28, 47 31, 50 34 C53 31, 53 28, 50 24 Z" fill="#FBBF24" />
    {/* Rice & Cotton Wreath */}
    <path d="M22 55 C22 35, 36 24, 46 22" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 4" />
    <path d="M78 55 C78 35, 64 24, 54 22" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 4" />
    {/* Red White Ribbon */}
    <path d="M26 73 Q50 82 74 73" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" />
    <path d="M26 77 Q50 86 74 77" stroke="#F1F5F9" strokeWidth="3" strokeLinecap="round" />
    <text x="50" y="82" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontWeight="bold" fontFamily="sans-serif">PGRI</text>
  </svg>
);

// Official Wonogiri Regency Emblem Vector
export const WonogiriEmblemSvg: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Outer Shield */}
    <path d="M50 8 L84 20 L80 62 C78 80, 50 94, 50 94 C50 94, 22 80, 20 62 L16 20 Z" fill="#047857" stroke="#F59E0B" strokeWidth="3" />
    {/* Inner Shield */}
    <path d="M50 14 L78 24 L75 58 C73 74, 50 87, 50 87 C50 87, 27 74, 25 58 L22 24 Z" fill="#0284C7" />
    {/* Star at Top */}
    <polygon points="50,18 52,24 58,24 53,28 55,34 50,30 45,34 47,28 42,24 48,24" fill="#FBBF24" />
    {/* Gajah Mungkur Water reservoir waves */}
    <path d="M26 58 Q38 52 50 58 T74 58 L75 66 C73 75, 50 85, 50 85 C50 85, 27 75, 25 66 Z" fill="#0369A1" opacity="0.8" />
    <path d="M28 62 Q39 57 50 62 T72 62" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
    {/* Mountain Silhouette (Gunung Gandrung / Gajah Mungkur) */}
    <polygon points="34,54 50,38 66,54" fill="#065F46" />
    <polygon points="44,54 50,44 58,54" fill="#047857" />
    {/* Keris / Monument in center */}
    <rect x="48.5" y="32" width="3" height="26" fill="#F8FAFC" stroke="#334155" strokeWidth="0.8" />
    <circle cx="50" cy="31" r="2.5" fill="#F59E0B" />
    {/* Red White Banner at bottom */}
    <path d="M30 74 Q50 80 70 74" stroke="#DC2626" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M30 77.5 Q50 83.5 70 77.5" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    <text x="50" y="80" textAnchor="middle" fill="#1E293B" fontSize="4.5" fontWeight="900" fontFamily="sans-serif">WONOGIRI</text>
  </svg>
);

// Fallback Logo Component with img + onerror
export const LogoWithFallback: React.FC<{
  src: string;
  alt: string;
  type: 'pgri' | 'wonogiri';
  size?: number;
  className?: string;
}> = ({ src, alt, type, size = 44, className = '' }) => {
  const [useFallback, setUseFallback] = React.useState(false);

  if (useFallback) {
    return type === 'pgri' ? <PgriEmblemSvg size={size} className={className} /> : <WonogiriEmblemSvg size={size} className={className} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`object-contain ${className}`}
      referrerPolicy="no-referrer"
      onError={() => setUseFallback(true)}
    />
  );
};

// 3 SNI BINS
export const SniBinSvg: React.FC<{ type: 'organik' | 'anorganik' | 'b3'; size?: number; className?: string }> = ({ type, size = 100, className = '' }) => {
  const configs = {
    organik: {
      colorMain: '#10B981',
      colorDark: '#047857',
      label: 'ORGANIK',
      sub: 'Sampah Basah/Alami',
      icon: (
        <g transform="translate(32, 48)">
          <path d="M18 4 C28 4, 34 16, 32 26 C28 34, 18 36, 14 36 C8 32, 4 24, 6 16 C8 8, 14 4, 18 4 Z" fill="#A7F3D0" stroke="#065F46" strokeWidth="2" />
          <path d="M18 4 Q18 20 28 30" stroke="#047857" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M18 16 Q23 14 26 18" stroke="#047857" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </g>
      ),
    },
    anorganik: {
      colorMain: '#F59E0B',
      colorDark: '#B45309',
      label: 'ANORGANIK',
      sub: 'Daur Ulang (Plastik/Kertas)',
      icon: (
        <g transform="translate(32, 48)">
          {/* Recycling triangle */}
          <path d="M18 6 L28 24 L8 24 Z" fill="none" stroke="#FEF3C7" strokeWidth="3" strokeLinejoin="round" />
          <path d="M18 4 L22 8 L18 10" fill="#FEF3C7" />
          <path d="M28 24 L24 28 L28 30" fill="#FEF3C7" />
          <path d="M8 24 L10 20 L6 20" fill="#FEF3C7" />
        </g>
      ),
    },
    b3: {
      colorMain: '#EF4444',
      colorDark: '#B91C1C',
      label: 'B3 BERACUN',
      sub: 'Bahan Berbahaya & Tajam',
      icon: (
        <g transform="translate(32, 48)">
          {/* Danger Diamond with exclamation & skull */}
          <polygon points="18,4 32,18 18,32 4,18" fill="#FEE2E2" stroke="#7F1D1D" strokeWidth="2.5" />
          <line x1="18" y1="10" x2="18" y2="20" stroke="#991B1B" strokeWidth="3" strokeLinecap="round" />
          <circle cx="18" cy="25" r="2" fill="#991B1B" />
        </g>
      ),
    },
  };

  const cfg = configs[type];

  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 100 125" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Bin Lid */}
      <rect x="18" y="14" width="64" height="10" rx="4" fill={cfg.colorDark} stroke="#0F172A" strokeWidth="2" />
      <rect x="38" y="8" width="24" height="6" rx="3" fill={cfg.colorMain} stroke="#0F172A" strokeWidth="2" />
      {/* Bin Body */}
      <path d="M22 24 L28 108 C28 112 32 116 38 116 L62 116 C68 116 72 112 72 108 L78 24 Z" fill={cfg.colorMain} stroke="#0F172A" strokeWidth="2.5" />
      {/* Grip lines */}
      <line x1="32" y1="34" x2="68" y2="34" stroke={cfg.colorDark} strokeWidth="3" strokeLinecap="round" />
      {/* Type Icon */}
      {cfg.icon}
      {/* Label Badge */}
      <rect x="25" y="88" width="50" height="18" rx="4" fill="#0F172A" opacity="0.85" />
      <text x="50" y="99" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">
        {cfg.label}
      </text>
      <text x="50" y="104" textAnchor="middle" fill="#E2E8F0" fontSize="3.8" fontFamily="sans-serif">
        SNI 19-3983
      </text>
    </svg>
  );
};

// 9 WASTE ITEMS SVG
export const WasteItemSvg: React.FC<{ itemKey: string; size?: number; className?: string }> = ({ itemKey, size = 64, className = '' }) => {
  switch (itemKey) {
    case 'kulit_pisang':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="40" cy="40" r="36" fill="#FEF3C7" />
          <path d="M22 55 C28 42, 38 28, 48 22 C52 20, 56 22, 58 26 C52 38, 45 54, 30 62 C25 64, 20 60, 22 55 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
          <path d="M48 22 L55 16 L58 18 L52 25 Z" fill="#713F12" />
          {/* Peels */}
          <path d="M38 35 C46 38, 54 48, 62 50 C58 52, 48 48, 40 42 Z" fill="#EAB308" />
          <circle cx="34" cy="48" r="1.5" fill="#713F12" />
          <circle cx="44" cy="38" r="1.5" fill="#713F12" />
        </svg>
      );
    case 'sisa_apel':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="40" cy="40" r="36" fill="#FEE2E2" />
          {/* Apple Core */}
          <path d="M30 22 C22 30, 22 50, 30 58 C35 56, 36 50, 36 40 C36 30, 35 24, 30 22 Z" fill="#DC2626" />
          <path d="M50 22 C58 30, 58 50, 50 58 C45 56, 44 50, 44 40 C44 30, 45 24, 50 22 Z" fill="#DC2626" />
          <path d="M30 22 Q40 26 50 22 L45 58 Q40 54 35 58 Z" fill="#FEF08A" />
          {/* Seeds */}
          <ellipse cx="38" cy="36" rx="2" ry="3" fill="#451A03" transform="rotate(-15 38 36)" />
          <ellipse cx="42" cy="44" rx="2" ry="3" fill="#451A03" transform="rotate(15 42 44)" />
          {/* Stem & Leaf */}
          <path d="M40 22 Q42 14 46 12" stroke="#713F12" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M44 14 C48 12, 54 13, 53 18 C48 18, 45 16, 44 14 Z" fill="#16A34A" />
        </svg>
      );
    case 'daun_kering':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="40" cy="40" r="36" fill="#FEF3C7" />
          <path d="M24 56 C24 38, 38 24, 56 22 C56 40, 42 54, 24 56 Z" fill="#D97706" stroke="#92400E" strokeWidth="2" />
          <path d="M24 56 L56 22" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
          <path d="M34 45 L42 45" stroke="#78350F" strokeWidth="1.5" />
          <path d="M42 37 L50 37" stroke="#78350F" strokeWidth="1.5" />
          <path d="M24 56 L18 64" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'botol_plastik':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="40" cy="40" r="36" fill="#E0F2FE" />
          {/* Cap */}
          <rect x="36" y="14" width="8" height="5" rx="1.5" fill="#0284C7" />
          {/* Bottle neck & body */}
          <path d="M38 19 L38 24 L30 32 L30 60 C30 63, 33 66, 36 66 L44 66 C47 66, 50 63, 50 60 L50 32 L42 24 L42 19 Z" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />
          {/* Label */}
          <rect x="30" y="38" width="20" height="14" fill="#38BDF8" />
          <path d="M36 45 L44 45" stroke="#FFFFFF" strokeWidth="1.5" />
          <text x="40" y="47" textAnchor="middle" fill="#FFFFFF" fontSize="5" fontWeight="bold">PET</text>
        </svg>
      );
    case 'kaleng_aluminium':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="40" cy="40" r="36" fill="#F1F5F9" />
          <rect x="30" y="24" width="20" height="34" rx="4" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
          <ellipse cx="40" cy="24" rx="10" ry="3" fill="#CBD5E1" stroke="#475569" strokeWidth="1.5" />
          <ellipse cx="40" cy="58" rx="10" ry="3" fill="#64748B" stroke="#475569" strokeWidth="1.5" />
          {/* Pull tab */}
          <circle cx="40" cy="24" r="2" fill="#334155" />
          {/* Soda stripe */}
          <path d="M30 36 C36 34, 44 42, 50 38 L50 48 C44 50, 36 44, 30 46 Z" fill="#EF4444" />
        </svg>
      );
    case 'kardus_koran':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="40" cy="40" r="36" fill="#FEF3C7" />
          {/* Box isometric */}
          <path d="M22 36 L40 26 L58 36 L40 46 Z" fill="#D97706" stroke="#92400E" strokeWidth="2" />
          <path d="M22 36 L40 46 L40 62 L22 52 Z" fill="#B45309" stroke="#92400E" strokeWidth="2" />
          <path d="M58 36 L40 46 L40 62 L58 52 Z" fill="#78350F" stroke="#92400E" strokeWidth="2" />
          {/* Newspaper peeking */}
          <rect x="34" y="22" width="16" height="12" rx="1" fill="#F8FAFC" stroke="#64748B" strokeWidth="1" transform="rotate(-10 34 22)" />
        </svg>
      );
    case 'baterai_bekas':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="40" cy="40" r="36" fill="#FEE2E2" />
          {/* Battery Nub */}
          <rect x="36" y="16" width="8" height="4" rx="1" fill="#94A3B8" stroke="#334155" strokeWidth="1" />
          {/* Battery Body */}
          <rect x="30" y="20" width="20" height="42" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <rect x="30" y="20" width="20" height="12" fill="#E11D48" />
          {/* Danger Stripe & Skull */}
          <polygon points="40,36 34,48 46,48" fill="#FACC15" stroke="#713F12" strokeWidth="1" />
          <text x="40" y="46" textAnchor="middle" fill="#000000" fontSize="8" fontWeight="900">!</text>
          <text x="40" y="58" textAnchor="middle" fill="#F87171" fontSize="4.5" fontWeight="bold">TOXIC</text>
        </svg>
      );
    case 'bohlam_neon':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="40" cy="40" r="36" fill="#FEE2E2" />
          {/* Broken bulb shape */}
          <path d="M30 40 C28 32, 32 22, 42 22 C50 22, 54 28, 52 36 L48 44 L34 44 Z" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" />
          {/* Cracked zig-zag */}
          <path d="M34 32 L40 38 L36 42 L42 46" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          {/* Base screw */}
          <rect x="35" y="44" width="12" height="8" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
          <rect x="37" y="52" width="8" height="4" rx="1" fill="#334155" />
          {/* Danger spark */}
          <polygon points="56,26 62,24 58,30" fill="#EF4444" />
        </svg>
      );
    case 'pestisida':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="40" cy="40" r="36" fill="#FEE2E2" />
          {/* Spray nozzle */}
          <rect x="37" y="16" width="6" height="6" rx="1" fill="#DC2626" />
          <circle cx="42" cy="19" r="1.5" fill="#FFFFFF" />
          {/* Can */}
          <rect x="30" y="22" width="20" height="42" rx="3" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="2" />
          {/* Warning label */}
          <rect x="32" y="32" width="16" height="18" fill="#FEF08A" />
          <polygon points="40,35 34,46 46,46" fill="#DC2626" />
          <text x="40" y="44" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="bold">☠</text>
        </svg>
      );
    default:
      return null;
  }
};

// MISSION 2: FORESTRY TREE STAGES
export const ForestryTreeSvg: React.FC<{ stage: number; size?: number; className?: string }> = ({ stage, size = 160, className = '' }) => {
  if (stage === 0) {
    // Withered Tree
    return (
      <svg width={size} height={size * 1.1} viewBox="0 0 160 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Dry Cracked Soil */}
        <ellipse cx="80" cy="155" rx="60" ry="16" fill="#78350F" />
        <path d="M40 155 L65 158 L55 165" stroke="#451A03" strokeWidth="2" />
        <path d="M100 152 L115 156 L125 154" stroke="#451A03" strokeWidth="2" />
        {/* Bare Twisted Trunk */}
        <path d="M72 155 Q74 110 80 90 Q85 70 82 45" stroke="#522504" strokeWidth="14" strokeLinecap="round" />
        {/* Dry branches */}
        <path d="M78 100 Q60 85 45 78" stroke="#522504" strokeWidth="7" strokeLinecap="round" />
        <path d="M82 85 Q105 70 120 65" stroke="#522504" strokeWidth="6" strokeLinecap="round" />
        <path d="M45 78 L35 70" stroke="#522504" strokeWidth="4" strokeLinecap="round" />
        <path d="M110 70 L125 55" stroke="#522504" strokeWidth="4" strokeLinecap="round" />
        {/* Few drooping yellow leaves */}
        <circle cx="36" cy="68" r="5" fill="#CA8A04" />
        <circle cx="124" cy="54" r="5" fill="#EAB308" />
        <circle cx="82" cy="44" r="6" fill="#A16207" />
        {/* Thirst cloud */}
        <text x="80" y="24" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="bold">Kering Retak 🥀</text>
      </svg>
    );
  }

  if (stage === 1) {
    // Watered Sapling
    return (
      <svg width={size} height={size * 1.1} viewBox="0 0 160 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Moist Dark Soil */}
        <ellipse cx="80" cy="155" rx="60" ry="16" fill="#3D1D09" />
        <ellipse cx="80" cy="155" rx="45" ry="10" fill="#1E293B" opacity="0.4" />
        {/* Water drops glistening */}
        <circle cx="65" cy="153" r="3" fill="#38BDF8" />
        <circle cx="95" cy="156" r="2.5" fill="#38BDF8" />
        {/* Sprouting Trunk */}
        <path d="M74 155 Q76 115 80 85" stroke="#78350F" strokeWidth="12" strokeLinecap="round" />
        {/* Young Foliage Canopy */}
        <circle cx="65" cy="80" r="24" fill="#22C55E" />
        <circle cx="95" cy="80" r="24" fill="#16A34A" />
        <circle cx="80" cy="62" r="28" fill="#4ADE80" />
        <circle cx="80" cy="75" r="20" fill="#86EFAC" opacity="0.6" />
        <text x="80" y="24" textAnchor="middle" fill="#0284C7" fontSize="11" fontWeight="bold">Lembap & Segar 💧</text>
      </svg>
    );
  }

  // Stage 2: Lush Green Fruiting Tree
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 160 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Rich Humus Compost Soil */}
      <ellipse cx="80" cy="155" rx="65" ry="18" fill="#291406" />
      <path d="M45 158 Q80 168 115 158" stroke="#15803D" strokeWidth="4" strokeLinecap="round" />
      {/* Strong Trunk */}
      <path d="M72 155 Q74 110 80 75" stroke="#713F12" strokeWidth="18" strokeLinecap="round" />
      <path d="M80 155 L65 170" stroke="#713F12" strokeWidth="8" strokeLinecap="round" />
      <path d="M80 155 L95 170" stroke="#713F12" strokeWidth="8" strokeLinecap="round" />
      {/* Massive Lush Canopy */}
      <circle cx="50" cy="85" r="32" fill="#15803D" />
      <circle cx="110" cy="85" r="32" fill="#16A34A" />
      <circle cx="80" cy="50" r="38" fill="#22C55E" />
      <circle cx="65" cy="60" r="30" fill="#4ADE80" opacity="0.5" />
      {/* Bright Juicy Fruits */}
      <circle cx="55" cy="75" r="6" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
      <circle cx="105" cy="70" r="6" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
      <circle cx="80" cy="40" r="6.5" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
      <circle cx="75" cy="95" r="5.5" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
      <circle cx="115" cy="98" r="5.5" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
      {/* Singing Bird */}
      <path d="M38 58 Q44 54 48 58 Q46 64 40 62 Z" fill="#FACC15" />
      <text x="80" y="16" textAnchor="middle" fill="#10B981" fontSize="12" fontWeight="bold">Rimbun & Berbuah 🌳✨</text>
    </svg>
  );
};

// MISSION 2: FORESTRY TOOLS
export const ForestryToolSvg: React.FC<{ toolKey: string; size?: number; className?: string }> = ({ toolKey, size = 60, className = '' }) => {
  switch (toolKey) {
    case 'gembor':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="40" cy="40" r="36" fill="#E0F2FE" />
          {/* Can body */}
          <path d="M26 38 L30 62 C30 64, 34 66, 42 66 L50 66 C58 66, 62 64, 62 62 L66 38 Z" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
          {/* Handle */}
          <path d="M26 42 C16 42, 16 58, 28 60" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Spout */}
          <path d="M62 48 L74 34" stroke="#0284C7" strokeWidth="5" strokeLinecap="round" />
          <ellipse cx="75" cy="33" rx="4" ry="2" fill="#38BDF8" transform="rotate(-30 75 33)" />
          {/* Water drops */}
          <circle cx="76" cy="44" r="1.5" fill="#0284C7" />
          <circle cx="72" cy="50" r="2" fill="#0284C7" />
          <circle cx="68" cy="56" r="1.5" fill="#0284C7" />
        </svg>
      );
    case 'pupuk':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="40" cy="40" r="36" fill="#DCFCE7" />
          {/* Fertilizer Sack */}
          <path d="M26 28 C26 24, 54 24, 54 28 L58 62 C58 66, 52 68, 40 68 C28 68, 22 66, 22 62 Z" fill="#15803D" stroke="#166534" strokeWidth="2" />
          <path d="M26 28 L54 28" stroke="#CA8A04" strokeWidth="4" strokeLinecap="round" />
          {/* Seedling on bag */}
          <circle cx="40" cy="48" r="10" fill="#FEF08A" />
          <path d="M40 52 L40 44 Q44 40 48 42" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M40 44 Q36 40 32 42" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      );
    case 'sekop':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="40" cy="40" r="36" fill="#FEF3C7" />
          {/* Handle */}
          <path d="M24 64 L46 36" stroke="#92400E" strokeWidth="5" strokeLinecap="round" />
          <path d="M20 68 L28 60" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
          {/* Shovel blade */}
          <path d="M44 38 L58 20 C64 24, 62 34, 54 44 Z" fill="#64748B" stroke="#334155" strokeWidth="2" />
          {/* Weeds cut */}
          <path d="M28 28 Q34 22 40 26" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
          <path d="M34 20 Q38 16 42 22" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'semprotan':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="40" cy="40" r="36" fill="#ECFDF5" />
          {/* Spray bottle body */}
          <rect x="30" y="36" width="22" height="30" rx="6" fill="#10B981" stroke="#047857" strokeWidth="2" />
          {/* Trigger head */}
          <path d="M34 36 L34 26 L46 26 L46 36 Z" fill="#059669" stroke="#047857" strokeWidth="2" />
          <path d="M30 26 L22 28" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
          <path d="M46 29 L56 29" stroke="#047857" strokeWidth="3" strokeLinecap="round" />
          {/* Natural leaf icon */}
          <path d="M36 50 C36 44, 46 44, 46 50 C46 56, 36 56, 36 50 Z" fill="#A7F3D0" />
          {/* Fine mist droplets */}
          <circle cx="62" cy="26" r="2" fill="#34D399" />
          <circle cx="68" cy="24" r="1.5" fill="#34D399" />
          <circle cx="65" cy="32" r="2" fill="#34D399" />
        </svg>
      );
    case 'ajir':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="40" cy="40" r="36" fill="#FEFCE8" />
          {/* Bamboo poles */}
          <line x1="28" y1="16" x2="38" y2="66" stroke="#84CC16" strokeWidth="5" strokeLinecap="round" />
          <line x1="52" y1="16" x2="42" y2="66" stroke="#65A30D" strokeWidth="5" strokeLinecap="round" />
          {/* Bamboo joints */}
          <line x1="27" y1="28" x2="34" y2="30" stroke="#4D7C0F" strokeWidth="2" />
          <line x1="31" y1="46" x2="38" y2="48" stroke="#4D7C0F" strokeWidth="2" />
          <line x1="46" y1="28" x2="53" y2="30" stroke="#365314" strokeWidth="2" />
          <line x1="42" y1="46" x2="49" y2="48" stroke="#365314" strokeWidth="2" />
          {/* Binding cord / hemp rope */}
          <ellipse cx="40" cy="36" rx="14" ry="4" stroke="#D97706" strokeWidth="3" fill="none" />
          <ellipse cx="40" cy="52" rx="12" ry="3.5" stroke="#D97706" strokeWidth="2.5" fill="none" />
        </svg>
      );
    case 'gunting':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="40" cy="40" r="36" fill="#F0FDF4" />
          {/* Blades */}
          <path d="M40 38 L56 20 C54 28, 48 34, 40 38 Z" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
          <path d="M40 38 L52 14 C48 22, 44 30, 40 38 Z" fill="#CBD5E1" stroke="#475569" strokeWidth="1.5" />
          {/* Pivot rivet */}
          <circle cx="40" cy="38" r="3" fill="#D97706" stroke="#78350F" strokeWidth="1" />
          {/* Handles */}
          <path d="M40 38 L26 56 C22 62, 28 68, 34 62 L40 46" stroke="#DC2626" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M40 38 L48 58 C52 64, 58 60, 54 52 L42 42" stroke="#DC2626" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        </svg>
      );
    case 'kapak':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="40" cy="40" r="36" fill="#FEE2E2" />
          {/* Wooden Handle */}
          <path d="M26 66 L56 22" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
          {/* Axe Blade */}
          <path d="M52 24 L62 18 C66 22, 66 32, 60 36 L50 30 Z" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
          {/* Danger sign */}
          <circle cx="28" cy="28" r="10" fill="#DC2626" />
          <text x="28" y="32" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">✕</text>
        </svg>
      );
    case 'api':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="40" cy="40" r="36" fill="#FEE2E2" />
          {/* Burning Flame */}
          <path d="M40 18 C30 30, 26 42, 32 54 C36 62, 46 64, 52 58 C60 50, 56 36, 40 18 Z" fill="#DC2626" />
          <path d="M40 32 C34 40, 32 48, 36 54 C40 60, 48 58, 48 50 C48 42, 44 38, 40 32 Z" fill="#F59E0B" />
          <path d="M40 44 C38 48, 38 52, 40 54 C42 56, 44 54, 44 50 Z" fill="#FEF08A" />
          {/* Danger sign */}
          <circle cx="58" cy="24" r="9" fill="#991B1B" />
          <text x="58" y="28" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">✕</text>
        </svg>
      );
    default:
      return null;
  }
};

// MISSION 2: ADVANCED CLINICAL FORESTRY SITUATION DISPLAY (1 SINGLE FOCAL OBJECT)
export const ForestrySituationSvg: React.FC<{
  type: 'dehidrasi' | 'klorosis' | 'gulma' | 'hama' | 'miring' | 'ranting_patah' | 'sembuh';
  size?: number;
  className?: string;
}> = ({ type, size = 180, className = '' }) => {
  if (type === 'sembuh') {
    return (
      <svg width={size} height={size * 1.15} viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Glow halo */}
        <circle cx="90" cy="90" r="75" fill="#10B981" opacity="0.15" />
        {/* Rich Humus Compost Soil */}
        <ellipse cx="90" cy="175" rx="72" ry="18" fill="#291406" />
        <ellipse cx="90" cy="173" rx="55" ry="12" fill="#15803D" opacity="0.4" />
        {/* Strong Trunk */}
        <path d="M82 175 Q84 125 90 90" stroke="#713F12" strokeWidth="18" strokeLinecap="round" />
        <path d="M90 175 L74 190" stroke="#713F12" strokeWidth="8" strokeLinecap="round" />
        <path d="M90 175 L106 190" stroke="#713F12" strokeWidth="8" strokeLinecap="round" />
        {/* Massive Lush Canopy */}
        <circle cx="58" cy="100" r="36" fill="#15803D" />
        <circle cx="122" cy="100" r="36" fill="#16A34A" />
        <circle cx="90" cy="65" r="44" fill="#22C55E" />
        <circle cx="72" cy="75" r="32" fill="#4ADE80" opacity="0.6" />
        <circle cx="110" cy="75" r="30" fill="#86EFAC" opacity="0.5" />
        {/* Bright Juicy Fruits */}
        <circle cx="62" cy="90" r="6.5" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
        <circle cx="118" cy="85" r="6.5" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
        <circle cx="90" cy="50" r="7" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
        <circle cx="82" cy="112" r="6" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
        <circle cx="126" cy="115" r="6" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
        {/* Singing Bird on Branch */}
        <path d="M46 72 Q52 68 56 72 Q54 78 48 76 Z" fill="#FACC15" />
        <polygon points="46,73 40,71 45,75" fill="#EAB308" />
        {/* Sparkles */}
        <polygon points="28,40 32,32 36,40 44,44 36,48 32,56 28,48 20,44" fill="#FDE047" />
        <polygon points="144,35 147,28 150,35 157,38 150,41 147,48 144,41 137,38" fill="#FDE047" />
        <text x="90" y="24" textAnchor="middle" fill="#34D399" fontSize="13" fontWeight="900">SEGAR & RIMBUN! 🌳✨</text>
      </svg>
    );
  }

  if (type === 'dehidrasi') {
    return (
      <svg width={size} height={size * 1.15} viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Dry Cracked Soil */}
        <ellipse cx="90" cy="175" rx="70" ry="16" fill="#78350F" />
        <path d="M45 174 L75 178 L65 186" stroke="#451A03" strokeWidth="2.5" />
        <path d="M110 172 L128 176 L138 174" stroke="#451A03" strokeWidth="2.5" />
        <path d="M85 177 L95 183" stroke="#451A03" strokeWidth="2" />
        {/* Bare Twisted Wilting Trunk */}
        <path d="M82 175 Q84 125 90 100 Q95 80 92 55" stroke="#522504" strokeWidth="15" strokeLinecap="round" />
        {/* Dry droopy branches */}
        <path d="M88 115 Q68 100 50 95" stroke="#522504" strokeWidth="8" strokeLinecap="round" />
        <path d="M92 98 Q118 82 135 78" stroke="#522504" strokeWidth="7" strokeLinecap="round" />
        <path d="M50 95 L40 88" stroke="#522504" strokeWidth="5" strokeLinecap="round" />
        <path d="M125 82 L140 68" stroke="#522504" strokeWidth="5" strokeLinecap="round" />
        {/* Drooping brown/withered leaves */}
        <circle cx="40" cy="85" r="6" fill="#CA8A04" />
        <circle cx="138" cy="66" r="6" fill="#A16207" />
        <circle cx="92" cy="54" r="7" fill="#78350F" />
        <circle cx="68" cy="98" r="5" fill="#EAB308" />
        {/* Sun heat lines */}
        <path d="M140 25 L155 15 M150 35 L168 35 M145 45 L160 55" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
        <circle cx="140" cy="35" r="10" fill="#FBBF24" />
        <text x="90" y="24" textAnchor="middle" fill="#EF4444" fontSize="12" fontWeight="bold">Tanah Kering Retak! 🥀</text>
      </svg>
    );
  }

  if (type === 'klorosis') {
    return (
      <svg width={size} height={size * 1.15} viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Nutrient poor grayish-brown Soil */}
        <ellipse cx="90" cy="175" rx="70" ry="16" fill="#57534E" />
        <ellipse cx="90" cy="173" rx="55" ry="10" fill="#78716C" opacity="0.5" />
        {/* Trunk */}
        <path d="M84 175 Q86 125 90 95" stroke="#713F12" strokeWidth="14" strokeLinecap="round" />
        {/* Yellowing Pale Canopy (Chlorosis) */}
        <circle cx="68" cy="95" r="30" fill="#EAB308" />
        <circle cx="112" cy="95" r="30" fill="#CA8A04" />
        <circle cx="90" cy="70" r="35" fill="#FACC15" />
        <circle cx="85" cy="85" r="22" fill="#FEF08A" opacity="0.6" />
        {/* Spots on leaves */}
        <circle cx="75" cy="65" r="3" fill="#A16207" />
        <circle cx="105" cy="72" r="3.5" fill="#A16207" />
        <circle cx="60" cy="95" r="2.5" fill="#A16207" />
        <circle cx="118" cy="102" r="3" fill="#A16207" />
        {/* Nutrient deficiency symbol */}
        <rect x="75" y="10" width="30" height="18" rx="4" fill="#991B1B" />
        <text x="90" y="22" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">-NPK</text>
        <text x="90" y="38" textAnchor="middle" fill="#EAB308" fontSize="11" fontWeight="bold">Klorosis / Daun Kuning 🍂</text>
      </svg>
    );
  }

  if (type === 'gulma') {
    return (
      <svg width={size} height={size * 1.15} viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Soil overwhelmed by weeds */}
        <ellipse cx="90" cy="175" rx="70" ry="16" fill="#3F220B" />
        {/* Trunk */}
        <path d="M84 175 Q86 125 90 95" stroke="#713F12" strokeWidth="14" strokeLinecap="round" />
        {/* Young Canopy */}
        <circle cx="70" cy="90" r="26" fill="#22C55E" opacity="0.8" />
        <circle cx="110" cy="90" r="26" fill="#16A34A" opacity="0.8" />
        <circle cx="90" cy="68" r="30" fill="#4ADE80" opacity="0.8" />
        {/* Parasitic Weed Vines wrapping the trunk */}
        <path d="M72 175 C85 165, 96 150, 84 140 C75 132, 98 120, 88 110" stroke="#84CC16" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M96 175 C80 160, 95 142, 86 130 C78 120, 94 112, 88 105" stroke="#4D7C0F" strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* Wild sharp weed leaves choking roots */}
        <path d="M50 178 Q65 150 60 140 Q75 155 80 175" fill="#65A30D" />
        <path d="M125 178 Q110 150 115 140 Q105 155 98 175" fill="#65A30D" />
        <path d="M68 180 Q76 160 82 176" fill="#84CC16" />
        <path d="M110 180 Q102 160 96 176" fill="#84CC16" />
        {/* Danger vine alert */}
        <text x="90" y="24" textAnchor="middle" fill="#F97316" fontSize="12" fontWeight="bold">Dibelit Gulma Liar! 🌾</text>
      </svg>
    );
  }

  if (type === 'hama') {
    return (
      <svg width={size} height={size * 1.15} viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Moist Soil */}
        <ellipse cx="90" cy="175" rx="70" ry="16" fill="#3D1D09" />
        {/* Trunk */}
        <path d="M84 175 Q86 125 90 95" stroke="#713F12" strokeWidth="14" strokeLinecap="round" />
        {/* Canopy with bitten holes */}
        <circle cx="70" cy="90" r="28" fill="#15803D" />
        <circle cx="110" cy="90" r="28" fill="#16A34A" />
        <circle cx="90" cy="65" r="32" fill="#22C55E" />
        {/* Eaten Leaf Holes */}
        <circle cx="62" cy="85" r="5" fill="#0F172A" />
        <circle cx="115" cy="88" r="6" fill="#0F172A" />
        <circle cx="85" cy="60" r="5" fill="#0F172A" />
        <circle cx="96" cy="74" r="4" fill="#0F172A" />
        {/* Pest Bugs (Caterpillars / Aphids) crawling */}
        {/* Bug 1 */}
        <ellipse cx="65" cy="80" rx="4.5" ry="3" fill="#DC2626" />
        <circle cx="61" cy="79" r="2" fill="#1E293B" />
        <line x1="62" y1="76" x2="60" y2="73" stroke="#1E293B" strokeWidth="1" />
        {/* Bug 2 */}
        <ellipse cx="110" cy="82" rx="4.5" ry="3" fill="#DC2626" />
        <circle cx="114" cy="81" r="2" fill="#1E293B" />
        <line x1="113" y1="78" x2="115" y2="75" stroke="#1E293B" strokeWidth="1" />
        {/* Bug 3 */}
        <ellipse cx="88" cy="95" rx="4" ry="2.5" fill="#EA580C" />
        {/* Alert */}
        <text x="90" y="24" textAnchor="middle" fill="#EF4444" fontSize="12" fontWeight="bold">Diserang Hama Kutu! 🐛</text>
      </svg>
    );
  }

  if (type === 'miring') {
    return (
      <svg width={size} height={size * 1.15} viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Disturbed soil around tilting root */}
        <ellipse cx="90" cy="175" rx="70" ry="16" fill="#451A03" />
        <path d="M55 174 Q75 165 95 172" stroke="#78350F" strokeWidth="4" />
        {/* Tilted / Leaning Trunk (25 degrees tilt) */}
        <path d="M75 175 Q95 130 120 85" stroke="#713F12" strokeWidth="15" strokeLinecap="round" />
        {/* Canopy shifted sideways */}
        <circle cx="105" cy="80" r="28" fill="#15803D" />
        <circle cx="140" cy="75" r="28" fill="#16A34A" />
        <circle cx="122" cy="55" r="32" fill="#22C55E" />
        {/* Exposed uprooted roots on left */}
        <path d="M72 175 L56 168 M74 178 L60 176" stroke="#92400E" strokeWidth="4" strokeLinecap="round" />
        {/* Wind swoosh lines */}
        <path d="M20 70 Q50 60 80 75" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7" />
        <path d="M30 95 Q65 85 95 100" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
        <text x="90" y="24" textAnchor="middle" fill="#38BDF8" fontSize="12" fontWeight="bold">Miring Tertiup Badai! 💨</text>
      </svg>
    );
  }

  // default: ranting_patah (broken infected branch)
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Soil */}
      <ellipse cx="90" cy="175" rx="70" ry="16" fill="#3D1D09" />
      {/* Trunk */}
      <path d="M84 175 Q86 125 90 95" stroke="#713F12" strokeWidth="14" strokeLinecap="round" />
      {/* Healthy main canopy */}
      <circle cx="75" cy="85" r="28" fill="#15803D" />
      <circle cx="95" cy="65" r="30" fill="#22C55E" />
      {/* Snapped / Rotten Sick Branch on right */}
      <path d="M90 110 L120 120 L135 145" stroke="#451A03" strokeWidth="8" strokeLinecap="round" />
      {/* Fracture splinter */}
      <polygon points="116,117 125,120 120,126" fill="#FEF08A" />
      {/* Gray fungal rot on snapped branch */}
      <circle cx="132" cy="142" r="7" fill="#64748B" />
      <circle cx="125" cy="135" r="5" fill="#475569" />
      <circle cx="138" cy="148" r="4" fill="#94A3B8" />
      {/* Dead brown withered twig leaves */}
      <circle cx="142" cy="144" r="5" fill="#78350F" />
      <text x="90" y="24" textAnchor="middle" fill="#E11D48" fontSize="12" fontWeight="bold">Ranting Busuk Menular! ✂️</text>
    </svg>
  );
};

// MISSION 3: ETHICAL SCENARIO ILLUSTRATIONS
export const ScenarioSceneSvg: React.FC<{ sceneKey: string; size?: number; className?: string }> = ({ sceneKey, size = 180, className = '' }) => {
  switch (sceneKey) {
    case 'scene_rumah':
      return (
        <svg width={size} height={size * 0.75} viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="240" height="160" rx="12" fill="#1E293B" />
          {/* Room wall & window */}
          <rect x="140" y="20" width="80" height="60" rx="4" fill="#38BDF8" opacity="0.3" stroke="#94A3B8" strokeWidth="2" />
          {/* Sun outside window */}
          <circle cx="180" cy="50" r="16" fill="#FACC15" />
          {/* Ceiling light burning unnecessarily */}
          <path d="M60 0 L60 30" stroke="#64748B" strokeWidth="3" />
          <polygon points="50,30 70,30 65,45 55,45" fill="#F59E0B" />
          <path d="M40 50 L80 50 L60 70 Z" fill="#FDE047" opacity="0.5" />
          <text x="60" y="80" textAnchor="middle" fill="#FDE047" fontSize="9" fontWeight="bold">Lampu Siang Nyala!</text>
          {/* Overflowing bathroom faucet */}
          <rect x="140" y="110" width="80" height="35" rx="6" fill="#64748B" />
          <path d="M165 95 L175 95 L175 110" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
          {/* Gushing water */}
          <path d="M175 110 L175 145" stroke="#38BDF8" strokeWidth="5" strokeLinecap="round" />
          <ellipse cx="180" cy="140" rx="30" ry="8" fill="#0284C7" />
          <path d="M150 145 Q180 155 210 145" stroke="#38BDF8" strokeWidth="4" />
          <text x="180" y="105" textAnchor="middle" fill="#EF4444" fontSize="9" fontWeight="bold">Meluber 10 L/menit!</text>
        </svg>
      );
    case 'scene_sekolah':
      return (
        <svg width={size} height={size * 0.75} viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="240" height="160" rx="12" fill="#0F172A" />
          {/* School Building background */}
          <rect x="20" y="25" width="200" height="60" rx="4" fill="#334155" />
          <rect x="95" y="45" width="50" height="40" fill="#0284C7" />
          <polygon points="10,25 120,5 230,25" fill="#991B1B" />
          <text x="120" y="20" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">SD NEGERI 2 GIRIMARTO</text>
          {/* Dark Clouds Gathering */}
          <ellipse cx="60" cy="20" rx="35" ry="14" fill="#475569" />
          <ellipse cx="180" cy="20" rx="35" ry="14" fill="#475569" />
          {/* Gutter / Selokan */}
          <rect x="0" y="110" width="240" height="50" fill="#1E293B" />
          <rect x="20" y="115" width="200" height="30" rx="4" fill="#0F172A" stroke="#475569" strokeWidth="2" />
          {/* Clogged trash */}
          <rect x="80" y="122" width="25" height="15" rx="3" fill="#EF4444" />
          <ellipse cx="120" cy="128" rx="14" ry="8" fill="#F59E0B" />
          <ellipse cx="145" cy="126" rx="10" ry="10" fill="#38BDF8" />
          <text x="120" y="140" textAnchor="middle" fill="#F87171" fontSize="9" fontWeight="bold">⚠️ Selokan Tersumbat Sampah Plastik!</text>
        </svg>
      );
    case 'scene_masjid':
      return (
        <svg width={size} height={size * 0.75} viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="240" height="160" rx="12" fill="#064E3B" />
          {/* Mosque Dome */}
          <path d="M120 15 C85 15, 85 55, 85 55 L155 55 C155 55, 155 15, 120 15 Z" fill="#059669" stroke="#F59E0B" strokeWidth="2" />
          <polygon points="120,6 122,12 128,12 123,15 125,20 120,17 115,20 117,15 112,12 118,12" fill="#FBBF24" />
          {/* Wudhu Wall */}
          <rect x="20" y="55" width="200" height="55" fill="#047857" stroke="#065F46" strokeWidth="2" />
          {/* Faucets */}
          <path d="M70 75 L70 88" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" />
          <path d="M120 75 L120 88" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" />
          <path d="M170 75 L170 88" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" />
          {/* Giant splashing wasted water */}
          <path d="M120 88 L120 135" stroke="#38BDF8" strokeWidth="8" strokeLinecap="round" />
          <circle cx="105" cy="115" r="4" fill="#38BDF8" />
          <circle cx="135" cy="118" r="5" fill="#38BDF8" />
          <circle cx="95" cy="130" r="4" fill="#38BDF8" />
          <circle cx="145" cy="128" r="5" fill="#38BDF8" />
          <rect x="30" y="130" width="180" height="24" rx="4" fill="#065F46" />
          <text x="120" y="146" textAnchor="middle" fill="#FEF08A" fontSize="9" fontWeight="bold">Adab Wudu: Dilarang Boros (Mubazir)!</text>
        </svg>
      );
    case 'scene_sungai':
      return (
        <svg width={size} height={size * 0.75} viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="240" height="160" rx="12" fill="#0F172A" />
          {/* Village Bridge */}
          <rect x="10" y="35" width="220" height="22" rx="4" fill="#78350F" stroke="#451A03" strokeWidth="2" />
          {/* Railings */}
          <line x1="30" y1="20" x2="30" y2="35" stroke="#78350F" strokeWidth="3" />
          <line x1="80" y1="20" x2="80" y2="35" stroke="#78350F" strokeWidth="3" />
          <line x1="160" y1="20" x2="160" y2="35" stroke="#78350F" strokeWidth="3" />
          <line x1="210" y1="20" x2="210" y2="35" stroke="#78350F" strokeWidth="3" />
          <line x1="20" y1="22" x2="220" y2="22" stroke="#78350F" strokeWidth="3" />
          {/* River */}
          <rect x="0" y="80" width="240" height="80" fill="#0369A1" />
          <path d="M0 90 Q60 82 120 90 T240 90" stroke="#38BDF8" strokeWidth="3" fill="none" />
          <path d="M0 120 Q60 112 120 120 T240 120" stroke="#38BDF8" strokeWidth="3" fill="none" />
          {/* Falling Trash Bag */}
          <path d="M120 48 C115 52, 110 65, 120 72 C130 72, 128 58, 124 48 Z" fill="#1E293B" stroke="#EF4444" strokeWidth="2" />
          {/* Distressed fish */}
          <path d="M50 110 Q60 105 70 110 Q65 115 50 110 Z" fill="#F59E0B" />
          <text x="120" y="148" textAnchor="middle" fill="#F87171" fontSize="10" fontWeight="bold">Dilarang Buang Sampah ke Sungai!</text>
        </svg>
      );
    case 'scene_taman':
      return (
        <svg width={size} height={size * 0.75} viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="240" height="160" rx="12" fill="#064E3B" />
          {/* City skyline distant */}
          <rect x="30" y="20" width="25" height="40" fill="#065F46" />
          <rect x="65" y="10" width="30" height="50" fill="#047857" />
          <rect x="170" y="15" width="35" height="45" fill="#065F46" />
          {/* Park Grass */}
          <rect x="0" y="60" width="240" height="100" fill="#15803D" />
          {/* Flower beds with vibrant blossoms */}
          <circle cx="50" cy="100" r="14" fill="#EC4899" />
          <circle cx="50" cy="100" r="5" fill="#FDE047" />
          <circle cx="90" cy="115" r="14" fill="#A855F7" />
          <circle cx="90" cy="115" r="5" fill="#FDE047" />
          <circle cx="150" cy="105" r="14" fill="#EF4444" />
          <circle cx="150" cy="105" r="5" fill="#FDE047" />
          <circle cx="190" cy="118" r="14" fill="#F59E0B" />
          <circle cx="190" cy="118" r="5" fill="#FDE047" />
          {/* Stomping footprint distractor icon */}
          <text x="120" y="150" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="bold">Jaga & Lindungi Tanaman Ruang Terbuka Hijau!</text>
        </svg>
      );
    default:
      return null;
  }
};

// MISSION 4: WORD SCRAMBLE ICONS
export const WordScrambleSvg: React.FC<{ wordKey: string; size?: number; className?: string }> = ({ wordKey, size = 100, className = '' }) => {
  switch (wordKey) {
    case 'REDUCE':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="50" cy="50" r="46" fill="#065F46" stroke="#10B981" strokeWidth="2.5" />
          {/* Cloth Totebag */}
          <path d="M30 42 C30 32, 46 32, 46 42" stroke="#FDE047" strokeWidth="3" fill="none" strokeLinecap="round" />
          <rect x="25" y="42" width="26" height="34" rx="3" fill="#059669" stroke="#34D399" strokeWidth="2" />
          <path d="M38 52 L38 64" stroke="#FDE047" strokeWidth="2" />
          {/* Stainless Tumbler */}
          <rect x="60" y="32" width="16" height="44" rx="4" fill="#94A3B8" stroke="#F8FAFC" strokeWidth="2" />
          <rect x="63" y="26" width="10" height="6" rx="2" fill="#0284C7" />
          <circle cx="68" cy="50" r="3" fill="#38BDF8" />
        </svg>
      );
    case 'REUSE':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="50" cy="50" r="46" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="2.5" />
          {/* Upcycled Can as Flower Pot */}
          <rect x="24" y="45" width="24" height="32" rx="3" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
          <path d="M36 45 Q36 30 32 24" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />
          <circle cx="32" cy="22" r="8" fill="#EC4899" />
          <circle cx="32" cy="22" r="3" fill="#FDE047" />
          {/* Upcycled Bottle as Pencil Holder */}
          <rect x="56" y="42" width="22" height="35" rx="3" fill="#0284C7" opacity="0.8" stroke="#38BDF8" strokeWidth="2" />
          <line x1="62" y1="42" x2="58" y2="24" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
          <line x1="68" y1="42" x2="68" y2="20" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
          <line x1="72" y1="42" x2="76" y2="26" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'RECYCLE':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="50" cy="50" r="46" fill="#047857" stroke="#34D399" strokeWidth="2.5" />
          {/* 3 Recycling Arrows in Mobius Loop */}
          <path d="M50 20 L66 48 L34 48 Z" fill="none" stroke="#F8FAFC" strokeWidth="5" strokeLinejoin="round" />
          <polygon points="50,14 56,24 44,24" fill="#34D399" />
          <polygon points="72,48 64,56 64,44" fill="#34D399" />
          <polygon points="28,48 36,44 36,56" fill="#34D399" />
          <circle cx="50" cy="50" r="14" fill="#065F46" />
          <text x="50" y="54" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold">3R</text>
        </svg>
      );
    case 'KOMPOS':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="50" cy="50" r="46" fill="#78350F" stroke="#F59E0B" strokeWidth="2.5" />
          {/* Composter Drum */}
          <ellipse cx="50" cy="30" rx="25" ry="8" fill="#522504" stroke="#92400E" strokeWidth="2" />
          <rect x="25" y="30" width="50" height="42" fill="#713F12" stroke="#92400E" strokeWidth="2" />
          <ellipse cx="50" cy="72" rx="25" ry="8" fill="#522504" stroke="#92400E" strokeWidth="2" />
          {/* Sprouting rich plant */}
          <path d="M50 30 Q50 16 56 12" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />
          <circle cx="58" cy="12" r="5" fill="#4ADE80" />
        </svg>
      );
    case 'HEMAT':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="50" cy="50" r="46" fill="#0F172A" stroke="#FBBF24" strokeWidth="2.5" />
          {/* Electric Plug unplugged */}
          <rect x="24" y="42" width="20" height="20" rx="3" fill="#64748B" />
          <line x1="28" y1="42" x2="28" y2="34" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
          <line x1="40" y1="42" x2="40" y2="34" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
          {/* Water tap shut off */}
          <path d="M68 36 L68 56" stroke="#38BDF8" strokeWidth="6" strokeLinecap="round" />
          <rect x="60" y="32" width="16" height="6" rx="2" fill="#0284C7" />
          {/* Green checkmark */}
          <path d="M42 75 L48 82 L65 65" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
};

// MISSION 5: CLAW MACHINE ITEMS
export const ClawItemSvg: React.FC<{ itemKey: string; size?: number; className?: string }> = ({ itemKey, size = 64, className = '' }) => {
  switch (itemKey) {
    case 'claw_tumbler':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="40" cy="40" r="36" fill="#ECFDF5" />
          <rect x="32" y="22" width="16" height="42" rx="4" fill="#059669" stroke="#047857" strokeWidth="2" />
          <rect x="35" y="16" width="10" height="6" rx="2" fill="#10B981" />
          <text x="40" y="44" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontWeight="bold">REDUCE</text>
        </svg>
      );
    case 'claw_totebag':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="40" cy="40" r="36" fill="#ECFDF5" />
          <path d="M30 32 C30 20, 50 20, 50 32" stroke="#CA8A04" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <rect x="24" y="32" width="32" height="34" rx="4" fill="#FACC15" stroke="#EAB308" strokeWidth="2" />
          <text x="40" y="52" textAnchor="middle" fill="#713F12" fontSize="6.5" fontWeight="bold">Kain</text>
        </svg>
      );
    case 'claw_jam_jar':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="40" cy="40" r="36" fill="#EFF6FF" />
          <rect x="28" y="24" width="24" height="6" rx="2" fill="#E11D48" />
          <rect x="26" y="30" width="28" height="34" rx="5" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" opacity="0.9" />
          <rect x="30" y="40" width="20" height="14" rx="2" fill="#F8FAFC" />
          <text x="40" y="49" textAnchor="middle" fill="#0F172A" fontSize="5" fontWeight="bold">Bumbu</text>
        </svg>
      );
    case 'claw_shoe_box':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="40" cy="40" r="36" fill="#EFF6FF" />
          <rect x="22" y="32" width="36" height="28" rx="3" fill="#D97706" stroke="#92400E" strokeWidth="2" />
          <rect x="20" y="28" width="40" height="8" rx="2" fill="#B45309" stroke="#92400E" strokeWidth="1.5" />
          <line x1="28" y1="28" x2="28" y2="18" stroke="#EF4444" strokeWidth="2.5" />
          <line x1="36" y1="28" x2="36" y2="16" stroke="#3B82F6" strokeWidth="2.5" />
          <line x1="44" y1="28" x2="44" y2="18" stroke="#10B981" strokeWidth="2.5" />
        </svg>
      );
    case 'claw_plastic_bales':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="40" cy="40" r="36" fill="#FEF3C7" />
          <rect x="22" y="26" width="36" height="34" rx="4" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
          <line x1="22" y1="36" x2="58" y2="36" stroke="#0369A1" strokeWidth="2" strokeDasharray="2 2" />
          <line x1="22" y1="46" x2="58" y2="46" stroke="#0369A1" strokeWidth="2" strokeDasharray="2 2" />
          <text x="40" y="44" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="bold">5 Kg PET</text>
          <text x="40" y="54" textAnchor="middle" fill="#FEF08A" fontSize="5.5" fontWeight="bold">Rp15.000</text>
        </svg>
      );
    case 'claw_cardboard_bales':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="40" cy="40" r="36" fill="#FEF3C7" />
          <rect x="22" y="26" width="36" height="34" rx="4" fill="#D97706" stroke="#92400E" strokeWidth="2" />
          <line x1="40" y1="26" x2="40" y2="60" stroke="#78350F" strokeWidth="2.5" />
          <line x1="22" y1="43" x2="58" y2="43" stroke="#78350F" strokeWidth="2.5" />
          <text x="40" y="38" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontWeight="bold">10 Kg Kertas</text>
          <text x="40" y="52" textAnchor="middle" fill="#FEF08A" fontSize="5.5" fontWeight="bold">Rp20.000</text>
        </svg>
      );
    default:
      return null;
  }
};

// MISSION 6: INDONESIAN ARCHIPELAGO SVG MAP
export const ArchipelagoMapSvg: React.FC<{
  activeHotspotId: number | null;
  onSelectHotspot: (id: number) => void;
  className?: string;
}> = ({ activeHotspotId, onSelectHotspot, className = '' }) => {
  const hotspots = [
    { id: 1, name: '1. Padang (Sumbar)', x: 18, y: 44, color: '#EF4444' },
    { id: 2, name: '2. Wonogiri (Jateng)', x: 42, y: 78, color: '#10B981' },
    { id: 3, name: '3. Kalimantan', x: 46, y: 42, color: '#F59E0B' },
    { id: 4, name: '4. Nusa Dua (Bali)', x: 53, y: 82, color: '#06B6D4' },
    { id: 5, name: '5. Parepare (Sulsel)', x: 62, y: 55, color: '#8B5CF6' },
  ];

  return (
    <div className={`relative w-full aspect-[2.1/1] bg-slate-900 rounded-2xl overflow-hidden border border-slate-700/60 shadow-inner ${className}`}>
      <svg viewBox="0 0 1000 480" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Ocean Waves Grid */}
        <defs>
          <pattern id="seaGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="1000" height="480" fill="#0B132B" />
        <rect width="1000" height="480" fill="url(#seaGrid)" />

        {/* SUMATERA */}
        <path
          d="M120,80 L220,180 L280,260 L240,300 L180,220 L100,120 Z"
          fill="#065F46"
          stroke="#10B981"
          strokeWidth="2.5"
          className="hover:fill-emerald-800 transition-colors"
        />
        <text x="180" y="190" fill="#6EE7B7" fontSize="13" fontWeight="bold">SUMATERA</text>

        {/* JAWA */}
        <path
          d="M260,320 L350,330 L450,340 L500,350 L480,370 L340,360 L260,340 Z"
          fill="#065F46"
          stroke="#10B981"
          strokeWidth="2.5"
        />
        <text x="360" y="352" fill="#6EE7B7" fontSize="13" fontWeight="bold">JAWA</text>

        {/* KALIMANTAN */}
        <path
          d="M380,140 L490,130 L520,200 L490,260 L400,250 L370,190 Z"
          fill="#065F46"
          stroke="#10B981"
          strokeWidth="2.5"
        />
        <text x="430" y="195" fill="#6EE7B7" fontSize="14" fontWeight="bold">KALIMANTAN</text>

        {/* BALI & NUSA TENGGARA */}
        <path d="M510,355 L535,355 L530,365 L505,365 Z" fill="#065F46" stroke="#10B981" strokeWidth="1.5" />
        <path d="M545,355 L630,360 L620,370 L540,365 Z" fill="#065F46" stroke="#10B981" strokeWidth="1.5" />
        <text x="540" y="380" fill="#6EE7B7" fontSize="11" fontWeight="bold">BALI & NT</text>

        {/* SULAWESI */}
        <path
          d="M570,160 L610,140 L630,170 L600,210 L640,240 L620,270 L590,230 L570,260 L550,230 L570,190 Z"
          fill="#065F46"
          stroke="#10B981"
          strokeWidth="2.5"
        />
        <text x="610" y="215" fill="#6EE7B7" fontSize="13" fontWeight="bold">SULAWESI</text>

        {/* MALUKU */}
        <path d="M680,180 L720,170 L710,240 L670,220 Z" fill="#065F46" stroke="#10B981" strokeWidth="2" />
        <text x="680" y="210" fill="#6EE7B7" fontSize="11" fontWeight="bold">MALUKU</text>

        {/* PAPUA */}
        <path
          d="M750,180 L880,190 L920,280 L840,300 L790,260 L750,220 Z"
          fill="#065F46"
          stroke="#10B981"
          strokeWidth="2.5"
        />
        <text x="820" y="240" fill="#6EE7B7" fontSize="14" fontWeight="bold">PAPUA</text>

        {/* Title Watermark */}
        <text x="500" y="460" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="600" letterSpacing="2">
          PETA RADAR KRISIS EKOLOGI NUSANTARA — FASE C
        </text>
      </svg>

      {/* Interactive Pulsing Radar Hotspots */}
      {hotspots.map((h) => {
        const isSelected = activeHotspotId === h.id;
        return (
          <button
            key={h.id}
            type="button"
            onClick={() => onSelectHotspot(h.id)}
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-full transition-transform ${
              isSelected ? 'scale-125' : 'hover:scale-115'
            }`}
            title={h.name}
          >
            {/* Pulsing ring */}
            <span
              className="absolute inset-0 rounded-full animate-ping opacity-75"
              style={{ backgroundColor: h.color }}
            />
            {/* Pin core */}
            <span
              className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 text-white text-xs font-bold shadow-lg transition-colors ${
                isSelected ? 'border-white ring-4 ring-white/40' : 'border-slate-900'
              }`}
              style={{ backgroundColor: h.color }}
            >
              {h.id}
            </span>
            {/* Label Tooltip */}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-xs font-bold text-white bg-slate-900/90 border border-slate-700 rounded-md whitespace-nowrap shadow-md pointer-events-none group-hover:opacity-100 transition-opacity">
              {h.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};
