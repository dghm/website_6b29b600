// Brand color data — single source of truth for the guide
const PRIMARY_COLORS = [
  {
    role: 'PRIMARY',
    name: '深海軍藍',
    en: 'Deep Navy',
    hex: '#0D2F6E',
    rgb: '13, 47, 110',
    cmyk: 'C88 M57 Y0 K57',
    pantone: 'PMS 2757 C',
    fg: '#FFFFFF',
    usage: '所有版面的主色調基礎、主標題、深色背景區塊、報告封面',
  },
  {
    role: 'ACCENT',
    name: '暖橘',
    en: 'Warm Orange',
    hex: '#E5622A',
    rgb: '229, 98, 42',
    cmyk: 'C0 M57 Y82 K10',
    pantone: 'PMS 7579 C',
    fg: '#FFFFFF',
    usage: 'CTA 按鈕、數據標籤、重點強調，使用面積不超過版面 15%',
  },
  {
    role: 'BACKGROUND',
    name: '極淡藍灰',
    en: 'Pale Blue-Grey',
    hex: '#F4F7FB',
    rgb: '244, 247, 251',
    cmyk: 'C3 M2 Y0 K2',
    pantone: 'White / PMS 9441 C',
    fg: '#0D2F6E',
    bordered: true,
    usage: '頁面背景、卡片底色、案例區塊、步驟區塊',
  },
];

const EXTENDED_COLORS = [
  {
    name: '海軍藍 Light',
    en: 'Navy Light',
    hex: '#1A4494',
    fg: '#FFFFFF',
    usage: 'Hover / CTA 區塊漸層',
  },
  {
    name: '深橘',
    en: 'Orange Hover',
    hex: '#C04E1E',
    fg: '#FFFFFF',
    usage: '橘色按鈕 Hover 狀態',
  },
  {
    name: '深墨藍',
    en: 'Ink',
    hex: '#1A1E2E',
    fg: '#FFFFFF',
    usage: '主標題、正文深色字',
  },
  {
    name: '石板灰',
    en: 'Slate',
    hex: '#5A6580',
    fg: '#FFFFFF',
    usage: '次要說明文字',
  },
  {
    name: '淡藍',
    en: 'Pale Border',
    hex: '#E8ECF5',
    fg: '#0D2F6E',
    usage: '邊框、分隔線',
  },
];

const COMBOS = [
  {
    bg: '#0D2F6E', fg: '#FFFFFF', accent: '#E5622A',
    tag: '01',
    headline: '先診斷．再設計．\n讓效率說話',
    sub: '深藍底 × 白字 × 橘點綴',
    use: 'Hero CTA、深色區塊、封面',
    showCta: true,
  },
  {
    bg: '#FFFFFF', fg: '#0D2F6E', accent: '#E5622A',
    tag: '02',
    headline: '客製數位系統，\n從理解業務開始',
    sub: '白底 × 深藍字 × 橘 CTA',
    use: '服務卡片、說明段落',
    showCta: true,
    bordered: true,
  },
  {
    bg: '#F4F7FB', fg: '#0D2F6E', accent: '#E5622A',
    tag: '03',
    headline: '透過深入訪談，\n找出真正的痛點',
    sub: '淡藍灰底 × 深藍字',
    use: '案例區塊、步驟區塊',
  },
  {
    bg: '#E5622A', fg: '#FFFFFF', accent: '#FFFFFF',
    tag: '04',
    headline: '+38% 流程效率提升',
    sub: '橘底 × 白字',
    use: '強調標籤、數據重點',
    isStat: true,
  },
];

const RULES_DO = [
  '以深海軍藍為所有版面的主色調基礎',
  '橘色僅用於 CTA 按鈕、數據標籤、重點強調，不超過版面的 15%',
  '白底或淡藍灰底搭配深藍正文，確保可讀性',
  'CTA 按鈕一律使用橘色（#E5622A）+ 白色文字',
  '印刷品使用 CMYK 色值，避免螢幕色偏',
];

