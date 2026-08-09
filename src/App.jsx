import React, { useState, useRef, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  Sprout, Leaf, CloudRain, Camera, MessageCircle, TrendingUp,
  Droplets, Sun, Wind, MapPin, Upload, Mic, Send, ChevronRight,
  AlertTriangle, CheckCircle2, Globe, Home, X
} from "lucide-react";

/* ---------------------------------- i18n ---------------------------------- */

const STRINGS = {
  en: {
    appName: "KrishiMind AI",
    tagline: "Smart advisory for the smallholder farmer",
    nav: { home: "Home", doctor: "Crop Doctor", advisory: "Water & Feed Plan", mandi: "Mandi Prices", assistant: "Ask KrishiMind" },
    greeting: "Namaste, Farmer",
    weatherNote: "Today's field conditions",
    quickStats: "Your farm at a glance",
    activeCrop: "Active crop", nextTask: "Next task", marketTip: "Market tip",
    doctorTitle: "Crop Doctor", doctorSub: "Upload a leaf photo. We check it against known symptoms — right on your phone, no internet needed.",
    uploadCta: "Upload or take a leaf photo", analyzing: "Reading the leaf...",
    resultHealthy: "Leaf looks healthy", resultDeficiency: "Possible nitrogen deficiency", resultBlight: "Possible leaf blight / fungal spotting",
    confidence: "Confidence", whatToDo: "What to do",
    advisoryTitle: "Water & Feed Plan", advisorySub: "Tell us the field conditions, get a schedule tuned to your crop's growth stage.",
    crop: "Crop", soil: "Soil type", stage: "Growth stage", rain: "Days since last rain",
    generate: "Generate plan", irrigation: "Irrigation", fertilizer: "Fertilizer", pest: "Pest watch",
    mandiTitle: "Mandi Prices", mandiSub: "Compare today's price for your crop across nearby markets before you decide where to sell.",
    bestPrice: "Best price nearby", perQuintal: "per quintal", trend: "7-day trend", distance: "away",
    assistantTitle: "Ask KrishiMind", assistantSub: "Type or speak in your language. No smartphone needed — this also works over SMS / IVR call.",
    inputPlaceholder: "Ask about your crop, weather, or scheme...", send: "Send",
    faqChips: ["When should I irrigate wheat?", "Best fertilizer for potato?", "Mustard price in my area?"],
  },
  hi: {
    appName: "कृषिमाइंड AI",
    tagline: "छोटे किसानों के लिए स्मार्ट सलाह",
    nav: { home: "होम", doctor: "फसल डॉक्टर", advisory: "पानी व खाद योजना", mandi: "मंडी भाव", assistant: "कृषिमाइंड से पूछें" },
    greeting: "नमस्ते, किसान भाई",
    weatherNote: "आज के खेत की स्थिति",
    quickStats: "आपके खेत की झलक",
    activeCrop: "मौजूदा फसल", nextTask: "अगला काम", marketTip: "बाज़ार सलाह",
    doctorTitle: "फसल डॉक्टर", doctorSub: "पत्ते की फोटो अपलोड करें। बिना इंटरनेट के, आपके फोन पर ही जांच होगी।",
    uploadCta: "पत्ते की फोटो लें या अपलोड करें", analyzing: "पत्ता जांचा जा रहा है...",
    resultHealthy: "पत्ता स्वस्थ लग रहा है", resultDeficiency: "नाइट्रोजन की कमी हो सकती है", resultBlight: "पत्ती झुलसा / फफूंद संक्रमण हो सकता है",
    confidence: "विश्वसनीयता", whatToDo: "क्या करें",
    advisoryTitle: "पानी व खाद योजना", advisorySub: "खेत की जानकारी दें, फसल की अवस्था अनुसार योजना पाएं।",
    crop: "फसल", soil: "मिट्टी का प्रकार", stage: "फसल की अवस्था", rain: "आखिरी बारिश के बाद दिन",
    generate: "योजना बनाएं", irrigation: "सिंचाई", fertilizer: "खाद", pest: "कीट सतर्कता",
    mandiTitle: "मंडी भाव", mandiSub: "बेचने से पहले नज़दीकी मंडियों के भाव तुलना करें।",
    bestPrice: "सबसे अच्छा भाव", perQuintal: "प्रति क्विंटल", trend: "7-दिन का रुझान", distance: "दूर",
    assistantTitle: "कृषिमाइंड से पूछें", assistantSub: "अपनी भाषा में लिखें या बोलें। SMS/IVR कॉल पर भी काम करता है।",
    inputPlaceholder: "फसल, मौसम या योजना के बारे में पूछें...", send: "भेजें",
    faqChips: ["गेहूं की सिंचाई कब करें?", "आलू के लिए अच्छी खाद?", "मेरे इलाके में सरसों का भाव?"],
  },
  bn: {
    appName: "কৃষিমাইন্ড AI",
    tagline: "প্রান্তিক কৃষকদের জন্য স্মার্ট পরামর্শ",
    nav: { home: "হোম", doctor: "ফসল ডাক্তার", advisory: "জল ও সার পরিকল্পনা", mandi: "মান্ডি দর", assistant: "কৃষিমাইন্ডকে জিজ্ঞাসা করুন" },
    greeting: "নমস্কার, কৃষক ভাই",
    weatherNote: "আজকের মাঠের অবস্থা",
    quickStats: "আপনার খামারের সারসংক্ষেপ",
    activeCrop: "চলতি ফসল", nextTask: "পরবর্তী কাজ", marketTip: "বাজার পরামর্শ",
    doctorTitle: "ফসল ডাক্তার", doctorSub: "পাতার ছবি আপলোড করুন। ইন্টারনেট ছাড়াই আপনার ফোনে পরীক্ষা হবে।",
    uploadCta: "পাতার ছবি তুলুন বা আপলোড করুন", analyzing: "পাতা পরীক্ষা করা হচ্ছে...",
    resultHealthy: "পাতা সুস্থ দেখাচ্ছে", resultDeficiency: "নাইট্রোজেনের ঘাটতি হতে পারে", resultBlight: "পাতা ঝলসানো / ছত্রাক সংক্রমণ হতে পারে",
    confidence: "নির্ভরযোগ্যতা", whatToDo: "কী করবেন",
    advisoryTitle: "জল ও সার পরিকল্পনা", advisorySub: "মাঠের তথ্য দিন, ফসলের পর্যায় অনুযায়ী পরিকল্পনা পান।",
    crop: "ফসল", soil: "মাটির ধরন", stage: "ফসলের পর্যায়", rain: "শেষ বৃষ্টির পর দিন",
    generate: "পরিকল্পনা তৈরি করুন", irrigation: "সেচ", fertilizer: "সার", pest: "পোকা সতর্কতা",
    mandiTitle: "মান্ডি দর", mandiSub: "বিক্রির আগে কাছের মান্ডিগুলোর দর তুলনা করুন।",
    bestPrice: "কাছের সেরা দর", perQuintal: "প্রতি কুইন্টাল", trend: "৭-দিনের প্রবণতা", distance: "দূরে",
    assistantTitle: "কৃষিমাইন্ডকে জিজ্ঞাসা করুন", assistantSub: "নিজের ভাষায় লিখুন বা বলুন। SMS/IVR কলেও কাজ করে।",
    inputPlaceholder: "ফসল, আবহাওয়া বা প্রকল্প নিয়ে জিজ্ঞাসা করুন...", send: "পাঠান",
    faqChips: ["ধানে কখন সেচ দেব?", "আলুর জন্য ভালো সার কী?", "আমার এলাকায় সরিষার দাম কত?"],
  },
};

const LANGS = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हिं" },
  { code: "bn", label: "বাং" },
];

/* -------------------------------- mock data -------------------------------- */

const CROPS = [  "Rice", "Wheat", "Potato",  "Maize",  "Mustard", "Tomato", "Pumpkin",  "Chilli",  "Cucumber",  "Garlic",  "Spinach",];
const SOILS = ["Alluvial", "Loamy", "Clay", "Sandy"];
const STAGES = ["Sowing", "Vegetative", "Flowering", "Grain fill", "Maturity"];

const MANDI_DATA = {
  Rice: [
    { market: "Barasat Mandi", km: 3, price: 2180 },
    { market: "Madhyamgram", km: 7, price: 2140 },
    { market: "Basirhat", km: 18, price: 2260 },
    { market: "Kolkata Wholesale", km: 26, price: 2310 },
    { market: "Howrah Mandi", km: 32, price: 2285 },
    { market: "Behala Market", km: 38, price: 2240 },
    { market: "Haldia Mandi", km: 118, price: 2350 },
    { market: "Purulia Market", km: 285, price: 2210 },
  ],

  Wheat: [
    { market: "Barasat Mandi", km: 3, price: 2410 },
    { market: "Madhyamgram", km: 7, price: 2390 },
    { market: "Basirhat", km: 18, price: 2455 },
    { market: "Kolkata Wholesale", km: 26, price: 2480 },
    { market: "Howrah Mandi", km: 32, price: 2460 },
    { market: "Behala Market", km: 38, price: 2425 },
    { market: "Haldia Mandi", km: 118, price: 2510 },
    { market: "Purulia Market", km: 285, price: 2380 },
  ],

  Potato: [
    { market: "Barasat Mandi", km: 3, price: 1120 },
    { market: "Madhyamgram", km: 7, price: 1085 },
    { market: "Basirhat", km: 18, price: 1210 },
    { market: "Kolkata Wholesale", km: 26, price: 1260 },
    { market: "Howrah Mandi", km: 32, price: 1240 },
    { market: "Behala Market", km: 38, price: 1195 },
    { market: "Haldia Mandi", km: 118, price: 1290 },
    { market: "Purulia Market", km: 285, price: 1160 },
  ],

  Maize: [
    { market: "Barasat Mandi", km: 3, price: 1890 },
    { market: "Madhyamgram", km: 7, price: 1860 },
    { market: "Basirhat", km: 18, price: 1930 },
    { market: "Kolkata Wholesale", km: 26, price: 1975 },
    { market: "Howrah Mandi", km: 32, price: 1950 },
    { market: "Behala Market", km: 38, price: 1915 },
    { market: "Haldia Mandi", km: 118, price: 2000 },
    { market: "Purulia Market", km: 285, price: 1880 },
  ],

  Mustard: [
    { market: "Barasat Mandi", km: 3, price: 5320 },
    { market: "Madhyamgram", km: 7, price: 5260 },
    { market: "Basirhat", km: 18, price: 5410 },
    { market: "Kolkata Wholesale", km: 26, price: 5480 },
    { market: "Howrah Mandi", km: 32, price: 5450 },
    { market: "Behala Market", km: 38, price: 5380 },
    { market: "Haldia Mandi", km: 118, price: 5520 },
    { market: "Purulia Market", km: 285, price: 5300 },
  ],

  Tomato: [
    { market: "Barasat Mandi", km: 3, price: 2850 },
    { market: "Madhyamgram", km: 7, price: 2750 },
    { market: "Basirhat", km: 18, price: 3020 },
    { market: "Kolkata Wholesale", km: 26, price: 3150 },
    { market: "Howrah Mandi", km: 32, price: 3080 },
    { market: "Behala Market", km: 38, price: 2950 },
    { market: "Haldia Mandi", km: 118, price: 3250 },
    { market: "Purulia Market", km: 285, price: 2900 },
  ],

  Pumpkin: [
    { market: "Barasat Mandi", km: 3, price: 1650 },
    { market: "Madhyamgram", km: 7, price: 1580 },
    { market: "Basirhat", km: 18, price: 1720 },
    { market: "Kolkata Wholesale", km: 26, price: 1810 },
    { market: "Howrah Mandi", km: 32, price: 1780 },
    { market: "Behala Market", km: 38, price: 1690 },
    { market: "Haldia Mandi", km: 118, price: 1850 },
    { market: "Purulia Market", km: 285, price: 1620 },
  ],

  Chilli: [
    { market: "Barasat Mandi", km: 3, price: 6200 },
    { market: "Madhyamgram", km: 7, price: 6050 },
    { market: "Basirhat", km: 18, price: 6450 },
    { market: "Kolkata Wholesale", km: 26, price: 6800 },
    { market: "Howrah Mandi", km: 32, price: 6650 },
    { market: "Behala Market", km: 38, price: 6350 },
    { market: "Haldia Mandi", km: 118, price: 7000 },
    { market: "Purulia Market", km: 285, price: 6150 },
  ],

  Cucumber: [
    { market: "Barasat Mandi", km: 3, price: 2200 },
    { market: "Madhyamgram", km: 7, price: 2100 },
    { market: "Basirhat", km: 18, price: 2350 },
    { market: "Kolkata Wholesale", km: 26, price: 2480 },
    { market: "Howrah Mandi", km: 32, price: 2400 },
    { market: "Behala Market", km: 38, price: 2280 },
    { market: "Haldia Mandi", km: 118, price: 2550 },
    { market: "Purulia Market", km: 285, price: 2150 },
  ],

  Garlic: [
    { market: "Barasat Mandi", km: 3, price: 9200 },
    { market: "Madhyamgram", km: 7, price: 8950 },
    { market: "Basirhat", km: 18, price: 9500 },
    { market: "Kolkata Wholesale", km: 26, price: 9900 },
    { market: "Howrah Mandi", km: 32, price: 9700 },
    { market: "Behala Market", km: 38, price: 9400 },
    { market: "Haldia Mandi", km: 118, price: 10100 },
    { market: "Purulia Market", km: 285, price: 9100 },
  ],

  Spinach: [
    { market: "Barasat Mandi", km: 3, price: 1800 },
    { market: "Madhyamgram", km: 7, price: 1720 },
    { market: "Basirhat", km: 18, price: 1950 },
    { market: "Kolkata Wholesale", km: 26, price: 2100 },
    { market: "Howrah Mandi", km: 32, price: 2050 },
    { market: "Behala Market", km: 38, price: 1900 },
    { market: "Haldia Mandi", km: 118, price: 2150 },
    { market: "Purulia Market", km: 285, price: 1780 },
  ],
};