const RULES_DONT = [
  '不可在橘色背景上使用深藍文字（對比不足）',
  '不可任意改變色彩飽和度或明度（如使用「亮一點的橘」替代）',
  '不可在同一版面同時大量使用深藍底 + 橘底區塊，視覺會打架',
  '不可以淺灰色（#999）做為主要文字色',
  '不可在白底上使用極淡藍灰（#F4F7FB）作為文字',
];

const PRINT_DIGITAL = [
  { name: '深海軍藍', hex: '#0D2F6E', rgb: '13, 47, 110' },
  { name: '暖橘', hex: '#E5622A', rgb: '229, 98, 42' },
  { name: '海軍藍 Light', hex: '#1A4494', rgb: '26, 68, 148' },
  { name: '深墨藍', hex: '#1A1E2E', rgb: '26, 30, 46' },
  { name: '石板灰', hex: '#5A6580', rgb: '90, 101, 128' },
  { name: '淡藍灰', hex: '#F4F7FB', rgb: '244, 247, 251' },
];

const PRINT_CMYK = [
  { name: '深海軍藍', hex: '#0D2F6E', cmyk: 'C88 M57 Y0 K57', pantone: 'PMS 2757 C' },
  { name: '暖橘', hex: '#E5622A', cmyk: 'C0 M57 Y82 K10', pantone: 'PMS 7579 C' },
  { name: '海軍藍 Light', hex: '#1A4494', cmyk: 'C89 M54 Y0 K42', pantone: 'PMS 286 C' },
  { name: '深墨藍', hex: '#1A1E2E', cmyk: 'C40 M35 Y0 K82', pantone: 'PMS Black 6 C' },
  { name: '石板灰', hex: '#5A6580', cmyk: 'C30 M21 Y0 K50', pantone: 'PMS Cool Gray 9 C' },
  { name: '淡藍灰', hex: '#F4F7FB', cmyk: 'C3 M2 Y0 K2', pantone: 'White / PMS 9441 C' },
];

const MEDIA_USAGE = [
  { media: '名片正面', use: '深海軍藍底 + 白字' },
  { media: '名片背面', use: '白底 + 深藍 / 橘文字' },
  { media: '提案簡報封面', use: '深海軍藍 + 橘色線條' },
  { media: '提案簡報內頁', use: '白底 / 淡藍灰底' },
  { media: '報告封面', use: '深海軍藍全版' },
  { media: '電子郵件 Banner', use: '淡藍灰底 + 深藍標題' },
];

const CONTRAST = [
  { fg: '#0D2F6E', bg: '#FFFFFF', label: '深藍 / 白', ratio: '11.5:1', wcag: 'AAA' },
  { fg: '#FFFFFF', bg: '#E5622A', label: '白 / 橘', ratio: '3.1:1', wcag: 'AA Large' },
  { fg: '#0D2F6E', bg: '#F4F7FB', label: '深藍 / 淡藍灰', ratio: '10.2:1', wcag: 'AAA' },
  { fg: '#E5622A', bg: '#0D2F6E', label: '橘 / 深藍', ratio: '3.8:1', wcag: 'AA' },
  { fg: '#FFFFFF', bg: '#E5622A', label: '白 / 橘底', ratio: '3.1:1', wcag: 'AA Large' },
  { fg: '#5A6580', bg: '#FFFFFF', label: '石板灰 / 白', ratio: '4.7:1', wcag: 'AA' },
];

const NAV = [
  { id: 'hero', num: '00', label: '封面', en: 'Overview' },
  { id: 'primary', num: '01', label: '主要色彩', en: 'Primary Palette' },
  { id: 'extended', num: '02', label: '輔助色彩', en: 'Extended Palette' },
  { id: 'combinations', num: '03', label: '配色組合', en: 'Combinations' },
  { id: 'typography', num: '04', label: '字體與排版', en: 'Typography' },
  { id: 'print', num: '05', label: '印刷與媒材', en: 'Print & Media' },
];

Object.assign(window, {
  PRIMARY_COLORS, EXTENDED_COLORS, COMBOS,
  RULES_DO, RULES_DONT,
  PRINT_DIGITAL, PRINT_CMYK, MEDIA_USAGE, CONTRAST, NAV,
});