function trendFor(base) {
  const out = [];
  let v = base * 0.94;
  for (let i = 6; i >= 0; i--) {
    v += (Math.random() - 0.4) * base * 0.015;
    out.push({ day: `D-${i}`, price: Math.round(v) });
  }
  out[out.length - 1].price = base;
  return out;
}

/* ------------------------------ recommendation engine ------------------------------ */

function buildPlan(crop, soil, stage, rainDays, t) {
  let irrigationDays;
  if (soil === "Sandy") irrigationDays = 2;
  else if (soil === "Clay") irrigationDays = 6;
  else irrigationDays = 4;
  if (stage === "Flowering" || stage === "Grain fill") irrigationDays = Math.max(2, irrigationDays - 1);
  const overdue = rainDays >= irrigationDays;

  const fertMap = {
    Sowing: "Basal dose: DAP + Urea (starter N-P)",
    Vegetative: "Top-dress Urea for leaf growth (split dose)",
    Flowering: "Potash-heavy mix to support flowering/tuber set",
    "Grain fill": "Reduce N, light Potash top-up only",
    Maturity: "No further fertilizer — prepare for harvest",
  };

  const pestMap = {
  Rice: "Watch for stem borer and leaf folder in humid weeks",
  Wheat: "Watch for aphids and yellow rust in cool, moist spells",
  Potato: "Watch for late blight after rain — check undersides of leaves",
  Maize: "Watch for fall armyworm on young whorls",
  Mustard: "Watch for aphid clusters on tender shoots",

  Tomato: "Watch for fruit borer, whiteflies and early signs of leaf blight",
  Pumpkin: "Watch for fruit fly, powdery mildew and leaf-eating caterpillars",
  Chilli: "Watch for thrips, aphids and leaf curl symptoms",
  Cucumber: "Watch for aphids, whiteflies and powdery mildew",
  Garlic: "Watch for thrips and fungal leaf spot during humid conditions",
  Spinach: "Watch for aphids, leaf miners and fungal leaf spots",
};

  return {
    irrigation: overdue
      ? `Irrigate now — it's been ${rainDays} day(s) since last rain, ${crop} on ${soil.toLowerCase()} soil needs water every ~${irrigationDays} days at ${stage.toLowerCase()} stage.`
      : `Hold off for now — soil moisture should be adequate for ~${irrigationDays - rainDays} more day(s) on ${soil.toLowerCase()} soil.`,
    fertilizer: fertMap[stage],
    pest: pestMap[crop],
  };
}

/* ---------------------------------- app shell ---------------------------------- */

export default function App() {
  const [lang, setLang] = useState("en");
  const [tab, setTab] = useState("home");
  const t = STRINGS[lang];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "var(--cream)", minHeight: "100%", color: "var(--forest)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@500;600&family=Noto+Sans+Bengali:wght@500;600&display=swap');
        :root {
          --forest: #1F3D2B;
          --leaf: #4C7A51;
          --leaf-light: #E7EFE3;
          --soil: #8B5E3C;
          --wheat: #E3A73A;
          --cream: #FAF6EE;
          --sky: #3E7C8A;
          --sky-light: #E2EFF1;
          --danger: #B5502F;
        }
        * { box-sizing: border-box; }
        .display { font-family: 'Space Grotesk', 'Noto Sans Devanagari', 'Noto Sans Bengali', sans-serif; }
        button { cursor: pointer; font-family: inherit; }
        input, select { font-family: inherit; }
      `}</style>

      <TopBar t={t} lang={lang} setLang={setLang} appName={t.appName} tagline={t.tagline} />

      <div style={{ display: "flex", maxWidth: 1180, margin: "0 auto" }}>
        <SideNav t={t} tab={tab} setTab={setTab} />
        <main style={{ flex: 1, padding: "28px 24px 60px", minWidth: 0 }}>
          {tab === "home" && <HomeView t={t} setTab={setTab} lang={lang} />}
          {tab === "doctor" && <DoctorView t={t} />}
          {tab === "advisory" && <AdvisoryView t={t} />}
          {tab === "mandi" && <MandiView t={t} />}
          {tab === "assistant" && <AssistantView t={t} lang={lang} />}
        </main>
      </div>

      <MobileTabBar t={t} tab={tab} setTab={setTab} />
    </div>
  );
}

/* ---------------------------------- top bar ---------------------------------- */

function TopBar({ t, lang, setLang }) {
  return (
    <header style={{
      background: "var(--forest)", color: "#fff", padding: "16px 24px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      position: "sticky", top: 0, zIndex: 20,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, maxWidth: 1180, width: "100%", margin: "0 auto", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, background: "var(--wheat)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Sprout size={22} color="var(--forest)" strokeWidth={2.4} />
          </div>
          <div>
            <div className="display" style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.1 }}>{t.appName}</div>
            <div style={{ fontSize: 11.5, color: "#C9D9C7", lineHeight: 1.2 }}>{t.tagline}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.08)", padding: 4, borderRadius: 999 }}>
          <Globe size={14} style={{ marginLeft: 8, color: "#C9D9C7" }} />
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              style={{
                border: "none", padding: "6px 12px", borderRadius: 999, fontSize: 12.5, fontWeight: 600,
                background: lang === l.code ? "var(--wheat)" : "transparent",
                color: lang === l.code ? "var(--forest)" : "#E7EFE3",
                transition: "all .15s",
              }}
            >{l.label}</button>
          ))}
        </div>
      </div>
    </header>
  );
}

/* ---------------------------------- side nav ---------------------------------- */

function NAV_ITEMS(t) {
  return [
    { key: "home", label: t.nav.home, icon: Home },
    { key: "doctor", label: t.nav.doctor, icon: Leaf },
    { key: "advisory", label: t.nav.advisory, icon: Droplets },
    { key: "mandi", label: t.nav.mandi, icon: TrendingUp },
    { key: "assistant", label: t.nav.assistant, icon: MessageCircle },
  ];
}

function SideNav({ t, tab, setTab }) {
  const items = NAV_ITEMS(t);
  return (
    <nav style={{
      width: 208, flexShrink: 0, padding: "28px 12px", display: "none",
    }} className="side-nav-desktop">
      {items.map((it) => {
        const Icon = it.icon;
        const active = tab === it.key;
        return (
          <button
            key={it.key}
            onClick={() => setTab(it.key)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "11px 14px", borderRadius: 10, border: "none", marginBottom: 4,
              background: active ? "var(--leaf-light)" : "transparent",
              color: active ? "var(--forest)" : "#5B6B5D",
              fontWeight: active ? 700 : 500, fontSize: 14, textAlign: "left",
            }}
          >
            <Icon size={17} strokeWidth={2.2} />
            {it.label}
          </button>
        );
      })}
      <style>{`@media (min-width: 860px) { .side-nav-desktop { display: block !important; } }`}</style>
    </nav>
  );
}

function MobileTabBar({ t, tab, setTab }) {
  const items = NAV_ITEMS(t);
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff",
      borderTop: "1px solid #E6E1D3", display: "flex", justifyContent: "space-around",
      padding: "6px 2px", zIndex: 30,
    }} className="mobile-tabbar">
      {items.map((it) => {
        const Icon = it.icon;
        const active = tab === it.key;
        return (
          <button
            key={it.key}
            onClick={() => setTab(it.key)}
            style={{
              border: "none", background: "transparent", display: "flex", flexDirection: "column",
              alignItems: "center", gap: 2, padding: "6px 4px", color: active ? "var(--forest)" : "#9AA69B",
              fontSize: 10, fontWeight: 600, flex: 1,
            }}
          >
            <Icon size={18} strokeWidth={active ? 2.6 : 2} />
            {it.label}
          </button>
        );
      })}
      <style>{`@media (min-width: 860px) { .mobile-tabbar { display: none !important; } }`}</style>
    </div>
  );
}

/* ---------------------------------- card shell ---------------------------------- */

function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 className="display" style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "var(--forest)" }}>{title}</h2>
      {sub && <p style={{ color: "#5B6B5D", fontSize: 14.5, marginTop: 6, maxWidth: 560, lineHeight: 1.5 }}>{sub}</p>}
    </div>
  );
}

/* ---------------------------------- home ---------------------------------- */

function HomeView({ t, setTab, lang }) {
  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{
        background: "linear-gradient(135deg, var(--forest), #2C5238)", borderRadius: 18, padding: "26px 24px",
        color: "#fff", marginBottom: 22, position: "relative", overflow: "hidden",
      }}>
        <Sun size={90} style={{ position: "absolute", right: -10, top: -20, color: "rgba(227,167,58,0.25)" }} />
        <div style={{ fontSize: 13, color: "#C9D9C7", fontWeight: 600, letterSpacing: 0.4 }}>{t.weatherNote}</div>
        <h1 className="display" style={{ fontSize: 26, margin: "6px 0 14px" }}>{t.greeting}</h1>
        <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
          <WeatherStat icon={Sun} label="32°C" sub="Clear" />
          <WeatherStat icon={Droplets} label="64%" sub="Humidity" />
          <WeatherStat icon={Wind} label="11 km/h" sub="Wind" />
          <WeatherStat icon={CloudRain} label="Low" sub="Rain (48h)" />
        </div>
      </div>

      <SectionHeader title={t.quickStats} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 30 }}>
        <StatCard icon={Sprout} label={t.activeCrop} value="Potato — Flowering" color="var(--leaf)" />
        <StatCard icon={Droplets} label={t.nextTask} value="Irrigate in 2 days" color="var(--sky)" />
        <StatCard icon={TrendingUp} label={t.marketTip} value="Kolkata Wholesale +₹140/qtl" color="var(--wheat)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
        <NavTile icon={Leaf} title={t.doctorTitle} desc={t.doctorSub} onClick={() => setTab("doctor")} />
        <NavTile icon={Droplets} title={t.advisoryTitle} desc={t.advisorySub} onClick={() => setTab("advisory")} />
        <NavTile icon={TrendingUp} title={t.mandiTitle} desc={t.mandiSub} onClick={() => setTab("mandi")} />
        <NavTile icon={MessageCircle} title={t.assistantTitle} desc={t.assistantSub} onClick={() => setTab("assistant")} />
      </div>
    </div>
  );
}

function WeatherStat({ icon: Icon, label, sub }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Icon size={20} color="var(--wheat)" />
      <div>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{label}</div>
        <div style={{ fontSize: 11, color: "#C9D9C7" }}>{sub}</div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", border: "1px solid #ECE7D8" }}>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
        <Icon size={17} color={color} />
      </div>
      <div style={{ fontSize: 12, color: "#8A9389", fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2, color: "var(--forest)" }}>{value}</div>
    </div>
  );
}

function NavTile({ icon: Icon, title, desc, onClick }) {
  return (
    <button onClick={onClick} style={{
      textAlign: "left", background: "#fff", border: "1px solid #ECE7D8", borderRadius: 14,
      padding: "18px 18px", display: "flex", flexDirection: "column", gap: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--leaf-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={18} color="var(--leaf)" />
        </div>
        <ChevronRight size={16} color="#9AA69B" />
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 15, color: "var(--forest)" }}>{title}</div>
        <div style={{ fontSize: 12.5, color: "#8A9389", marginTop: 3, lineHeight: 1.4 }}>{desc}</div>
      </div>
    </button>
  );
}

/* ---------------------------------- crop doctor ---------------------------------- */

function DoctorView({ t }) {
  const [status, setStatus] = useState("idle"); // idle | analyzing | done
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);
  const canvasRef = useRef(null);

  const analyzeImage = useCallback((dataUrl) => {
  const img = new Image();

  img.onload = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const w = (canvas.width = 120);
    const h = (canvas.height = 120);

    ctx.drawImage(img, 0, 0, w, h);

    const data = ctx.getImageData(0, 0, w, h).data;

    let totalPixels = 0;
    let greenPixels = 0;
    let yellowPixels = 0;
    let brownPixels = 0;
    let darkPixels = 0;
    let palePixels = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Ignore white background
      if (r > 245 && g > 245 && b > 245) continue;

      totalPixels++;

      // Healthy green areas
      if (g > r * 1.12 && g > b * 1.08 && g > 55) {
        greenPixels++;
      }

      // Yellow / chlorosis
      if (
        r > 110 &&
        g > 95 &&
        b < g * 0.8 &&
        Math.abs(r - g) < 80
      ) {
        yellowPixels++;
      }

      // Brown / damaged tissue
      if (
        r > 45 &&
        r < 190 &&
        g < r * 0.95 &&
        b < g * 0.9
      ) {
        brownPixels++;
      }

      // Dark spots / lesions
      if (r < 95 && g < 100 && b < 85) {
        darkPixels++;
      }

      // Pale areas
      if (
        r > 130 &&
        g > 130 &&
        b > 80 &&
        Math.abs(r - g) < 45
      ) {
        palePixels++;
      }
    }

    if (totalPixels === 0) {
      setResult({
        key: "uncertain",
        conf: 55,
        severity: "Low",
      });
      setStatus("done");
      return;
    }

    const greenPct = (greenPixels / totalPixels) * 100;
    const yellowPct = (yellowPixels / totalPixels) * 100;
    const brownPct = (brownPixels / totalPixels) * 100;
    const darkPct = (darkPixels / totalPixels) * 100;
    const palePct = (palePixels / totalPixels) * 100;

    let key;
    let conf;
    let severity;

    if (darkPct > 12 || brownPct > 18) {
      key = "blight";

      const damage = darkPct + brownPct;

      conf = Math.min(
        96,
        Math.round(68 + damage * 0.8)
      );

      severity =
        damage > 45
          ? "High"
          : damage > 28
          ? "Moderate"
          : "Low";

    } else if (yellowPct > 18 || palePct > 28) {
      key = "deficiency";

      const deficiencyScore =
        yellowPct + palePct * 0.6;

      conf = Math.min(
        94,
        Math.round(64 + deficiencyScore * 0.7)
      );

      severity =
        deficiencyScore > 45
          ? "Moderate"
          : "Low";

    } else if (
      greenPct > 45 &&
      brownPct < 10 &&
      darkPct < 8
    ) {
      key = "healthy";

      conf = Math.min(
        97,
        Math.round(72 + greenPct * 0.35)
      );

      severity = "None";

    } else {
      key = "uncertain";

      conf = Math.round(
        Math.min(
          82,
          Math.max(
            58,
            60 +
              Math.abs(greenPct - yellowPct) * 0.3 +
              Math.random() * 8
          )
        )
      );

      severity = "Needs inspection";
    }

    setResult({
      key,
      conf,
      severity,
      stats: {
        green: Math.round(greenPct),
        yellow: Math.round(yellowPct),
        brown: Math.round(brownPct),
        dark: Math.round(darkPct),
      },
    });

    setStatus("done");
  };

  img.src = dataUrl;
}, []);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      setStatus("analyzing");
      setResult(null);
      setTimeout(() => analyzeImage(reader.result), 900);
    };
    reader.readAsDataURL(file);
  };

  const ADVICE = {
  healthy: {
    label: t.resultHealthy,
    color: "var(--leaf)",
    icon: CheckCircle2,

    summary:
      "The uploaded leaf is predominantly green with no strong visual signs of widespread spotting, yellowing, or tissue damage.",

    likelyCause:
      "No major visible disease pattern was detected in this image.",

    tips: [
      "Continue the current irrigation schedule and avoid prolonged waterlogging around the root zone.",
      "Inspect the lower and inner leaves every 5–7 days, as many fungal infections first appear in humid, poorly ventilated areas.",
      "Remove any fallen or decaying plant material from around the crop to reduce disease risk.",
      "Monitor the crop after heavy rainfall or periods of high humidity."
    ],
  },

  deficiency: {
    label: t.resultDeficiency,
    color: "var(--wheat)",
    icon: AlertTriangle,

    summary:
      "The image shows noticeable pale or yellow-toned areas that may indicate nutrient stress, chlorosis, or early-stage deficiency.",

    likelyCause:
      "Possible nitrogen or micronutrient deficiency. Similar symptoms can also occur due to poor drainage, root stress, or excessive watering.",

    tips: [
      "Check whether the yellowing starts on older leaves or younger leaves, as this can help identify the likely nutrient deficiency.",
      "Avoid applying a large amount of fertilizer at once; use the recommended crop-specific dose in split applications.",
      "Check soil moisture before irrigating, because overwatering can reduce nutrient uptake by the roots.",
      "If symptoms spread quickly, inspect the roots and nearby leaves for disease or pest damage.",
      "Consider a soil test before repeatedly applying nitrogen-based fertilizer."
    ],
  },

  blight: {
    label: t.resultBlight,
    color: "var(--danger)",
    icon: AlertTriangle,

    summary:
      "The image contains dark or brown discoloured areas that may be consistent with leaf spotting, necrosis, or a possible fungal or bacterial infection.",

    likelyCause:
      "The visible brown and dark patches suggest damaged leaf tissue. Humid conditions, prolonged leaf wetness, and infected crop residue can increase the risk of disease spread.",

    tips: [
      "Inspect nearby leaves immediately to check whether similar spots are spreading through the plant.",
      "Remove severely affected leaves and dispose of them away from the field; do not leave infected material beside healthy plants.",
      "Avoid overhead irrigation late in the day, as wet leaves overnight can encourage fungal growth.",
      "Improve spacing and airflow between plants wherever possible.",
      "Use only a crop-appropriate and locally recommended fungicide or treatment after confirming the disease, following the product label and local agricultural guidance.",
      "If the spots expand rapidly or appear on multiple plants, consult a local agricultural extension officer for confirmation."
    ],
  },

  uncertain: {
    label: "Unable to confidently identify the leaf condition",
    color: "var(--sky)",
    icon: AlertTriangle,

    summary:
      "The visual pattern in this image does not clearly match one of the demo detection categories.",

    likelyCause:
      "The image may contain shadows, complex background colours, multiple symptoms, or the affected area may not be clearly visible.",

    tips: [
      "Take another photo in natural daylight.",
      "Place the leaf against a plain background before taking the picture.",
      "Capture both the front and underside of the affected leaf.",
      "Make sure the damaged or discoloured area is clearly visible and in focus.",
      "Upload a close-up image if the symptoms appear only as small spots."
    ],
  },
};

  return (
    <div>
      <SectionHeader title={t.doctorTitle} sub={t.doctorSub} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(240px, 340px) 1fr", gap: 22, alignItems: "start" }}>
        <div>
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              border: "2px dashed #C9D2C4", borderRadius: 16, aspectRatio: "1", background: "#fff",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 10, cursor: "pointer", overflow: "hidden", position: "relative",
            }}
          >
            {preview ? (
              <img src={preview} alt="leaf" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <>
                <Camera size={34} color="var(--leaf)" />
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--forest)", padding: "0 24px", textAlign: "center" }}>{t.uploadCta}</div>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: "none" }} />
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              marginTop: 12, width: "100%", background: "var(--forest)", color: "#fff", border: "none",
              borderRadius: 10, padding: "11px 0", fontWeight: 700, fontSize: 13.5, display: "flex",
              alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <Upload size={15} /> {t.uploadCta}
          </button>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #ECE7D8", padding: 22, minHeight: 260 }}>
          {status === "idle" && (
            <div style={{ color: "#9AA69B", fontSize: 14, textAlign: "center", paddingTop: 60 }}>
              <Leaf size={30} style={{ marginBottom: 10, opacity: 0.5 }} />
              <div>{t.doctorSub}</div>
            </div>
          )}
          {status === "analyzing" && (
            <div style={{ color: "var(--leaf)", fontSize: 14, textAlign: "center", paddingTop: 60, fontWeight: 600 }}>
              <div className="spin" style={{
                width: 26, height: 26, border: "3px solid #DCE8DB", borderTopColor: "var(--leaf)",
                borderRadius: "50%", margin: "0 auto 12px", animation: "spin 0.8s linear infinite",
              }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              {t.analyzing}
            </div>
          )}
          {status === "done" && result && (() => {
            const a = ADVICE[result.key];
            const Icon = a.icon;
            return (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: a.color + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={22} color={a.color} />
                  </div>
                  <div style={{ flex: 1 }}>
  {/* Disease / condition name */}
  <div
    style={{
      fontWeight: 700,
      fontSize: 17,
      color: "var(--forest)",
      marginBottom: 4,
    }}
  >
    {a.label}
  </div>

  {/* Confidence percentage */}
  <div
    style={{
      fontSize: 12.5,
      color: "#8A9389",
      marginBottom: 8,
    }}
  >
    {t.confidence}: {result.conf}%
  </div>

  {/* Confidence bar */}
  <div
    style={{
      height: 7,
      background: "#EEE9DA",
      borderRadius: 999,
      overflow: "hidden",
      marginBottom: 10,
    }}
  >
    <div
      style={{
        height: "100%",
        width: `${result.conf}%`,
        background: a.color,
        borderRadius: 999,
        transition: "width 0.5s ease",
      }}
    />
  </div>

  {/* Severity badge */}
  <span
    style={{
      display: "inline-block",
      fontSize: 11,
      fontWeight: 700,
      padding: "4px 9px",
      borderRadius: 999,
      background: a.color + "22",
      color: a.color,
    }}
  >
    Severity: {result.severity}
  </span>
</div>

                </div>
                <div style={{ height: 6, background: "#EEE9DA", borderRadius: 4, marginBottom: 18, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${result.conf}%`, background: a.color, borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#5B6B5D", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>{t.whatToDo}</div>
                <ul style={{ margin: 0, paddingLeft: 18, color: "var(--forest)", fontSize: 14, lineHeight: 1.9 }}>
                  {a.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                </ul>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- advisory ---------------------------------- */

function AdvisoryView({ t }) {
  const [crop, setCrop] = useState(CROPS[2]);
  const [soil, setSoil] = useState(SOILS[0]);
  const [stage, setStage] = useState(STAGES[2]);
  const [rainDays, setRainDays] = useState(3);
  const [plan, setPlan] = useState(null);

  const onGenerate = () => setPlan(buildPlan(crop, soil, stage, rainDays, t));

  const Field = ({ label, children }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#5B6B5D", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
  const selStyle = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #DCD5C2", fontSize: 14, background: "#fff", color: "var(--forest)" };

  return (
    <div>
      <SectionHeader title={t.advisoryTitle} sub={t.advisorySub} />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(240px,320px) 1fr", gap: 22, alignItems: "start" }}>
        <div style={{ background: "#fff", border: "1px solid #ECE7D8", borderRadius: 16, padding: 20 }}>
          <Field label={t.crop}>
            <select style={selStyle} value={crop} onChange={(e) => setCrop(e.target.value)}>
              {CROPS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label={t.soil}>
            <select style={selStyle} value={soil} onChange={(e) => setSoil(e.target.value)}>
              {SOILS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label={t.stage}>
            <select style={selStyle} value={stage} onChange={(e) => setStage(e.target.value)}>
              {STAGES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label={`${t.rain}: ${rainDays}`}>
            <input type="range" min="0" max="10" value={rainDays} onChange={(e) => setRainDays(Number(e.target.value))} style={{ width: "100%" }} />
          </Field>
          <button onClick={onGenerate} style={{
            width: "100%", background: "var(--leaf)", color: "#fff", border: "none", borderRadius: 10,
            padding: "12px 0", fontWeight: 700, fontSize: 14, marginTop: 6,
          }}>{t.generate}</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {!plan && (
            <div style={{ background: "#fff", border: "1px solid #ECE7D8", borderRadius: 16, padding: 40, textAlign: "center", color: "#9AA69B" }}>
              <Droplets size={28} style={{ marginBottom: 10, opacity: 0.5 }} />
              <div style={{ fontSize: 14 }}>{t.advisorySub}</div>
            </div>
          )}
          {plan && (
            <>
              <PlanCard icon={Droplets} color="var(--sky)" title={t.irrigation} body={plan.irrigation} />
              <PlanCard icon={Sprout} color="var(--wheat)" title={t.fertilizer} body={plan.fertilizer} />
              <PlanCard icon={AlertTriangle} color="var(--danger)" title={t.pest} body={plan.pest} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PlanCard({ icon: Icon, color, title, body }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #ECE7D8", borderRadius: 14, padding: 18, display: "flex", gap: 14 }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={18} color={color} />
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14.5, color: "var(--forest)", marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 13.5, color: "#5B6B5D", lineHeight: 1.6 }}>{body}</div>
      </div>
    </div>
  );
}

/* ---------------------------------- mandi ---------------------------------- */

function MandiView({ t }) {
  const [crop, setCrop] = useState(CROPS[0]);
  const rows = MANDI_DATA[crop];
  const best = rows.reduce((a, b) => (b.price > a.price ? b : a));
  const trend = trendFor(best.price);

  return (
    <div>
      <SectionHeader title={t.mandiTitle} sub={t.mandiSub} />
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {CROPS.map((c) => (
          <button key={c} onClick={() => setCrop(c)} style={{
            padding: "8px 16px", borderRadius: 999, border: "1px solid " + (crop === c ? "var(--forest)" : "#DCD5C2"),
            background: crop === c ? "var(--forest)" : "#fff", color: crop === c ? "#fff" : "var(--forest)",
            fontWeight: 600, fontSize: 13,
          }}>{c}</button>
        ))}
      </div>

      <div style={{
        background: "linear-gradient(135deg, var(--wheat), #D68F2A)", borderRadius: 16, padding: 20, marginBottom: 20,
        color: "#3A2A0E", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, opacity: 0.8 }}>{t.bestPrice}</div>
          <div className="display" style={{ fontSize: 26, fontWeight: 700 }}>₹{best.price} <span style={{ fontSize: 14, fontWeight: 600 }}>{t.perQuintal}</span></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 13.5 }}>
          <MapPin size={16} /> {best.market} · {best.km} km {t.distance}
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #ECE7D8", borderRadius: 16, padding: "18px 18px 8px", marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#5B6B5D", marginBottom: 10 }}>{t.trend} — {crop}</div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={trend} margin={{ left: -20, right: 10 }}>
            <CartesianGrid stroke="#F0ECDF" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9AA69B" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9AA69B" }} axisLine={false} tickLine={false} domain={["dataMin - 50", "dataMax + 50"]} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #ECE7D8", fontSize: 12 }} />
            <Line type="monotone" dataKey="price" stroke="#4C7A51" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: "#fff", border: "1px solid #ECE7D8", borderRadius: 16, overflow: "hidden" }}>
        {rows.sort((a, b) => b.price - a.price).map((r, i) => (
          <div key={r.market} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px",
            borderBottom: i < rows.length - 1 ? "1px solid #F0ECDF" : "none",
            background: r.market === best.market ? "var(--leaf-light)" : "transparent",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <MapPin size={15} color="#8A9389" />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "var(--forest)" }}>{r.market}</div>
                <div style={{ fontSize: 11.5, color: "#9AA69B" }}>{r.km} km {t.distance}</div>
              </div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "var(--forest)" }}>₹{r.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------- assistant ---------------------------------- */

const CROP_PROFILES = {
  rice: {
    names: ["rice", "paddy", "धान", "चावल", "ধান"],
    label: { en: "Rice", hi: "धान", bn: "ধান" },
    irrigation: {
      en: "Keep the field evenly moist, especially during active growth. Avoid letting the soil stay continuously flooded unless the crop stage and local practice call for it.",
      hi: "सक्रिय बढ़वार के दौरान खेत में पर्याप्त नमी रखें। लगातार पानी भरा रखने से बचें, जब तक फसल की अवस्था और स्थानीय पद्धति इसकी मांग न करे।",
      bn: "সক্রিয় বৃদ্ধির সময় জমিতে পর্যাপ্ত আর্দ্রতা রাখুন। ফসলের পর্যায় ও স্থানীয় পদ্ধতি অনুযায়ী প্রয়োজন না হলে সবসময় জল জমিয়ে রাখবেন না।",
    },
    fertilizer: {
      en: "Rice generally benefits from split nitrogen applications rather than applying all nitrogen at once. Potassium and phosphorus should be guided by soil condition and the crop stage.",
      hi: "धान में पूरी नाइट्रोजन एक साथ देने के बजाय विभाजित मात्रा में देना बेहतर रहता है। पोटाश और फॉस्फोरस की मात्रा मिट्टी और फसल की अवस्था के अनुसार तय करें।",
      bn: "ধানের ক্ষেত্রে একবারে সব নাইট্রোজেন না দিয়ে ভাগ করে প্রয়োগ করা ভালো। পটাশ ও ফসফরাসের পরিমাণ মাটির অবস্থা ও ফসলের পর্যায় অনুযায়ী ঠিক করুন।",
    },
    pest: {
      en: "Watch for stem borer, leaf folder and planthoppers. Check the crop regularly instead of waiting until damage becomes widespread.",
      hi: "तना छेदक, लीफ फोल्डर और प्लांटहॉपर पर नजर रखें। नुकसान फैलने के बाद नहीं, नियमित रूप से खेत की जांच करें।",
      bn: "স্টেম বোরার, লিফ ফোল্ডার ও প্ল্যান্টহপার নজরে রাখুন। ক্ষতি ছড়িয়ে পড়ার আগে নিয়মিত জমি পরীক্ষা করুন।",
    },
    disease: {
      en: "During humid or wet periods, inspect leaves and stems for unusual spots, discoloration and lesions. Good field drainage and regular scouting are important.",
      hi: "नमी या बारिश वाले समय में पत्तियों और तनों पर असामान्य धब्बे और घाव देखें। अच्छी जल निकासी और नियमित निगरानी जरूरी है।",
      bn: "আর্দ্র বা বৃষ্টির সময় পাতায় ও কাণ্ডে অস্বাভাবিক দাগ ও ক্ষত দেখুন। ভালো জল নিষ্কাশন ও নিয়মিত পর্যবেক্ষণ গুরুত্বপূর্ণ।",
    },
  },

  wheat: {
    names: ["wheat", "गेहूं", "गेहूँ", "গম"],
    label: { en: "Wheat", hi: "गेहूं", bn: "গম" },
    irrigation: {
      en: "Do not irrigate simply by calendar date. Check soil moisture and pay particular attention around important growth stages such as crown-root development and grain filling.",
      hi: "सिर्फ कैलेंडर देखकर सिंचाई न करें। मिट्टी की नमी जांचें और महत्वपूर्ण अवस्थाओं, जैसे जड़ विकास और दाना भरने, पर विशेष ध्यान दें।",
      bn: "শুধু ক্যালেন্ডার দেখে সেচ দেবেন না। মাটির আর্দ্রতা দেখুন এবং শিকড়ের বৃদ্ধি ও দানা ভরার মতো গুরুত্বপূর্ণ পর্যায়ে বিশেষ নজর দিন।",
    },
    fertilizer: {
      en: "Nitrogen is usually most useful when supplied in split applications. Avoid excessive nitrogen late in the season because it can encourage weak growth.",
      hi: "नाइट्रोजन को विभाजित मात्रा में देना अधिक उपयोगी रहता है। मौसम के अंत में बहुत अधिक नाइट्रोजन देने से बचें।",
      bn: "নাইট্রোজেন ভাগ করে প্রয়োগ করা সাধারণত বেশি কার্যকর। মরসুমের শেষ দিকে অতিরিক্ত নাইট্রোজেন দেওয়া এড়িয়ে চলুন।",
    },
    pest: {
      en: "Watch for aphids and other sucking pests, especially when the weather is cool and dry. Check the undersides of leaves and tender growth.",
      hi: "एफिड जैसे रस चूसने वाले कीटों पर नजर रखें, खासकर ठंडे और सूखे मौसम में। पत्तियों की निचली सतह और नई बढ़वार देखें।",
      bn: "এফিডসহ রস চোষা পোকা নজরে রাখুন, বিশেষ করে ঠান্ডা ও শুষ্ক আবহাওয়ায়। পাতার নিচের দিক ও নতুন বৃদ্ধি পরীক্ষা করুন।",
    },
    disease: {
      en: "Yellow or orange rust-like markings on leaves deserve attention. Inspect several plants across the field before deciding on treatment.",
      hi: "पत्तियों पर पीले या नारंगी रंग के रस्ट जैसे निशान दिखें तो ध्यान दें। उपचार तय करने से पहले खेत के कई पौधों की जांच करें।",
      bn: "পাতায় হলুদ বা কমলা রঙের মরিচার মতো দাগ দেখা গেলে গুরুত্ব দিন। চিকিৎসার আগে জমির বিভিন্ন অংশের গাছ পরীক্ষা করুন।",
    },
  },

  potato: {
    names: ["potato", "आलू", "আলু"],
    label: { en: "Potato", hi: "आलू", bn: "আলু" },
    irrigation: {
      en: "Keep soil moisture reasonably steady, especially during tuber formation. Avoid both severe drying and prolonged waterlogging.",
      hi: "खासकर कंद बनने के समय मिट्टी की नमी स्थिर रखें। बहुत ज्यादा सूखने और लंबे समय तक जलभराव दोनों से बचें।",
      bn: "বিশেষ করে কন্দ গঠনের সময় মাটির আর্দ্রতা স্থির রাখুন। অতিরিক্ত শুকিয়ে যাওয়া ও দীর্ঘ জলাবদ্ধতা দুটোই এড়ান।",
    },
    fertilizer: {
      en: "Potato needs balanced nutrition, with potassium becoming particularly important around tuber development. Avoid blindly adding large amounts of nitrogen.",
      hi: "आलू को संतुलित पोषण चाहिए और कंद विकास के समय पोटाश महत्वपूर्ण होता है। बिना जरूरत बहुत ज्यादा नाइट्रोजन न दें।",
      bn: "আলুর জন্য সুষম পুষ্টি দরকার এবং কন্দ গঠনের সময় পটাশ গুরুত্বপূর্ণ। প্রয়োজন ছাড়া অতিরিক্ত নাইট্রোজেন দেবেন না।",
    },
    pest: {
      en: "Check for aphids, cutworms and other chewing or sucking pests. Look closely at young leaves and the base of the plants.",
      hi: "एफिड, कटवर्म और अन्य कीटों पर नजर रखें। नई पत्तियों और पौधे के आधार को ध्यान से देखें।",
      bn: "এফিড, কাটওয়ার্ম ও অন্যান্য পোকা নজরে রাখুন। নতুন পাতা ও গাছের গোড়া ভালো করে দেখুন।",
    },
    disease: {
      en: "After cool, wet or humid weather, inspect leaves for dark spots and rapidly spreading lesions that may indicate blight.",
      hi: "ठंडे, गीले या बहुत नम मौसम के बाद पत्तियों पर काले धब्बे और तेजी से फैलते घाव देखें, जो झुलसा रोग का संकेत हो सकते हैं।",
      bn: "ঠান্ডা, ভেজা বা আর্দ্র আবহাওয়ার পর পাতায় কালো দাগ ও দ্রুত ছড়ানো ক্ষত দেখুন, যা ব্লাইটের লক্ষণ হতে পারে।",
    },
  },

  maize: {
    names: ["maize", "corn", "मक्का", "मकई", "ভুট্টা"],
    label: { en: "Maize", hi: "मक्का", bn: "ভুট্টা" },
    irrigation: {
      en: "Avoid moisture stress during rapid vegetative growth, tasseling and grain formation. Water according to soil moisture rather than using a fixed schedule.",
      hi: "तेजी से बढ़वार, टसलिंग और दाना बनने के समय पानी की कमी न होने दें। निश्चित समय-सारणी के बजाय मिट्टी की नमी देखकर सिंचाई करें।",
      bn: "দ্রুত বৃদ্ধি, ট্যাসেলিং ও দানা গঠনের সময় জলের ঘাটতি হতে দেবেন না। নির্দিষ্ট সময়ের বদলে মাটির আর্দ্রতা দেখে সেচ দিন।",
    },
    fertilizer: {
      en: "Maize generally responds well to split nitrogen feeding. Potassium and phosphorus should be adjusted according to soil fertility and crop stage.",
      hi: "मक्का में नाइट्रोजन को विभाजित मात्रा में देना उपयोगी रहता है। पोटाश और फॉस्फोरस मिट्टी की उर्वरता और फसल की अवस्था के अनुसार रखें।",
      bn: "ভুট্টায় নাইট্রোজেন ভাগ করে প্রয়োগ করা উপকারী। পটাশ ও ফসফরাস মাটির উর্বরতা ও ফসলের পর্যায় অনুযায়ী দিন।",
    },
    pest: {
      en: "Inspect young whorls for fall armyworm damage. Look for feeding holes, frass and damaged central leaves.",
      hi: "नई पत्तियों के बीच फॉल आर्मीवर्म के लक्षण देखें। छेद, कीट का मल और बीच की पत्तियों का नुकसान जांचें।",
      bn: "নতুন পাতার কুঁড়িতে ফল আর্মিওয়ার্মের ক্ষতি দেখুন। ছিদ্র, পোকার মল ও মাঝের পাতার ক্ষতি পরীক্ষা করুন।",
    },
    disease: {
      en: "Look for leaf spots and unusual discoloration, particularly after prolonged humidity. Check several plants rather than relying on one leaf.",
      hi: "लंबे समय तक नमी रहने के बाद पत्तियों पर धब्बे और असामान्य रंग देखें। केवल एक पत्ती नहीं, कई पौधों की जांच करें।",
      bn: "দীর্ঘ সময় আর্দ্রতা থাকলে পাতায় দাগ ও অস্বাভাবিক রং দেখুন। একটি পাতা নয়, একাধিক গাছ পরীক্ষা করুন।",
    },
  },

  mustard: {
    names: ["mustard", "सरसों", "সরিষা"],
    label: { en: "Mustard", hi: "सरसों", bn: "সরিষা" },
    irrigation: {
      en: "Keep moisture adequate during establishment and flowering. Avoid unnecessary heavy irrigation when the soil is already moist.",
      hi: "स्थापना और फूल आने के समय पर्याप्त नमी रखें। मिट्टी पहले से नम हो तो अनावश्यक भारी सिंचाई से बचें।",
      bn: "চারা প্রতিষ্ঠা ও ফুলের সময় পর্যাপ্ত আর্দ্রতা রাখুন। মাটি ভেজা থাকলে অপ্রয়োজনীয় বেশি সেচ দেবেন না।",
    },
    fertilizer: {
      en: "Mustard benefits from balanced nutrition. Nitrogen, phosphorus and sulfur should be considered together, especially where soil fertility is low.",
      hi: "सरसों में संतुलित पोषण जरूरी है। खासकर कम उर्वर मिट्टी में नाइट्रोजन, फॉस्फोरस और सल्फर को साथ में ध्यान में रखें।",
      bn: "সরিষায় সুষম পুষ্টি দরকার। বিশেষ করে কম উর্বর মাটিতে নাইট্রোজেন, ফসফরাস ও সালফার একসঙ্গে বিবেচনা করুন।",
    },
    pest: {
      en: "Aphids are a key pest to watch during tender growth and flowering. Inspect shoots and flower clusters regularly.",
      hi: "नई बढ़वार और फूल आने के समय माहू प्रमुख कीट हो सकता है। कोमल टहनियों और फूलों की जांच नियमित करें।",
      bn: "নতুন বৃদ্ধি ও ফুলের সময় এফিড গুরুত্বপূর্ণ পোকা হতে পারে। কচি ডগা ও ফুলের গুচ্ছ নিয়মিত পরীক্ষা করুন।",
    },
    disease: {
      en: "Watch for white rust, Alternaria-type leaf spotting and other fungal symptoms during humid weather.",
      hi: "नम मौसम में सफेद रतुआ, अल्टरनेरिया जैसे पत्ती धब्बा और अन्य फफूंद लक्षणों पर नजर रखें।",
      bn: "আর্দ্র আবহাওয়ায় হোয়াইট রাস্ট, অল্টারনারিয়া ধরনের পাতার দাগ ও অন্যান্য ছত্রাকের লক্ষণ নজরে রাখুন।",
    },
  },

  tomato: {
    names: ["tomato", "tamato", "टमाटर", "টমেটো"],
    label: { en: "Tomato", hi: "टमाटर", bn: "টমেটো" },
    irrigation: {
      en: "Tomato prefers consistent moisture rather than repeated wet-dry cycles. Water near the root zone and avoid keeping foliage wet for long periods.",
      hi: "टमाटर में लगातार उचित नमी बेहतर रहती है। जड़ों के पास पानी दें और पत्तियों को लंबे समय तक गीला न रखें।",
      bn: "টমেটোতে নিয়মিত আর্দ্রতা ভালো। গোড়ার কাছে জল দিন এবং পাতাকে দীর্ঘ সময় ভেজা রাখবেন না।",
    },
    fertilizer: {
      en: "Use balanced nutrition during vegetative growth and pay attention to potassium once flowering and fruit development begin. Avoid excessive nitrogen after flowering.",
      hi: "बढ़वार के समय संतुलित पोषण दें और फूल व फल बनने पर पोटाश पर ध्यान दें। फूल आने के बाद बहुत ज्यादा नाइट्रोजन से बचें।",
      bn: "বৃদ্ধির সময় সুষম পুষ্টি দিন এবং ফুল ও ফল ধরার সময় পটাশের দিকে নজর দিন। ফুল আসার পর অতিরিক্ত নাইট্রোজেন এড়ান।",
    },
    pest: {
      en: "Watch for fruit borer, whiteflies, aphids and other sucking pests. Inspect new growth and developing fruits.",
      hi: "फल छेदक, सफेद मक्खी और माहू पर नजर रखें। नई बढ़वार और विकसित हो रहे फलों की जांच करें।",
      bn: "ফল ছিদ্রকারী পোকা, সাদা মাছি ও এফিড নজরে রাখুন। নতুন বৃদ্ধি ও বাড়তে থাকা ফল পরীক্ষা করুন।",
    },
    disease: {
      en: "Look for leaf spots, curling, yellowing and lesions. Avoid prolonged leaf wetness and remove severely affected plant material.",
      hi: "पत्तियों पर धब्बे, मुड़ना, पीलापन और घाव देखें। लंबे समय तक पत्तियां गीली न रहें और बहुत प्रभावित हिस्से हटा दें।",
      bn: "পাতায় দাগ, কুঁকড়ে যাওয়া, হলুদ হওয়া ও ক্ষত দেখুন। দীর্ঘ সময় পাতা ভেজা রাখবেন না এবং বেশি আক্রান্ত অংশ সরিয়ে ফেলুন।",
    },
  },

  pumpkin: {
    names: ["pumpkin", "कद्दू", "কুমড়া"],
    label: { en: "Pumpkin", hi: "कद्दू", bn: "কুমড়া" },
    irrigation: {
      en: "Keep the root zone evenly moist during vine growth, flowering and fruit enlargement. Avoid prolonged waterlogging around the roots.",
      hi: "बेल की बढ़वार, फूल और फल बढ़ने के समय जड़ क्षेत्र में समान नमी रखें। जड़ों के आसपास लंबे समय तक पानी जमा न रहने दें।",
      bn: "লতা বৃদ্ধি, ফুল ও ফল বড় হওয়ার সময় গোড়ায় সমান আর্দ্রতা রাখুন। গোড়ায় দীর্ঘ সময় জল জমতে দেবেন না।",
    },
    fertilizer: {
      en: "Pumpkin needs good nutrition for vine growth and fruit development. Balanced feeding with adequate potassium is useful once flowering and fruiting begin.",
      hi: "कद्दू को बेल की बढ़वार और फल विकास के लिए अच्छा पोषण चाहिए। फूल और फल आने पर पर्याप्त पोटाश के साथ संतुलित पोषण उपयोगी है।",
      bn: "কুমড়ায় লতা বৃদ্ধি ও ফল গঠনের জন্য ভালো পুষ্টি দরকার। ফুল ও ফল ধরার পর পর্যাপ্ত পটাশসহ সুষম পুষ্টি উপকারী।",
    },
    pest: {
      en: "Check for fruit fly, caterpillars and sucking pests. Inspect flowers, young fruits and tender leaves.",
      hi: "फल मक्खी, इल्ली और रस चूसने वाले कीट देखें। फूल, छोटे फल और कोमल पत्तियों की जांच करें।",
      bn: "ফল মাছি, শুঁয়োপোকা ও রস চোষা পোকা দেখুন। ফুল, কচি ফল ও নরম পাতা পরীক্ষা করুন।",
    },
    disease: {
      en: "Powdery mildew and other leaf diseases can increase under humid conditions. Improve airflow and avoid unnecessary overhead watering.",
      hi: "नम मौसम में पाउडरी मिल्ड्यू और अन्य पत्ती रोग बढ़ सकते हैं। हवा का आवागमन बेहतर रखें और अनावश्यक ऊपर से सिंचाई न करें।",
      bn: "আর্দ্র আবহাওয়ায় পাউডারি মিলডিউ ও অন্যান্য পাতার রোগ বাড়তে পারে। বাতাস চলাচল বাড়ান এবং অপ্রয়োজনীয় ওপর থেকে জল দেওয়া এড়ান।",
    },
  },

  chilli: {
    names: ["chilli", "chili", "pepper", "मिर्च", "লঙ্কা", "মরিচ"],
    label: { en: "Chilli", hi: "मिर्च", bn: "লঙ্কা" },
    irrigation: {
      en: "Keep soil moisture reasonably steady during flowering and fruiting. Avoid both drought stress and standing water.",
      hi: "फूल और फल आने के समय मिट्टी में पर्याप्त और स्थिर नमी रखें। सूखे तनाव और जलभराव दोनों से बचें।",
      bn: "ফুল ও ফলের সময় মাটিতে পর্যাপ্ত ও স্থির আর্দ্রতা রাখুন। খরা ও জলাবদ্ধতা দুটোই এড়ান।",
    },
    fertilizer: {
      en: "Use balanced nutrition during early growth and give more attention to potassium during flowering and fruiting. Avoid excessive nitrogen that produces too much foliage.",
      hi: "शुरुआती बढ़वार में संतुलित पोषण दें और फूल-फल के समय पोटाश पर ध्यान दें। बहुत ज्यादा नाइट्रोजन से अत्यधिक पत्तियां बढ़ सकती हैं।",
      bn: "প্রথমদিকে সুষম পুষ্টি দিন এবং ফুল-ফলের সময় পটাশের দিকে নজর দিন। অতিরিক্ত নাইট্রোজেন দিলে বেশি পাতা হতে পারে।",
    },
    pest: {
      en: "Thrips, aphids and mites can cause curling, silvery patches or distorted new growth. Inspect tender leaves regularly.",
      hi: "थ्रिप्स, माहू और माइट्स से पत्तियां मुड़ सकती हैं, चांदी जैसे निशान या विकृत नई बढ़वार दिख सकती है। कोमल पत्तियों की नियमित जांच करें।",
      bn: "থ্রিপস, এফিড ও মাইটে পাতা কুঁকড়ে যেতে পারে, রূপালি দাগ বা বিকৃত নতুন বৃদ্ধি দেখা দিতে পারে। কচি পাতা নিয়মিত পরীক্ষা করুন।",
    },
    disease: {
      en: "Watch for leaf curl symptoms, leaf spots and fungal problems during humid periods. Remove badly affected material and improve airflow.",
      hi: "नम मौसम में लीफ कर्ल, पत्ती धब्बा और फफूंद समस्याओं पर नजर रखें। बहुत प्रभावित हिस्से हटाएं और हवा का आवागमन सुधारें।",
      bn: "আর্দ্র সময়ে লিফ কার্ল, পাতার দাগ ও ছত্রাকের সমস্যা নজরে রাখুন। বেশি আক্রান্ত অংশ সরিয়ে বাতাস চলাচল বাড়ান।",
    },
  },

  cucumber: {
    names: ["cucumber", "खीरा", "শসা"],
    label: { en: "Cucumber", hi: "खीरा", bn: "শসা" },
    irrigation: {
      en: "Cucumber has a relatively shallow root system, so avoid allowing the root zone to become completely dry. Consistent moisture is especially useful during flowering and fruit development.",
      hi: "खीरे की जड़ें अपेक्षाकृत उथली होती हैं, इसलिए जड़ क्षेत्र को पूरी तरह सूखने न दें। फूल और फल बनने के समय स्थिर नमी विशेष रूप से उपयोगी है।",
      bn: "শসার শিকড় তুলনামূলক অগভীর, তাই গোড়ার মাটি পুরো শুকিয়ে যেতে দেবেন না। ফুল ও ফলের সময় নিয়মিত আর্দ্রতা বিশেষভাবে দরকার।",
    },
    fertilizer: {
      en: "Use balanced nutrition during vine development and ensure adequate potassium once fruiting starts. Avoid excessive nitrogen if vines become very leafy with poor fruiting.",
      hi: "बेल की बढ़वार में संतुलित पोषण दें और फल आने पर पर्याप्त पोटाश रखें। बहुत अधिक पत्तियां और कम फल हों तो अतिरिक्त नाइट्रोजन से बचें।",
      bn: "লতা বৃদ্ধির সময় সুষম পুষ্টি দিন এবং ফল ধরার পর পর্যাপ্ত পটাশ রাখুন। বেশি পাতা কিন্তু কম ফল হলে অতিরিক্ত নাইট্রোজেন এড়ান।",
    },
    pest: {
      en: "Watch for aphids, whiteflies and other sucking pests on young leaves. Check the underside of leaves regularly.",
      hi: "नई पत्तियों पर माहू, सफेद मक्खी और अन्य रस चूसने वाले कीट देखें। पत्तियों की निचली सतह नियमित जांचें।",
      bn: "কচি পাতায় এফিড, সাদা মাছি ও অন্যান্য রস চোষা পোকা দেখুন। পাতার নিচের দিক নিয়মিত পরীক্ষা করুন।",
    },
    disease: {
      en: "Powdery mildew and downy mildew can become problems in suitable weather. Look for white growth or angular/yellow leaf spots.",
      hi: "उपयुक्त मौसम में पाउडरी और डाउनी मिल्ड्यू की समस्या हो सकती है। सफेद परत या कोणीय पीले धब्बे देखें।",
      bn: "উপযুক্ত আবহাওয়ায় পাউডারি ও ডাউনি মিলডিউ হতে পারে। সাদা আস্তরণ বা কোণাকৃতি হলুদ দাগ দেখুন।",
    },
  },

  garlic: {
    names: ["garlic", "लहसुन", "রসুন"],
    label: { en: "Garlic", hi: "लहसुन", bn: "রসুন" },
    irrigation: {
      en: "Garlic prefers steady but not excessive moisture. Reduce unnecessary irrigation as bulbs approach maturity and avoid prolonged waterlogging.",
      hi: "लहसुन में पर्याप्त लेकिन अत्यधिक नहीं नमी रखें। गांठ पकने के समय अनावश्यक सिंचाई कम करें और जलभराव से बचें।",
      bn: "রসুনে পর্যাপ্ত কিন্তু অতিরিক্ত নয় এমন আর্দ্রতা দরকার। কন্দ পরিপক্ব হওয়ার সময় অপ্রয়োজনীয় সেচ কমান এবং জলাবদ্ধতা এড়ান।",
    },
    fertilizer: {
      en: "Garlic benefits from good early nutrition, while excessive nitrogen late in the crop can delay maturity. Adjust feeding according to soil fertility.",
      hi: "लहसुन को शुरुआती अवस्था में अच्छा पोषण चाहिए। बाद की अवस्था में अधिक नाइट्रोजन पकने में देरी कर सकती है।",
      bn: "রসুনে শুরুতে ভালো পুষ্টি দরকার। পরে অতিরিক্ত নাইট্রোজেন পরিপক্বতা দেরি করাতে পারে।",
    },
    pest: {
      en: "Thrips are an important pest to watch. Look for silvery streaks or distorted leaves, especially during dry weather.",
      hi: "थ्रिप्स पर विशेष नजर रखें। खासकर सूखे मौसम में पत्तियों पर चांदी जैसे निशान या विकृति देखें।",
      bn: "থ্রিপস গুরুত্বপূর্ণ পোকা। বিশেষ করে শুষ্ক আবহাওয়ায় পাতায় রূপালি দাগ বা বিকৃতি দেখুন।",
    },
    disease: {
      en: "Inspect for fungal leaf spots and discoloration during humid conditions. Good drainage and removal of badly affected leaves can help limit spread.",
      hi: "नम मौसम में फफूंद वाले पत्ती धब्बों और रंग बदलने की जांच करें। अच्छी जल निकासी और बहुत प्रभावित पत्तियों को हटाना फैलाव कम करने में मदद कर सकता है।",
      bn: "আর্দ্র আবহাওয়ায় ছত্রাকজনিত পাতার দাগ ও রঙ পরিবর্তন দেখুন। ভালো জল নিষ্কাশন ও বেশি আক্রান্ত পাতা সরানো বিস্তার কমাতে সাহায্য করতে পারে।",
    },
  },

  spinach: {
    names: ["spinach", "palak", "पालक", "পালং", "পালংশাক"],
    label: { en: "Spinach", hi: "पालक", bn: "পালং শাক" },
    irrigation: {
      en: "Spinach grows best with consistently moist soil. Because the crop has a relatively shallow root zone, check moisture frequently during warm or dry weather.",
      hi: "पालक में मिट्टी की लगातार उचित नमी जरूरी है। जड़ क्षेत्र उथला होने के कारण गर्म या सूखे मौसम में नमी बार-बार जांचें।",
      bn: "পালং শাকে মাটির নিয়মিত আর্দ্রতা দরকার। শিকড় অগভীর হওয়ায় গরম বা শুষ্ক আবহাওয়ায় ঘন ঘন আর্দ্রতা পরীক্ষা করুন।",
    },
    fertilizer: {
      en: "Leafy growth needs balanced nutrition, especially adequate nitrogen. Avoid excessive fertilizer close to harvest and prefer soil-test-based recommendations where possible.",
      hi: "पत्तेदार बढ़वार के लिए संतुलित पोषण, खासकर पर्याप्त नाइट्रोजन, जरूरी है। कटाई के करीब बहुत ज्यादा खाद देने से बचें।",
      bn: "পাতার বৃদ্ধির জন্য সুষম পুষ্টি, বিশেষ করে পর্যাপ্ত নাইট্রোজেন দরকার। কাটার কাছাকাছি অতিরিক্ত সার দেওয়া এড়ান।",
    },
    pest: {
      en: "Watch for aphids and leaf miners. Inspect the undersides of leaves and look for winding mines or clusters of small insects.",
      hi: "माहू और लीफ माइनर पर नजर रखें। पत्तियों की निचली सतह देखें और सुरंग जैसे निशान या छोटे कीटों के समूह खोजें।",
      bn: "এফিড ও লিফ মাইনার নজরে রাখুন। পাতার নিচে সরু দাগ/সুড়ঙ্গ ও ছোট পোকার দল দেখুন।",
    },
    disease: {
      en: "Leaf spots and fungal problems can increase under excessive moisture and poor airflow. Avoid unnecessary leaf wetness and remove badly affected leaves.",
      hi: "अधिक नमी और खराब हवा के कारण पत्ती धब्बा व फफूंद की समस्या बढ़ सकती है। अनावश्यक पत्तियों को गीला रखने से बचें और बहुत प्रभावित पत्तियां हटाएं।",
      bn: "অতিরিক্ত আর্দ্রতা ও কম বাতাসে পাতার দাগ ও ছত্রাকের সমস্যা বাড়তে পারে। অপ্রয়োজনীয় পাতা ভেজা রাখা এড়ান এবং বেশি আক্রান্ত পাতা সরান।",
    },
  },
};


/* ---------- assistant helpers ---------- */

const ASSISTANT_INTENTS = {
  irrigation: [
    "irrigat", "water", "watering", "watered", "moisture",
    "सिंचाई", "पानी", "सेच", "जल",
    "সেচ", "জল", "পানি"
  ],

  fertilizer: [
    "fertil", "manure", "urea", "npk", "dap",
    "खाद", "उर्वरक", "सार",
    "সার", "ইউরিয়া", "ইউরিয়া"
  ],

  pest: [
    "pest", "insect", "bug", "aphid", "thrips", "worm",
    "कीट", "कीड़ा", "कीड़े", "माहू",
    "পোকা", "কীট", "এফিড", "থ্রিপস"
  ],

  disease: [
    "disease", "fungus", "fungal", "blight", "spot", "rust",
    "curl", "mildew", "yellow", "yellowing", "leaf",
    "रोग", "फफूंद", "झुलसा", "धब्बा", "पीला", "पत्ती",
    "রোগ", "ছত্রাক", "দাগ", "হলুদ", "পাতা"
  ],

  price: [
    "price", "rate", "mandi", "market", "sell", "selling",
    "भाव", "दाम", "मंडी", "बाज़ार", "बेच",
    "দাম", "দর", "মান্ডি", "বাজার", "বিক্রি"
  ],

  weather: [
    "weather", "rain", "temperature", "heat", "cold", "humidity",
    "मौसम", "बारिश", "तापमान", "गर्मी", "ठंड",
    "আবহাওয়া", "বৃষ্টি", "তাপমাত্রা", "গরম", "ঠান্ডা"
  ],
};

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[?,.!;:()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function includesAny(text, words) {
  return words.some((word) => text.includes(word));
}

function detectCrop(text) {
  const s = normalizeText(text);

  for (const [key, profile] of Object.entries(CROP_PROFILES)) {
    if (profile.names.some((name) => s.includes(name.toLowerCase()))) {
      return key;
    }
  }

  return null;
}

function detectIntent(text) {
  const s = normalizeText(text);

  // Check specific intents first.
  if (includesAny(s, ASSISTANT_INTENTS.price)) return "price";
  if (includesAny(s, ASSISTANT_INTENTS.disease)) return "disease";
  if (includesAny(s, ASSISTANT_INTENTS.pest)) return "pest";
  if (includesAny(s, ASSISTANT_INTENTS.fertilizer)) return "fertilizer";
  if (includesAny(s, ASSISTANT_INTENTS.irrigation)) return "irrigation";
  if (includesAny(s, ASSISTANT_INTENTS.weather)) return "weather";

  return "general";
}


/* ---------- multilingual labels ---------- */

const RESPONSE_LABELS = {
  en: {
    overview: "Crop overview",
    advice: "Practical advice",
    watch: "What to watch",
    next: "Next step",
    irrigation: "Irrigation",
    fertilizer: "Fertilizer",
    pest: "Pest watch",
    disease: "Disease watch",
    price: "Mandi price",
    weather: "Weather note",
    note: "Note",
  },

  hi: {
    overview: "फसल की जानकारी",
    advice: "व्यावहारिक सलाह",
    watch: "क्या देखें",
    next: "अगला कदम",
    irrigation: "सिंचाई",
    fertilizer: "खाद",
    pest: "कीट निगरानी",
    disease: "रोग निगरानी",
    price: "मंडी भाव",
    weather: "मौसम सलाह",
    note: "ध्यान दें",
  },

  bn: {
    overview: "ফসলের তথ্য",
    advice: "ব্যবহারিক পরামর্শ",
    watch: "কী দেখবেন",
    next: "পরবর্তী পদক্ষেপ",
    irrigation: "সেচ",
    fertilizer: "সার",
    pest: "পোকা নজরদারি",
    disease: "রোগ নজরদারি",
    price: "মান্ডি দর",
    weather: "আবহাওয়া পরামর্শ",
    note: "খেয়াল রাখুন",
  },
};


/* ---------- response builders ---------- */

function makeStructuredResponse(profile, intent, lang, variant = 0) {
  const label = profile.label[lang] || profile.label.en;
  const L = RESPONSE_LABELS[lang] || RESPONSE_LABELS.en;

  const variants = {
    irrigation: [
      `### ${L.irrigation} — ${label}

**${L.advice}**
${profile.irrigation[lang] || profile.irrigation.en}

**${L.watch}**
Check the soil moisture around the root zone before watering. If the soil is still moist, avoid unnecessary irrigation.

**${L.next}**
If you tell me the soil type and how many days it has been since the last rain, I can make the advice more specific.`,

      `### ${L.irrigation} — ${label}

**Current guidance**
${profile.irrigation[lang] || profile.irrigation.en}

**Simple field check**
Take a small amount of soil from the root zone and check whether it is actually dry before irrigating.

**${L.next}**
Tell me: **soil type + crop stage + days since last rain**.`,

      `### ${label}: irrigation

**What to do**
${profile.irrigation[lang] || profile.irrigation.en}

**Avoid**
Do not follow a fixed watering schedule when recent rain or existing soil moisture has already supplied enough water.

**${L.next}**
For a better recommendation, give me the crop stage and last-rain information.`,
    ],

    fertilizer: [
      `### ${L.fertilizer} — ${label}

**${L.advice}**
${profile.fertilizer[lang] || profile.fertilizer.en}

**${L.watch}**
Avoid applying a large amount of fertilizer at once. Crop stage and soil condition matter.

**${L.next}**
If you tell me the crop stage and soil type, I can narrow this down further.`,

      `### ${label}: fertilizer plan

**Main point**
${profile.fertilizer[lang] || profile.fertilizer.en}

**Good practice**
Use split applications where appropriate and avoid guessing a heavy dose without knowing the soil condition.

**${L.next}**
Tell me whether the crop is at **sowing, vegetative, flowering, grain/fruit filling, or maturity** stage.`,

      `### ${L.fertilizer} advice for ${label}

**Recommended approach**
${profile.fertilizer[lang] || profile.fertilizer.en}

**Important**
More fertilizer does not automatically mean more yield. Excess nitrogen can sometimes create weak or overly leafy growth.

**${L.next}**
Share the crop stage and I can explain what nutrient priority makes sense at that stage.`,
    ],

    pest: [
      `### ${L.pest} — ${label}

**${L.watch}**
${profile.pest[lang] || profile.pest.en}

**Field check**
Inspect new leaves, tender shoots and the underside of leaves. Look for clusters, feeding marks or distorted growth.

**${L.next}**
If you describe the pest or upload a clear leaf photo, I can help narrow down what you are seeing.`,

      `### Pest check: ${label}

**Main pests to watch**
${profile.pest[lang] || profile.pest.en}

**Do this first**
Walk through several plants rather than checking only one. Note whether the damage is on young leaves, old leaves, flowers or fruits.

**${L.next}**
Tell me what the damage looks like — holes, curling, yellowing, sticky leaves, spots, or insects.`,

      `### ${label} — pest watch

**Likely concern**
${profile.pest[lang] || profile.pest.en}

**Early warning signs**
Check for distorted new growth, feeding marks, insect clusters and unusual leaf colour.

**${L.next}**
If you tell me where the damage starts on the plant, I can help distinguish the likely problem.`,
    ],

    disease: [
      `### ${L.disease} — ${label}

**${L.watch}**
${profile.disease[lang] || profile.disease.en}

**What to inspect**
Look at several leaves from different parts of the field. Check the front and underside of affected leaves.

**${L.next}**
You can also upload a clear leaf photo in **Crop Doctor** for a preliminary visual screening.`,

      `### Disease check: ${label}

**Possible concern**
${profile.disease[lang] || profile.disease.en}

**Before treating**
Check whether the symptoms are spreading, whether the leaves stay wet for long periods, and whether similar symptoms appear on nearby plants.

**${L.next}**
Describe the colour and shape of the spots, or upload a close-up photo.`,

      `### ${label}: disease watch

**What to look for**
${profile.disease[lang] || profile.disease.en}

**Field action**
Remove severely damaged plant material where appropriate and improve airflow/drainage. Avoid applying a treatment before identifying the problem.

**${L.next}**
If you send me the symptom — for example **yellowing, brown spots, curling or white powder** — I can narrow the possibilities.`,
    ],

    general: [
      `### ${label} — quick guide

**${L.irrigation}**
${profile.irrigation[lang] || profile.irrigation.en}

**${L.fertilizer}**
${profile.fertilizer[lang] || profile.fertilizer.en}

**${L.pest}**
${profile.pest[lang] || profile.pest.en}

**${L.next}**
Ask me specifically about **water, fertilizer, pests, disease, weather, or mandi price** for ${label}.`,

      `### ${label} — field checklist

**1. Water**
${profile.irrigation[lang] || profile.irrigation.en}

**2. Nutrition**
${profile.fertilizer[lang] || profile.fertilizer.en}

**3. Crop protection**
${profile.pest[lang] || profile.pest.en}

**4. Disease**
${profile.disease[lang] || profile.disease.en}

**${L.next}**
Tell me what you are currently worried about and I will focus on that part of the crop.`,

      `### About ${label}

${profile.label[lang] || profile.label.en} needs attention to four things:

• **Water:** ${profile.irrigation[lang] || profile.irrigation.en}

• **Nutrition:** ${profile.fertilizer[lang] || profile.fertilizer.en}

• **Pests:** ${profile.pest[lang] || profile.pest.en}

• **Disease:** ${profile.disease[lang] || profile.disease.en}

**${L.next}**
You can ask something as simple as:  
“${label} fertilizer?” or “When should I water ${label}?”`,
    ],
  };

  return variants[intent][variant % variants[intent].length];
}


/* ---------- mandi response ---------- */

function makePriceResponse(cropKey, lang, variant = 0) {
  const profile = CROP_PROFILES[cropKey];
  const cropLabel = profile.label[lang] || profile.label.en;
  const rows = MANDI_DATA[cropLabel] || MANDI_DATA[profile.label.en];

  if (!rows) {
    return null;
  }

  const sorted = [...rows].sort((a, b) => b.price - a.price);
  const best = sorted[0];
  const nearest = [...rows].sort((a, b) => a.km - b.km).slice(0, 3);

  const L = RESPONSE_LABELS[lang] || RESPONSE_LABELS.en;

  if (variant % 2 === 0) {
    return `### ${L.price} — ${cropLabel}

**Best listed price**
₹${best.price} / quintal — **${best.market}**, ${best.km} km away.

**Nearby comparison**
${nearest.map((r) => `• ${r.market}: ₹${r.price}/qtl (${r.km} km)`).join("\n")}

**${L.next}**
Compare the price with transport cost and crop quality before deciding where to sell.

*These are the demo market figures already configured in this app.*`;
  }

  return `### ${cropLabel} — market snapshot

**Highest listed rate:** ₹${best.price}/qtl  
**Market:** ${best.market}  
**Distance:** ${best.km} km

**Nearby rates**
${nearest.map((r) => `• ${r.market} — ₹${r.price}/qtl`).join("\n")}

**${L.note}**
The highest price is not automatically the best net return. Consider distance, transport and the quality/grade of your produce.

*Using the mandi data configured in this demo.*`;
}


/* ---------- weather response ---------- */

function makeWeatherResponse(cropKey, lang) {
  const profile = CROP_PROFILES[cropKey];
  const label = profile.label[lang] || profile.label.en;

  const text = {
    en: `### ${label} — weather guidance

**Rain**
After significant rain, check soil moisture before irrigating again.

**Heat**
During hot, dry conditions, inspect the root zone more frequently and watch for wilting or moisture stress.

**Humidity**
High humidity increases the importance of scouting for fungal and leaf diseases.

**Next step**
Tell me whether your field is currently **rainy, hot/dry, or humid**, and I can focus the advice.`,

    hi: `### ${label} — मौसम सलाह

**बारिश**
अच्छी बारिश के बाद दोबारा सिंचाई करने से पहले मिट्टी की नमी जांचें।

**गर्मी**
गर्म और सूखे मौसम में जड़ क्षेत्र की नमी बार-बार देखें और मुरझाने के लक्षणों पर ध्यान दें।

**नमी**
अधिक आर्द्रता में फफूंद और पत्ती रोगों की निगरानी ज्यादा जरूरी है।

**अगला कदम**
बताएं कि आपके खेत में अभी **बारिश, गर्मी/सूखापन या अधिक नमी** में से क्या स्थिति है।`,

    bn: `### ${label} — আবহাওয়া পরামর্শ

**বৃষ্টি**
ভালো বৃষ্টির পর আবার সেচ দেওয়ার আগে মাটির আর্দ্রতা পরীক্ষা করুন।

**গরম**
গরম ও শুষ্ক আবহাওয়ায় গোড়ার মাটি বেশি ঘন ঘন দেখুন এবং গাছ ঝিমিয়ে পড়ছে কি না খেয়াল করুন।

**আর্দ্রতা**
বেশি আর্দ্রতায় ছত্রাক ও পাতার রোগের নজরদারি আরও গুরুত্বপূর্ণ।

**পরবর্তী পদক্ষেপ**
আপনার জমিতে এখন **বৃষ্টি, গরম/শুষ্ক, নাকি বেশি আর্দ্র**—জানালে আমি সেই অনুযায়ী বলব।`,
  };

  return text[lang] || text.en;
}


/* ---------- main reply engine ---------- */

function reply(text, lang, previousCrop = null, variant = 0) {
  const normalized = normalizeText(text);

  const cropKey = detectCrop(normalized) || previousCrop;
  const intent = detectIntent(normalized);

  // If the user asks for a crop that exists in the app,
  // always prefer crop-specific information.
  if (cropKey) {
    if (intent === "price") {
      return {
        text: makePriceResponse(cropKey, lang, variant),
        cropKey,
      };
    }

    if (intent === "weather") {
      return {
        text: makeWeatherResponse(cropKey, lang),
        cropKey,
      };
    }

    return {
      text: makeStructuredResponse(
        CROP_PROFILES[cropKey],
        intent,
        lang,
        variant
      ),
      cropKey,
    };
  }

  // No crop mentioned: still answer the intent instead of giving
  // the same generic fallback every time.
  const generic = {
    irrigation: {
      en: "### Irrigation\n\nTell me the crop name and I can give crop-specific watering guidance. You can also include soil type and days since the last rain.",
      hi: "### सिंचाई\n\nफसल का नाम बताएं, मैं उसी फसल के अनुसार सिंचाई की सलाह दूंगा। मिट्टी का प्रकार और आखिरी बारिश के बाद के दिन भी बताएं।",
      bn: "### সেচ\n\nফসলের নাম বলুন, আমি সেই ফসল অনুযায়ী সেচের পরামর্শ দেব। মাটির ধরন ও শেষ বৃষ্টির পর কত দিন হয়েছে তাও জানাতে পারেন।",
    },

    fertilizer: {
      en: "### Fertilizer\n\nTell me the crop and growth stage first. Fertilizer advice is different for rice, vegetables, leafy crops and tuber crops.",
      hi: "### खाद\n\nपहले फसल और उसकी अवस्था बताएं। धान, सब्जियों, पत्तेदार फसलों और कंद वाली फसलों की खाद की जरूरत अलग होती है।",
      bn: "### সার\n\nপ্রথমে ফসল ও তার পর্যায় বলুন। ধান, সবজি, পাতাজাতীয় ফসল ও কন্দজাতীয় ফসলের সারের প্রয়োজন আলাদা।",
    },

    pest: {
      en: "### Pest check\n\nTell me the crop and what you are seeing — holes, curling, yellowing, sticky leaves, insects or damaged fruits.",
      hi: "### कीट जांच\n\nफसल का नाम और लक्षण बताएं — छेद, पत्ती मुड़ना, पीलापन, चिपचिपी पत्ती, कीट या खराब फल।",
      bn: "### পোকা পরীক্ষা\n\nফসলের নাম ও কী দেখছেন তা বলুন — ছিদ্র, পাতা কুঁকড়ানো, হলুদ হওয়া, আঠালো পাতা, পোকা বা ফলের ক্ষতি।",
    },

    disease: {
      en: "### Disease check\n\nTell me the crop and describe the symptom: yellowing, brown spots, black spots, curling, white powder or wilting.",
      hi: "### रोग जांच\n\nफसल और लक्षण बताएं: पीलापन, भूरे/काले धब्बे, पत्ती मुड़ना, सफेद पाउडर या मुरझाना।",
      bn: "### রোগ পরীক্ষা\n\nফসলের নাম ও লক্ষণ বলুন: হলুদ হওয়া, বাদামি/কালো দাগ, পাতা কুঁকড়ানো, সাদা গুঁড়োর মতো আস্তরণ বা শুকিয়ে যাওয়া।",
    },

    price: {
      en: "### Mandi price\n\nTell me which crop you want the price for — for example rice, potato, tomato, chilli, garlic or spinach.",
      hi: "### मंडी भाव\n\nकिस फसल का भाव चाहिए बताएं — जैसे धान, आलू, टमाटर, मिर्च, लहसुन या पालक।",
      bn: "### মান্ডি দর\n\nকোন ফসলের দাম জানতে চান বলুন — যেমন ধান, আলু, টমেটো, লঙ্কা, রসুন বা পালং।",
    },

    weather: {
      en: "### Weather\n\nTell me the crop and whether your field is currently rainy, hot/dry or humid. I can then focus the advice on water and disease risk.",
      hi: "### मौसम\n\nफसल का नाम और खेत की स्थिति बताएं — बारिश, गर्म/सूखा या नम। फिर मैं पानी और रोग के जोखिम पर ध्यान दूंगा।",
      bn: "### আবহাওয়া\n\nফসলের নাম ও জমির অবস্থা বলুন — বৃষ্টি, গরম/শুষ্ক নাকি আর্দ্র। তারপর আমি জল ও রোগের ঝুঁকি অনুযায়ী বলব।",
    },

    general: {
      en: "### KrishiMind\n\nI can give crop-specific guidance for **Rice, Wheat, Potato, Maize, Mustard, Tomato, Pumpkin, Chilli, Cucumber, Garlic and Spinach**.\n\nTry: **“Tomato fertilizer”**, **“Spinach pests”**, **“When should I water garlic?”**, or **“Chilli mandi price?”**",
      hi: "### कृषिमाइंड\n\nमैं **धान, गेहूं, आलू, मक्का, सरसों, टमाटर, कद्दू, मिर्च, खीरा, लहसुन और पालक** के लिए फसल-विशिष्ट सलाह दे सकता हूं।\n\nजैसे पूछें: **“टमाटर की खाद?”**, **“पालक में कौन सा कीट?”**, **“लहसुन में पानी कब दें?”**",
      bn: "### কৃষিমাইন্ড\n\nআমি **ধান, গম, আলু, ভুট্টা, সরিষা, টমেটো, কুমড়া, লঙ্কা, শসা, রসুন ও পালং শাক** সম্পর্কে ফসলভিত্তিক পরামর্শ দিতে পারি।\n\nযেমন জিজ্ঞাসা করুন: **“টমেটোর সার?”**, **“পালংয়ে কোন পোকা?”**, **“রসুনে কখন সেচ দেব?”**",
    },
  };

  return {
    text: generic[intent][lang] || generic[intent].en,
    cropKey: previousCrop,
  };
}


/* -------------------------------- assistant UI -------------------------------- */

function AssistantView({ t, lang }) {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: reply("", lang).text,
    },
  ]);

  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const lastCropRef = useRef(null);
  const responseCountRef = useRef(0);

  const send = (text) => {
    const msg = (text ?? input).trim();
    if (!msg) return;

    const result = reply(
      msg,
      lang,
      lastCropRef.current,
      responseCountRef.current
    );

    lastCropRef.current = result.cropKey;
    responseCountRef.current += 1;

    setMessages((m) => [
      ...m,
      { from: "user", text: msg },
    ]);

    setInput("");

    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { from: "bot", text: result.text },
      ]);
    }, 450);
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice input is not supported in this browser. Please use Chrome or Edge."
      );
      return;
    }

    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang =
      lang === "hi"
        ? "hi-IN"
        : lang === "bn"
        ? "bn-IN"
        : "en-IN";

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        transcript += event.results[i][0].transcript;
      }

      setInput(transcript);
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div>
      <SectionHeader
        title={t.assistantTitle}
        sub={t.assistantSub}
      />

      <div
        style={{
          background: "#fff",
          border: "1px solid #ECE7D8",
          borderRadius: 16,
          display: "flex",
          flexDirection: "column",
          height: 440,
          maxWidth: 640,
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 18,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf:
                  m.from === "user"
                    ? "flex-end"
                    : "flex-start",

                background:
                  m.from === "user"
                    ? "var(--forest)"
                    : "var(--leaf-light)",

                color:
                  m.from === "user"
                    ? "#fff"
                    : "var(--forest)",

                padding: "10px 14px",
                borderRadius: 14,

                borderBottomRightRadius:
                  m.from === "user" ? 4 : 14,

                borderBottomLeftRadius:
                  m.from === "bot" ? 4 : 14,

                maxWidth: "88%",
                fontSize: 13.5,
                lineHeight: 1.55,
                whiteSpace: "pre-wrap",
              }}
            >
              {m.text}
            </div>
          ))}
        </div>

        <div
          style={{
            padding: 12,
            borderTop: "1px solid #F0ECDF",
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          {t.faqChips.map((chip) => (
            <button
              key={chip}
              onClick={() => send(chip)}
              style={{
                fontSize: 11.5,
                padding: "6px 10px",
                borderRadius: 999,
                border: "1px solid #DCD5C2",
                background: "#fff",
                color: "#5B6B5D",
                fontWeight: 600,
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        <div
          style={{
            padding: 12,
            borderTop: "1px solid #F0ECDF",
            display: "flex",
            gap: 8,
          }}
        >
          <button
  onClick={startVoiceInput}
  style={{
    width: 40,
    height: 40,
    borderRadius: 10,
    border: isListening
      ? "2px solid var(--leaf)"
      : "1px solid #DCD5C2",
    background: isListening
      ? "var(--leaf-light)"
      : "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    cursor: "pointer",
  }}
  title={isListening ? "Stop listening" : "Speak your question"}
>
  <Mic size={17} color="var(--leaf)" />
</button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && send()
            }
            placeholder={t.inputPlaceholder}
            style={{
              flex: 1,
              border: "1px solid #DCD5C2",
              borderRadius: 10,
              padding: "0 14px",
              fontSize: 13.5,
            }}
          />

          <button
            onClick={() => send()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              border: "none",
              background: "var(--leaf)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Send size={16} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
}
