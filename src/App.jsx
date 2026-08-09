import React, { useState, useRef, useCallback, useEffect } from "react";import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";import {Sprout, Leaf, CloudRain, Camera, MessageCircle, TrendingUp,Droplets, Sun, Wind, MapPin, Upload, Mic, Send, ChevronRight,AlertTriangle, CheckCircle2, Globe, Home, X} from "lucide-react";

/* ---------------------------------- i18n ---------------------------------- */

const STRINGS = {en: {appName: "KrishiMind AI",tagline: "Smart advisory for the smallholder farmer",nav: { home: "Home", doctor: "Crop Doctor", advisory: "Water & Feed Plan", mandi: "Mandi Prices", assistant: "Ask KrishiMind" },greeting: "Namaste, Farmer",weatherNote: "Today's field conditions",quickStats: "Your farm at a glance",activeCrop: "Active crop", nextTask: "Next task", marketTip: "Market tip",doctorTitle: "Crop Doctor", doctorSub: "Upload a leaf photo. We check it against known symptoms — right on your phone, no internet needed.",uploadCta: "Upload or take a leaf photo", analyzing: "Reading the leaf...",resultHealthy: "Leaf looks healthy", resultDeficiency: "Possible nitrogen deficiency", resultBlight: "Possible leaf blight / fungal spotting",confidence: "Confidence", whatToDo: "What to do",advisoryTitle: "Water & Feed Plan", advisorySub: "Tell us the field conditions, get a schedule tuned to your crop's growth stage.",crop: "Crop", soil: "Soil type", stage: "Growth stage", rain: "Days since last rain",generate: "Generate plan", irrigation: "Irrigation", fertilizer: "Fertilizer", pest: "Pest watch",mandiTitle: "Mandi Prices", mandiSub: "Compare today's price for your crop across nearby markets before you decide where to sell.",bestPrice: "Best price nearby", perQuintal: "per quintal", trend: "7-day trend", distance: "away",assistantTitle: "Ask KrishiMind", assistantSub: "Type or speak in your language. No smartphone needed — this also works over SMS / IVR call.",inputPlaceholder: "Ask about your crop, weather, or scheme...", send: "Send",faqChips: ["When should I irrigate wheat?", "Best fertilizer for potato?", "Mustard price in my area?"],},hi: {appName: "कृषिमाइंड AI",tagline: "छोटे किसानों के लिए स्मार्ट सलाह",nav: { home: "होम", doctor: "फसल डॉक्टर", advisory: "पानी व खाद योजना", mandi: "मंडी भाव", assistant: "कृषिमाइंड से पूछें" },greeting: "नमस्ते, किसान भाई",weatherNote: "आज के खेत की स्थिति",quickStats: "आपके खेत की झलक",activeCrop: "मौजूदा फसल", nextTask: "अगला काम", marketTip: "बाज़ार सलाह",doctorTitle: "फसल डॉक्टर", doctorSub: "पत्ते की फोटो अपलोड करें। बिना इंटरनेट के, आपके फोन पर ही जांच होगी।",uploadCta: "पत्ते की फोटो लें या अपलोड करें", analyzing: "पत्ता जांचा जा रहा है...",resultHealthy: "पत्ता स्वस्थ लग रहा है", resultDeficiency: "नाइट्रोजन की कमी हो सकती है", resultBlight: "पत्ती झुलसा / फफूंद संक्रमण हो सकता है",confidence: "विश्वसनीयता", whatToDo: "क्या करें",advisoryTitle: "पानी व खाद योजना", advisorySub: "खेत की जानकारी दें, फसल की अवस्था अनुसार योजना पाएं।",crop: "फसल", soil: "मिट्टी का प्रकार", stage: "फसल की अवस्था", rain: "आखिरी बारिश के बाद दिन",generate: "योजना बनाएं", irrigation: "सिंचाई", fertilizer: "खाद", pest: "कीट सतर्कता",mandiTitle: "मंडी भाव", mandiSub: "बेचने से पहले नज़दीकी मंडियों के भाव तुलना करें।",bestPrice: "सबसे अच्छा भाव", perQuintal: "प्रति क्विंटल", trend: "7-दिन का रुझान", distance: "दूर",assistantTitle: "कृषिमाइंड से पूछें", assistantSub: "अपनी भाषा में लिखें या बोलें। SMS/IVR कॉल पर भी काम करता है।",inputPlaceholder: "फसल, मौसम या योजना के बारे में पूछें...", send: "भेजें",faqChips: ["गेहूं की सिंचाई कब करें?", "आलू के लिए अच्छी खाद?", "मेरे इलाके में सरसों का भाव?"],},bn: {appName: "কৃষিমাইন্ড AI",tagline: "প্রান্তিক কৃষকদের জন্য স্মার্ট পরামর্শ",nav: { home: "হোম", doctor: "ফসল ডাক্তার", advisory: "জল ও সার পরিকল্পনা", mandi: "মান্ডি দর", assistant: "কৃষিমাইন্ডকে জিজ্ঞাসা করুন" },greeting: "নমস্কার, কৃষক ভাই",weatherNote: "আজকের মাঠের অবস্থা",quickStats: "আপনার খামারের সারসংক্ষেপ",activeCrop: "চলতি ফসল", nextTask: "পরবর্তী কাজ", marketTip: "বাজার পরামর্শ",doctorTitle: "ফসল ডাক্তার", doctorSub: "পাতার ছবি আপলোড করুন। ইন্টারনেট ছাড়াই আপনার ফোনে পরীক্ষা হবে।",uploadCta: "পাতার ছবি তুলুন বা আপলোড করুন", analyzing: "পাতা পরীক্ষা করা হচ্ছে...",resultHealthy: "পাতা সুস্থ দেখাচ্ছে", resultDeficiency: "নাইট্রোজেনের ঘাটতি হতে পারে", resultBlight: "পাতা ঝলসানো / ছত্রাক সংক্রমণ হতে পারে",confidence: "নির্ভরযোগ্যতা", whatToDo: "কী করবেন",advisoryTitle: "জল ও সার পরিকল্পনা", advisorySub: "মাঠের তথ্য দিন, ফসলের পর্যায় অনুযায়ী পরিকল্পনা পান।",crop: "ফসল", soil: "মাটির ধরন", stage: "ফসলের পর্যায়", rain: "শেষ বৃষ্টির পর দিন",generate: "পরিকল্পনা তৈরি করুন", irrigation: "সেচ", fertilizer: "সার", pest: "পোকা সতর্কতা",mandiTitle: "মান্ডি দর", mandiSub: "বিক্রির আগে কাছের মান্ডিগুলোর দর তুলনা করুন।",bestPrice: "কাছের সেরা দর", perQuintal: "প্রতি কুইন্টাল", trend: "৭-দিনের প্রবণতা", distance: "দূরে",assistantTitle: "কৃষিমাইন্ডকে জিজ্ঞাসা করুন", assistantSub: "নিজের ভাষায় লিখুন বা বলুন। SMS/IVR কলেও কাজ করে।",inputPlaceholder: "ফসল, আবহাওয়া বা প্রকল্প নিয়ে জিজ্ঞাসা করুন...", send: "পাঠান",faqChips: ["ধানে কখন সেচ দেব?", "আলুর জন্য ভালো সার কী?", "আমার এলাকায় সরিষার দাম কত?"],},};

const LANGS = [{ code: "en", label: "EN" },{ code: "hi", label: "हिं" },{ code: "bn", label: "বাং" },];

/* -------------------------------- mock data -------------------------------- */

const CROPS = ["Rice","Wheat","Potato","Maize","Mustard","Tomato","Brinjal","Carrot","Cabbage","Cauliflower","Onion","Garlic","Chilli","Cucumber","Pumpkin"];const SOILS = ["Alluvial", "Loamy", "Clay", "Sandy"];const STAGES = ["Sowing", "Vegetative", "Flowering", "Grain fill", "Maturity"];

const MANDI_DATA = {Rice: [{ market: "Barasat Mandi", km: 3, price: 2180 },{ market: "Madhyamgram", km: 7, price: 2140 },{ market: "Basirhat", km: 18, price: 2260 },{ market: "Kolkata Wholesale", km: 26, price: 2310 },{ market: "Howrah Mandi", km: 31, price: 2240 },{ market: "Behala Market", km: 24, price: 2200 },{ market: "Purulia Mandi", km: 290, price: 2100 },{ market: "Malda Mandi", km: 350, price: 2290 },{ market: "Darjeeling Market", km: 620, price: 2180 },{ market: "Haldia Market", km: 125, price: 2250 },],

Wheat: [{ market: "Barasat Mandi", km: 3, price: 2410 },{ market: "Madhyamgram", km: 7, price: 2390 },{ market: "Basirhat", km: 18, price: 2455 },{ market: "Kolkata Wholesale", km: 26, price: 2480 },{ market: "Howrah Mandi", km: 31, price: 2460 },{ market: "Behala Market", km: 24, price: 2430 },{ market: "Purulia Mandi", km: 290, price: 2350 },{ market: "Malda Mandi", km: 350, price: 2470 },{ market: "Darjeeling Market", km: 620, price: 2380 },{ market: "Haldia Market", km: 125, price: 2440 },],

Potato: [{ market: "Barasat Mandi", km: 3, price: 1120 },{ market: "Madhyamgram", km: 7, price: 1085 },{ market: "Basirhat", km: 18, price: 1210 },{ market: "Kolkata Wholesale", km: 26, price: 1260 },{ market: "Howrah Mandi", km: 31, price: 1190 },{ market: "Behala Market", km: 24, price: 1160 },{ market: "Purulia Mandi", km: 290, price: 1090 },{ market: "Malda Mandi", km: 350, price: 1175 },{ market: "Darjeeling Market", km: 620, price: 1140 },{ market: "Haldia Market", km: 125, price: 1200 },],

Maize: [{ market: "Barasat Mandi", km: 3, price: 1890 },{ market: "Madhyamgram", km: 7, price: 1860 },{ market: "Basirhat", km: 18, price: 1930 },{ market: "Kolkata Wholesale", km: 26, price: 1975 },{ market: "Howrah Mandi", km: 31, price: 1940 },{ market: "Behala Market", km: 24, price: 1910 },{ market: "Purulia Mandi", km: 290, price: 1840 },{ market: "Malda Mandi", km: 350, price: 1960 },{ market: "Darjeeling Market", km: 620, price: 1880 },{ market: "Haldia Market", km: 125, price: 1925 },],

Mustard: [{ market: "Barasat Mandi", km: 3, price: 5320 },{ market: "Madhyamgram", km: 7, price: 5260 },{ market: "Basirhat", km: 18, price: 5410 },{ market: "Kolkata Wholesale", km: 26, price: 5480 },{ market: "Howrah Mandi", km: 31, price: 5440 },{ market: "Behala Market", km: 24, price: 5370 },{ market: "Purulia Mandi", km: 290, price: 5190 },{ market: "Malda Mandi", km: 350, price: 5450 },{ market: "Darjeeling Market", km: 620, price: 5280 },{ market: "Haldia Market", km: 125, price: 5430 },],

Tomato: [{ market: "Barasat Mandi", km: 3, price: 2800 },{ market: "Madhyamgram", km: 7, price: 2700 },{ market: "Basirhat", km: 18, price: 2950 },{ market: "Kolkata Wholesale", km: 26, price: 3100 },{ market: "Howrah Mandi", km: 31, price: 3050 },{ market: "Behala Market", km: 24, price: 3000 },{ market: "Purulia Mandi", km: 290, price: 2600 },{ market: "Malda Mandi", km: 350, price: 2900 },{ market: "Darjeeling Market", km: 620, price: 2750 },{ market: "Haldia Market", km: 125, price: 3000 },],

Brinjal: [{ market: "Barasat Mandi", km: 3, price: 2400 },{ market: "Madhyamgram", km: 7, price: 2320 },{ market: "Basirhat", km: 18, price: 2500 },{ market: "Kolkata Wholesale", km: 26, price: 2620 },{ market: "Howrah Mandi", km: 31, price: 2550 },{ market: "Behala Market", km: 24, price: 2480 },{ market: "Purulia Mandi", km: 290, price: 2250 },{ market: "Malda Mandi", km: 350, price: 2450 },{ market: "Darjeeling Market", km: 620, price: 2380 },{ market: "Haldia Market", km: 125, price: 2520 },],

Carrot: [{ market: "Barasat Mandi", km: 3, price: 2600 },{ market: "Madhyamgram", km: 7, price: 2520 },{ market: "Basirhat", km: 18, price: 2700 },{ market: "Kolkata Wholesale", km: 26, price: 2850 },{ market: "Howrah Mandi", km: 31, price: 2780 },{ market: "Behala Market", km: 24, price: 2720 },{ market: "Purulia Mandi", km: 290, price: 2450 },{ market: "Malda Mandi", km: 350, price: 2680 },{ market: "Darjeeling Market", km: 620, price: 2550 },{ market: "Haldia Market", km: 125, price: 2750 },],

Cabbage: [{ market: "Barasat Mandi", km: 3, price: 1800 },{ market: "Madhyamgram", km: 7, price: 1750 },{ market: "Basirhat", km: 18, price: 1900 },{ market: "Kolkata Wholesale", km: 26, price: 2050 },{ market: "Howrah Mandi", km: 31, price: 1980 },{ market: "Behala Market", km: 24, price: 1940 },{ market: "Purulia Mandi", km: 290, price: 1680 },{ market: "Malda Mandi", km: 350, price: 1880 },{ market: "Darjeeling Market", km: 620, price: 1820 },{ market: "Haldia Market", km: 125, price: 1950 },],

Cauliflower: [{ market: "Barasat Mandi", km: 3, price: 2200 },{ market: "Madhyamgram", km: 7, price: 2140 },{ market: "Basirhat", km: 18, price: 2320 },{ market: "Kolkata Wholesale", km: 26, price: 2450 },{ market: "Howrah Mandi", km: 31, price: 2380 },{ market: "Behala Market", km: 24, price: 2350 },{ market: "Purulia Mandi", km: 290, price: 2050 },{ market: "Malda Mandi", km: 350, price: 2280 },{ market: "Darjeeling Market", km: 620, price: 2180 },{ market: "Haldia Market", km: 125, price: 2350 },],

Onion: [{ market: "Barasat Mandi", km: 3, price: 3000 },{ market: "Madhyamgram", km: 7, price: 2920 },{ market: "Basirhat", km: 18, price: 3150 },{ market: "Kolkata Wholesale", km: 26, price: 3300 },{ market: "Howrah Mandi", km: 31, price: 3250 },{ market: "Behala Market", km: 24, price: 3180 },{ market: "Purulia Mandi", km: 290, price: 2800 },{ market: "Malda Mandi", km: 350, price: 3100 },{ market: "Darjeeling Market", km: 620, price: 2950 },{ market: "Haldia Market", km: 125, price: 3200 },],

Garlic: [{ market: "Barasat Mandi", km: 3, price: 8500 },{ market: "Madhyamgram", km: 7, price: 8300 },{ market: "Basirhat", km: 18, price: 8800 },{ market: "Kolkata Wholesale", km: 26, price: 9200 },{ market: "Howrah Mandi", km: 31, price: 9000 },{ market: "Behala Market", km: 24, price: 8900 },{ market: "Purulia Mandi", km: 290, price: 8100 },{ market: "Malda Mandi", km: 350, price: 8700 },{ market: "Darjeeling Market", km: 620, price: 8400 },{ market: "Haldia Market", km: 125, price: 8950 },],

Chilli: [{ market: "Barasat Mandi", km: 3, price: 6200 },{ market: "Madhyamgram", km: 7, price: 6050 },{ market: "Basirhat", km: 18, price: 6500 },{ market: "Kolkata Wholesale", km: 26, price: 6800 },{ market: "Howrah Mandi", km: 31, price: 6650 },{ market: "Behala Market", km: 24, price: 6550 },{ market: "Purulia Mandi", km: 290, price: 5800 },{ market: "Malda Mandi", km: 350, price: 6400 },{ market: "Darjeeling Market", km: 620, price: 6150 },{ market: "Haldia Market", km: 125, price: 6600 },],

Cucumber: [{ market: "Barasat Mandi", km: 3, price: 2100 },{ market: "Madhyamgram", km: 7, price: 2020 },{ market: "Basirhat", km: 18, price: 2200 },{ market: "Kolkata Wholesale", km: 26, price: 2350 },{ market: "Howrah Mandi", km: 31, price: 2280 },{ market: "Behala Market", km: 24, price: 2220 },{ market: "Purulia Mandi", km: 290, price: 1950 },{ market: "Malda Mandi", km: 350, price: 2180 },{ market: "Darjeeling Market", km: 620, price: 2080 },{ market: "Haldia Market", km: 125, price: 2250 },],

Pumpkin: [{ market: "Barasat Mandi", km: 3, price: 1700 },{ market: "Madhyamgram", km: 7, price: 1640 },{ market: "Basirhat", km: 18, price: 1800 },{ market: "Kolkata Wholesale", km: 26, price: 1920 },{ market: "Howrah Mandi", km: 31, price: 1870 },{ market: "Behala Market", km: 24, price: 1830 },{ market: "Purulia Mandi", km: 290, price: 1550 },{ market: "Malda Mandi", km: 350, price: 1760 },{ market: "Darjeeling Market", km: 620, price: 1680 },{ market: "Haldia Market", km: 125, price: 1850 },],};

function trendFor(base, seed = 1) {const out = [];let v = base * 0.94;for (let i = 6; i >= 0; i--) {const variation =Math.sin(seed * 1.7 + i * 1.3) * base * 0.012;v += variation;out.push({day: D-${i},price: Math.round(v),});}return out;}

/* ------------------------------ recommendation engine ------------------------------ */

function buildPlan(crop, soil, stage, rainDays, t) {let irrigationDays;if (soil === "Sandy") irrigationDays = 2;else if (soil === "Clay") irrigationDays = 6;else irrigationDays = 4;if (stage === "Flowering" || stage === "Grain fill") irrigationDays = Math.max(2, irrigationDays - 1);const overdue = rainDays >= irrigationDays;

const fertMap = {Sowing: "Basal dose: DAP + Urea (starter N-P)",Vegetative: "Top-dress Urea for leaf growth (split dose)",Flowering: "Potash-heavy mix to support flowering/tuber set","Grain fill": "Reduce N, light Potash top-up only",Maturity: "No further fertilizer — prepare for harvest",};

const pestMap = {Rice: "Watch for stem borer and leaf folder in humid weeks",Wheat: "Watch for aphids and yellow rust in cool, moist spells",Potato: "Watch for late blight after rain — check undersides of leaves",Maize: "Watch for fall armyworm on young whorls",Mustard: "Watch for aphid clusters on tender shoots",};

return {irrigation: overdue? Irrigate now — it's been ${rainDays} day(s) since last rain, ${crop} on ${soil.toLowerCase()} soil needs water every ~${irrigationDays} days at ${stage.toLowerCase()} stage.: Hold off for now — soil moisture should be adequate for ~${irrigationDays - rainDays} more day(s) on ${soil.toLowerCase()} soil.,fertilizer: fertMap[stage],pest: pestMap[crop],};}

/* ---------------------------------- app shell ---------------------------------- */

export default function App() {const [lang, setLang] = useState("en");const [tab, setTab] = useState("home");const t = STRINGS[lang];

return (<div style={{ fontFamily: "'Inter', sans-serif", background: "var(--cream)", minHeight: "100%", color: "var(--forest)" }}><style>{        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@500;600&family=Noto+Sans+Bengali:wght@500;600&display=swap');
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
     }</style>

  <TopBar t={t} lang={lang} setLang={setLang} appName={t.appName} tagline={t.tagline} />

  <div style={{ display: "flex", maxWidth: 1180, margin: "0 auto" }}>
    <SideNav t={t} tab={tab} setTab={setTab} />
    <main style={{ flex: 1, padding: "28px 24px 60px", minWidth: 0 }}>
      {tab === "home" && <HomeView t={t} setTab={setTab} lang={lang} />}
      {tab === "doctor" && <DoctorView t={t} />}
      {tab === "advisory" && <AdvisoryView t={t} />}
      {tab === "mandi" && <MandiView t={t} />}
      {tab === "assistant" && <AssistantView t={t} />}
    </main>
  </div>

  <MobileTabBar t={t} tab={tab} setTab={setTab} />
</div>

);}

/* ---------------------------------- top bar ---------------------------------- */

function TopBar({ t, lang, setLang }) {return (<header style={{background: "var(--forest)", color: "#fff", padding: "16px 24px",display: "flex", alignItems: "center", justifyContent: "space-between",position: "sticky", top: 0, zIndex: 20,}}><div style={{ display: "flex", alignItems: "center", gap: 12, maxWidth: 1180, width: "100%", margin: "0 auto", justifyContent: "space-between" }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{width: 38, height: 38, borderRadius: 10, background: "var(--wheat)",display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,}}><Sprout size={22} color="var(--forest)" strokeWidth={2.4} /></div><div><div className="display" style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.1 }}>{t.appName}</div><div style={{ fontSize: 11.5, color: "#C9D9C7", lineHeight: 1.2 }}>{t.tagline}</div></div></div><div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.08)", padding: 4, borderRadius: 999 }}><Globe size={14} style={{ marginLeft: 8, color: "#C9D9C7" }} />{LANGS.map((l) => (<buttonkey={l.code}onClick={() => setLang(l.code)}style={{border: "none", padding: "6px 12px", borderRadius: 999, fontSize: 12.5, fontWeight: 600,background: lang === l.code ? "var(--wheat)" : "transparent",color: lang === l.code ? "var(--forest)" : "#E7EFE3",transition: "all .15s",}}>{l.label}</button>))}</div></div></header>);}

/* ---------------------------------- side nav ---------------------------------- */

function NAV_ITEMS(t) {return [{ key: "home", label: t.nav.home, icon: Home },{ key: "doctor", label: t.nav.doctor, icon: Leaf },{ key: "advisory", label: t.nav.advisory, icon: Droplets },{ key: "mandi", label: t.nav.mandi, icon: TrendingUp },{ key: "assistant", label: t.nav.assistant, icon: MessageCircle },];}

function SideNav({ t, tab, setTab }) {const items = NAV_ITEMS(t);return (<nav style={{width: 208, flexShrink: 0, padding: "28px 12px", display: "none",}} className="side-nav-desktop">{items.map((it) => {const Icon = it.icon;const active = tab === it.key;return (<buttonkey={it.key}onClick={() => setTab(it.key)}style={{width: "100%", display: "flex", alignItems: "center", gap: 10,padding: "11px 14px", borderRadius: 10, border: "none", marginBottom: 4,background: active ? "var(--leaf-light)" : "transparent",color: active ? "var(--forest)" : "#5B6B5D",fontWeight: active ? 700 : 500, fontSize: 14, textAlign: "left",}}><Icon size={17} strokeWidth={2.2} />{it.label}</button>);})}<style>{@media (min-width: 860px) { .side-nav-desktop { display: block !important; } }}</style></nav>);}

function MobileTabBar({ t, tab, setTab }) {const items = NAV_ITEMS(t);return (<div style={{position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff",borderTop: "1px solid #E6E1D3", display: "flex", justifyContent: "space-around",padding: "6px 2px", zIndex: 30,}} className="mobile-tabbar">{items.map((it) => {const Icon = it.icon;const active = tab === it.key;return (<buttonkey={it.key}onClick={() => setTab(it.key)}style={{border: "none", background: "transparent", display: "flex", flexDirection: "column",alignItems: "center", gap: 2, padding: "6px 4px", color: active ? "var(--forest)" : "#9AA69B",fontSize: 10, fontWeight: 600, flex: 1,}}><Icon size={18} strokeWidth={active ? 2.6 : 2} />{it.label}</button>);})}<style>{@media (min-width: 860px) { .mobile-tabbar { display: none !important; } }}</style></div>);}

/* ---------------------------------- card shell ---------------------------------- */

function SectionHeader({ title, sub }) {return (<div style={{ marginBottom: 20 }}><h2 className="display" style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "var(--forest)" }}>{title}</h2>{sub && <p style={{ color: "#5B6B5D", fontSize: 14.5, marginTop: 6, maxWidth: 560, lineHeight: 1.5 }}>{sub}</p>}</div>);}

/* ---------------------------------- home ---------------------------------- */

function HomeView({ t, setTab, lang }) {const [weather, setWeather] = useState(null);const [market, setMarket] = useState(null);

useEffect(() => {async function loadHomeData() {try {const [weatherRes, marketRes] = await Promise.all([fetch("/api/weather?location=Kolkata"),fetch("/api/markets?crop=Potato"),]);

    const weatherData = await weatherRes.json();
    const marketData = await marketRes.json();

    setWeather(weatherData);
    setMarket(marketData);
  } catch (error) {
    console.error("Failed to load home data:", error);
  }
}

loadHomeData();

}, []);

const temperature = weather?.temperature ?? "--";const humidity = weather?.humidity ?? "--";const wind = weather?.wind_speed ?? "--";const rain = weather?.rain_probability ?? "--";

const bestMarket = market?.markets?.length? [...market.markets].sort((a, b) => b.price - a.price)[0]: null;

return (<div style={{ paddingBottom: 40 }}><div style={{background: "linear-gradient(135deg, var(--forest), #2C5238)",borderRadius: 18,padding: "26px 24px",color: "#fff",marginBottom: 22,position: "relative",overflow: "hidden",}}><Sunsize={90}style={{position: "absolute",right: -10,top: -20,color: "rgba(227,167,58,0.25)"}}/>

    <div style={{
      fontSize: 13,
      color: "#C9D9C7",
      fontWeight: 600,
      letterSpacing: 0.4
    }}>
      {t.weatherNote}
    </div>

    <h1
      className="display"
      style={{ fontSize: 26, margin: "6px 0 14px" }}
    >
      {t.greeting}
    </h1>

    <div style={{
      display: "flex",
      gap: 22,
      flexWrap: "wrap"
    }}>
      <WeatherStat
        icon={Sun}
        label={`${temperature}°C`}
        sub="Temperature"
      />

      <WeatherStat
        icon={Droplets}
        label={`${humidity}%`}
        sub="Humidity"
      />

      <WeatherStat
        icon={Wind}
        label={`${wind} km/h`}
        sub="Wind"
      />

      <WeatherStat
        icon={CloudRain}
        label={`${rain}%`}
        sub="Rain probability"
      />
    </div>
  </div>

  <SectionHeader title={t.quickStats} />

  <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 14,
    marginBottom: 30
  }}>
    <StatCard
      icon={Sprout}
      label={t.activeCrop}
      value="Potato — Flowering"
      color="var(--leaf)"
    />

    <StatCard
      icon={Droplets}
      label={t.nextTask}
      value="Check Water & Feed Plan"
      color="var(--sky)"
    />

    <StatCard
      icon={TrendingUp}
      label={t.marketTip}
      value={
        bestMarket
          ? `${bestMarket.market} ₹${bestMarket.price}/qtl`
          : "Loading market..."
      }
      color="var(--wheat)"
    />
  </div>

  <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 14
  }}>
    <NavTile
      icon={Leaf}
      title={t.doctorTitle}
      desc={t.doctorSub}
      onClick={() => setTab("doctor")}
    />

    <NavTile
      icon={Droplets}
      title={t.advisoryTitle}
      desc={t.advisorySub}
      onClick={() => setTab("advisory")}
    />

    <NavTile
      icon={TrendingUp}
      title={t.mandiTitle}
      desc={t.mandiSub}
      onClick={() => setTab("mandi")}
    />

    <NavTile
      icon={MessageCircle}
      title={t.assistantTitle}
      desc={t.assistantSub}
      onClick={() => setTab("assistant")}
    />
  </div>
</div>

);}

function WeatherStat({ icon: Icon, label, sub }) {return (<div style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon size={20} color="var(--wheat)" /><div><div style={{ fontWeight: 700, fontSize: 15 }}>{label}</div><div style={{ fontSize: 11, color: "#C9D9C7" }}>{sub}</div></div></div>);}

function StatCard({ icon: Icon, label, value, color }) {return (<div style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", border: "1px solid #ECE7D8" }}><div style={{ width: 34, height: 34, borderRadius: 9, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}><Icon size={17} color={color} /></div><div style={{ fontSize: 12, color: "#8A9389", fontWeight: 600 }}>{label}</div><div style={{ fontSize: 15, fontWeight: 700, marginTop: 2, color: "var(--forest)" }}>{value}</div></div>);}

function NavTile({ icon: Icon, title, desc, onClick }) {return (<button onClick={onClick} style={{textAlign: "left", background: "#fff", border: "1px solid #ECE7D8", borderRadius: 14,padding: "18px 18px", display: "flex", flexDirection: "column", gap: 10,}}><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--leaf-light)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={18} color="var(--leaf)" /></div><ChevronRight size={16} color="#9AA69B" /></div><div><div style={{ fontWeight: 700, fontSize: 15, color: "var(--forest)" }}>{title}</div><div style={{ fontSize: 12.5, color: "#8A9389", marginTop: 3, lineHeight: 1.4 }}>{desc}</div></div></button>);}

/* ---------------------------------- crop doctor ---------------------------------- */

function DoctorView({ t }) {const [status, setStatus] = useState("idle"); // idle | analyzing | doneconst [result, setResult] = useState(null);const [preview, setPreview] = useState(null);const fileRef = useRef(null);const canvasRef = useRef(null);

const analyzeImage = useCallback((dataUrl) => {const img = new Image();img.onload = () => {const canvas = canvasRef.current;const ctx = canvas.getContext("2d");const w = (canvas.width = 60);const h = (canvas.height = 60);ctx.drawImage(img, 0, 0, w, h);const data = ctx.getImageData(0, 0, w, h).data;let r = 0, g = 0, b = 0, n = 0;for (let i = 0; i < data.length; i += 4) {r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;}r /= n; g /= n; b /= n;

  // simple heuristic classification off average colour composition
  const greenness = g - (r + b) / 2;
  const brownBias = r - g;
  let key, conf;
  if (brownBias > 12 && r > 90) {
    key = "blight"; conf = Math.min(96, 62 + brownBias);
  } else if (greenness < 8 && r > g * 0.85) {
    key = "deficiency"; conf = Math.min(94, 60 + (8 - greenness));
  } else {
    key = "healthy"; conf = Math.min(97, 70 + greenness);
  }
  setResult({ key, conf: Math.round(Math.max(58, Math.min(97, conf))) });
  setStatus("done");
};
img.src = dataUrl;

}, []);

const handleFile = (e) => {const file = e.target.files?.[0];if (!file) return;const reader = new FileReader();reader.onload = () => {setPreview(reader.result);setStatus("analyzing");setResult(null);setTimeout(() => analyzeImage(reader.result), 900);};reader.readAsDataURL(file);};

const ADVICE = {healthy: { label: t.resultHealthy, color: "var(--leaf)", icon: CheckCircle2, tips: ["Continue current watering schedule", "Re-check in 5–7 days"] },deficiency: { label: t.resultDeficiency, color: "var(--wheat)", icon: AlertTriangle, tips: ["Apply split dose of Urea", "Recheck leaf colour in 4 days", "Avoid over-irrigating after application"] },blight: { label: t.resultBlight, color: "var(--danger)", icon: AlertTriangle, tips: ["Remove and destroy affected leaves", "Apply recommended fungicide", "Avoid overhead irrigation in evening"] },};

return (<div><SectionHeader title={t.doctorTitle} sub={t.doctorSub} /><canvas ref={canvasRef} style={{ display: "none" }} /><div style={{ display: "grid", gridTemplateColumns: "minmax(240px, 340px) 1fr", gap: 22, alignItems: "start" }}><div><divonClick={() => fileRef.current?.click()}style={{border: "2px dashed #C9D2C4", borderRadius: 16, aspectRatio: "1", background: "#fff",display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",gap: 10, cursor: "pointer", overflow: "hidden", position: "relative",}}>{preview ? (<img src={preview} alt="leaf" style={{ width: "100%", height: "100%", objectFit: "cover" }} />) : (<><Camera size={34} color="var(--leaf)" /><div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--forest)", padding: "0 24px", textAlign: "center" }}>{t.uploadCta}</div></>)}</div><input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: "none" }} /><buttononClick={() => fileRef.current?.click()}style={{marginTop: 12, width: "100%", background: "var(--forest)", color: "#fff", border: "none",borderRadius: 10, padding: "11px 0", fontWeight: 700, fontSize: 13.5, display: "flex",alignItems: "center", justifyContent: "center", gap: 8,}}><Upload size={15} /> {t.uploadCta}</button></div>

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
              <div>
                <div style={{ fontWeight: 700, fontSize: 17, color: "var(--forest)" }}>{a.label}</div>
                <div style={{ fontSize: 12.5, color: "#8A9389" }}>{t.confidence}: {result.conf}%</div>
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

);}

/* ---------------------------------- advisory ---------------------------------- */

function AdvisoryView({ t }) {const [crop, setCrop] = useState(CROPS[2]);const [soil, setSoil] = useState(SOILS[0]);const [stage, setStage] = useState(STAGES[2]);const [rainDays, setRainDays] = useState(3);const [plan, setPlan] = useState(null);const [loading, setLoading] = useState(false);

const onGenerate = async () => {setLoading(true);

try {
  const response = await fetch(
    `/api/recommendation?crop=${encodeURIComponent(crop)}&soil=${encodeURIComponent(soil)}&stage=${encodeURIComponent(stage)}&rainDays=${rainDays}`
  );

  const data = await response.json();
  setPlan(data);
} catch (error) {
  console.error("Recommendation error:", error);
  setPlan(null);
} finally {
  setLoading(false);
}

};

const Field = ({ label, children }) => (<div style={{ marginBottom: 16 }}><label style={{display: "block",fontSize: 12.5,fontWeight: 700,color: "#5B6B5D",marginBottom: 6}}>{label}</label>{children}</div>);

const selStyle = {width: "100%",padding: "10px 12px",borderRadius: 10,border: "1px solid #DCD5C2",fontSize: 14,background: "#fff",color: "var(--forest)"};

return (<div><SectionHeader
     title={t.advisoryTitle}
     sub={t.advisorySub}
   />

  <div style={{
    display: "grid",
    gridTemplateColumns: "minmax(240px,320px) 1fr",
    gap: 22,
    alignItems: "start"
  }}>

    <div style={{
      background: "#fff",
      border: "1px solid #ECE7D8",
      borderRadius: 16,
      padding: 20
    }}>

      <Field label={t.crop}>
        <select
          style={selStyle}
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
        >
          {CROPS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </Field>

      <Field label={t.soil}>
        <select
          style={selStyle}
          value={soil}
          onChange={(e) => setSoil(e.target.value)}
        >
          {SOILS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </Field>

      <Field label={t.stage}>
        <select
          style={selStyle}
          value={stage}
          onChange={(e) => setStage(e.target.value)}
        >
          {STAGES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </Field>

      <Field label={`${t.rain}: ${rainDays}`}>
        <input
          type="range"
          min="0"
          max="10"
          value={rainDays}
          onChange={(e) => setRainDays(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </Field>

      <button
        onClick={onGenerate}
        disabled={loading}
        style={{
          width: "100%",
          background: "var(--leaf)",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          padding: "12px 0",
          fontWeight: 700,
          fontSize: 14,
          marginTop: 6,
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? "Generating..." : t.generate}
      </button>
    </div>

    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 14
    }}>

      {!plan && !loading && (
        <div style={{
          background: "#fff",
          border: "1px solid #ECE7D8",
          borderRadius: 16,
          padding: 40,
          textAlign: "center",
          color: "#9AA69B"
        }}>
          <Droplets
            size={28}
            style={{ marginBottom: 10, opacity: 0.5 }}
          />
          <div style={{ fontSize: 14 }}>
            {t.advisorySub}
          </div>
        </div>
      )}

      {plan && (
        <>
          <PlanCard
            icon={Droplets}
            color="var(--sky)"
            title={t.irrigation}
            body={plan.irrigation}
          />

          <PlanCard
            icon={Sprout}
            color="var(--wheat)"
            title={t.fertilizer}
            body={plan.fertilizer}
          />

          <PlanCard
            icon={AlertTriangle}
            color="var(--danger)"
            title={t.pest}
            body={plan.pest}
          />
        </>
      )}
    </div>
  </div>
</div>

);}

function PlanCard({ icon: Icon, color, title, body }) {return (<div style={{ background: "#fff", border: "1px solid #ECE7D8", borderRadius: 14, padding: 18, display: "flex", gap: 14 }}><div style={{ width: 38, height: 38, borderRadius: 10, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon size={18} color={color} /></div><div><div style={{ fontWeight: 700, fontSize: 14.5, color: "var(--forest)", marginBottom: 4 }}>{title}</div><div style={{ fontSize: 13.5, color: "#5B6B5D", lineHeight: 1.6 }}>{body}</div></div></div>);}

/* ---------------------------------- mandi ---------------------------------- */

function MandiView({ t }) {const [crop, setCrop] = useState(CROPS[0]);const rows = MANDI_DATA[crop] || MANDI_DATA.Potato;

// Kolkata selected by defaultconst defaultMarket =rows.find((r) => r.market === "Kolkata Wholesale") || rows[0];

const [selectedMarket, setSelectedMarket] = useState(defaultMarket);

// When crop changes, select Kolkata againuseEffect(() => {const next =rows.find((r) => r.market === "Kolkata Wholesale") || rows[0];

setSelectedMarket(next);

}, [crop]);

const best = rows.reduce((a, b) => (b.price > a.price ? b : a),rows[0]);

const selected =selectedMarket || best;

const marketSeed =rows.findIndex((r) => r.market === selected.market) + 1;

const trend = trendFor(selected.price,marketSeed);

return (<div><SectionHeader
     title={t.mandiTitle}
     sub={t.mandiSub}
   />

  {/* CROP SELECTOR */}
  <div
    style={{
      display: "flex",
      gap: 8,
      marginBottom: 20,
      flexWrap: "wrap",
    }}
  >
    {CROPS.map((c) => (
      <button
        key={c}
        onClick={() => setCrop(c)}
        style={{
          padding: "8px 16px",
          borderRadius: 999,
          border:
            "1px solid " +
            (crop === c
              ? "var(--forest)"
              : "#DCD5C2"),
          background:
            crop === c
              ? "var(--forest)"
              : "#fff",
          color:
            crop === c
              ? "#fff"
              : "var(--forest)",
          fontWeight: 600,
          fontSize: 13,
          cursor: "pointer",
        }}
      >
        {c}
      </button>
    ))}
  </div>

  {/* SELECTED MARKET CARD */}
  <div
    style={{
      background:
        "linear-gradient(135deg, var(--wheat), #D68F2A)",
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      color: "#3A2A0E",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 12,
    }}
  >
    <div>
      <div
        style={{
          fontSize: 12.5,
          fontWeight: 700,
          opacity: 0.8,
        }}
      >
        {selected.market === best.market
          ? "BEST ESTIMATED PRICE"
          : "SELECTED MARKET"}
      </div>

      <div
        className="display"
        style={{
          fontSize: 26,
          fontWeight: 700,
        }}
      >
        ₹{selected.price}

        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {" "}
          {t.perQuintal}
        </span>
      </div>
    </div>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontWeight: 700,
        fontSize: 13.5,
      }}
    >
      <MapPin size={16} />

      {selected.market}
      {" · "}
      {selected.km} km {t.distance}
    </div>
  </div>

  {/* 7 DAY TREND */}
  <div
    style={{
      background: "#fff",
      border: "1px solid #ECE7D8",
      borderRadius: 16,
      padding: "18px 18px 8px",
      marginBottom: 20,
    }}
  >
    <div
      style={{
        fontSize: 13,
        fontWeight: 700,
        color: "#5B6B5D",
        marginBottom: 10,
      }}
    >
      {t.trend} — {selected.market}
    </div>

    <ResponsiveContainer
      width="100%"
      height={180}
    >
      <LineChart
        data={trend}
        margin={{
          left: -20,
          right: 10,
        }}
      >
        <CartesianGrid
          stroke="#F0ECDF"
          vertical={false}
        />

        <XAxis
          dataKey="day"
          tick={{
            fontSize: 11,
            fill: "#9AA69B",
          }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          tick={{
            fontSize: 11,
            fill: "#9AA69B",
          }}
          axisLine={false}
          tickLine={false}
          domain={[
            "dataMin - 50",
            "dataMax + 50",
          ]}
        />

        <Tooltip
          contentStyle={{
            borderRadius: 10,
            border: "1px solid #ECE7D8",
            fontSize: 12,
          }}
          formatter={(value) => [
            `₹${value}`,
            "Price",
          ]}
        />

        <Line
          type="monotone"
          dataKey="price"
          stroke="#4C7A51"
          strokeWidth={2.5}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>

  {/* MARKET LIST */}
  <div
    style={{
      background: "#fff",
      border: "1px solid #ECE7D8",
      borderRadius: 16,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        padding: "13px 18px",
        background: "#F8F6EF",
        fontSize: 12,
        fontWeight: 700,
        color: "#687469",
      }}
    >
      Select a market to view its 7-day trend
    </div>

    {rows.map((r, i) => {
      const isSelected =
        selected.market === r.market;

      const isBest =
        best.market === r.market;

      return (
        <button
          key={r.market}
          onClick={() =>
            setSelectedMarket(r)
          }
          style={{
            width: "100%",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            padding: "14px 18px",
            border: "none",
            borderBottom:
              i < rows.length - 1
                ? "1px solid #F0ECDF"
                : "none",
            background:
              isSelected
                ? "var(--leaf-light)"
                : "#fff",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <MapPin
              size={15}
              color={
                isSelected
                  ? "var(--leaf)"
                  : "#8A9389"
              }
            />

            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color:
                    "var(--forest)",
                }}
              >
                {r.market}

                {isBest && (
                  <span
                    style={{
                      marginLeft: 8,
                      fontSize: 10,
                      padding: "3px 7px",
                      borderRadius: 999,
                      background:
                        "#E9F3E8",
                      color:
                        "var(--leaf)",
                      fontWeight: 700,
                    }}
                  >
                    BEST
                  </span>
                )}
              </div>

              <div
                style={{
                  fontSize: 11.5,
                  color: "#9AA69B",
                }}
              >
                {r.km} km {t.distance}
              </div>
            </div>
          </div>

          <div
            style={{
              fontWeight: 700,
              fontSize: 15,
              color:
                "var(--forest)",
            }}
          >
            ₹{r.price}
          </div>
        </button>
      );
    })}
  </div>
</div>

);}

/* ---------------------------------- assistant ---------------------------------- */

const CANNED = {irrigate: {en: "For most crops, irrigate when the top 3–5 cm of soil feels dry. Check the Water & Feed Plan tab for a schedule tuned to your soil and crop stage.",hi: "ज़्यादातर फसलों में जब ऊपरी 3–5 सेमी मिट्टी सूखी लगे तब सिंचाई करें। सटीक योजना के लिए 'पानी व खाद योजना' टैब देखें।",bn: "বেশিরভাগ ফসলে মাটির উপরের ৩–৫ সেমি শুকিয়ে গেলে সেচ দিন। সঠিক পরিকল্পনার জন্য 'জল ও সার পরিকল্পনা' ট্যাব দেখুন।",},fertilizer: {en: "For potato, a balanced NPK basal dose at planting followed by a Potash top-up at tuber initiation works well. See the advisory tab for your exact stage.",hi: "आलू के लिए बुवाई के समय संतुलित NPK और कंद बनने पर पोटाश टॉप-अप अच्छा काम करता है। सटीक जानकारी के लिए सलाह टैब देखें।",bn: "আলুর জন্য রোপণের সময় সুষম NPK এবং কন্দ তৈরির সময় পটাশ টপ-আপ ভালো কাজ করে। বিস্তারিত জানতে পরামর্শ ট্যাব দেখুন।",},price: {en: "Check the Mandi Prices tab — it compares today's rate across your 4 nearest markets and highlights the best one.",hi: "मंडी भाव टैब देखें — यह आपकी 4 नज़दीकी मंडियों के आज के भाव दिखाता है और सबसे अच्छा भाव बताता है।",bn: "মান্ডি দর ট্যাব দেখুন — এটি আপনার ৪টি কাছের মান্ডির আজকের দাম তুলনা করে এবং সেরাটি দেখায়।",},fallback: {en: "I can help with irrigation timing, fertilizer schedules, pest alerts, and today's mandi prices. Try asking about one of those, or use the buttons below.",hi: "मैं सिंचाई का समय, खाद अनुसूची, कीट अलर्ट और आज के मंडी भाव में मदद कर सकता हूं। नीचे दिए बटन आज़माएं।",bn: "আমি সেচের সময়, সারের সময়সূচি, পোকার সতর্কতা এবং আজকের মান্ডি দর নিয়ে সাহায্য করতে পারি। নিচের বোতাম চেষ্টা করুন।",},};

function reply(text, lang) {const s = text.toLowerCase();if (s.includes("irrigat") || s.includes("water") || s.includes("सिंचाई") || s.includes("सेच") || s.includes("जल")) return CANNED.irrigate[lang];if (s.includes("fertil") || s.includes("खाद") || s.includes("सार")) return CANNED.fertilizer[lang];if (s.includes("price") || s.includes("mandi") || s.includes("भाव") || s.includes("दाम") || s.includes("दर")) return CANNED.price[lang];return CANNED.fallback[lang];}

function AssistantView({ t }) {const langKey =Object.keys(STRINGS).find((k) => STRINGS[k] === t) || "en";

const [messages, setMessages] = useState([{from: "bot",text: CANNED.fallback[langKey]}]);

const [input, setInput] = useState("");const [loading, setLoading] = useState(false);

const send = async (text) => {const msg = (text ?? input).trim();

if (!msg || loading) return;

setMessages((m) => [
  ...m,
  { from: "user", text: msg }
]);

setInput("");
setLoading(true);

try {
  const response = await fetch(
    `/api/assistant?question=${encodeURIComponent(msg)}`
  );

  const data = await response.json();

  setMessages((m) => [
    ...m,
    {
      from: "bot",
      text: data.answer || "Sorry, I could not answer that."
    }
  ]);
} catch (error) {
  console.error("Assistant API error:", error);

  setMessages((m) => [
    ...m,
    {
      from: "bot",
      text: "Sorry, I could not connect to KrishiMind right now."
    }
  ]);
} finally {
  setLoading(false);
}

};

return (<div><SectionHeader
     title={t.assistantTitle}
     sub={t.assistantSub}
   />

  <div style={{
    background: "#fff",
    border: "1px solid #ECE7D8",
    borderRadius: 16,
    display: "flex",
    flexDirection: "column",
    height: 440,
    maxWidth: 640
  }}>

    <div style={{
      flex: 1,
      overflowY: "auto",
      padding: 18,
      display: "flex",
      flexDirection: "column",
      gap: 10
    }}>
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

            maxWidth: "80%",
            fontSize: 13.5,
            lineHeight: 1.5
          }}
        >
          {m.text}
        </div>
      ))}

      {loading && (
        <div style={{
          alignSelf: "flex-start",
          background: "var(--leaf-light)",
          color: "var(--forest)",
          padding: "10px 14px",
          borderRadius: 14,
          fontSize: 13.5
        }}>
          KrishiMind is thinking...
        </div>
      )}
    </div>

    <div style={{
      padding: 12,
      borderTop: "1px solid #F0ECDF",
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }}>
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
            fontWeight: 600
          }}
        >
          {chip}
        </button>
      ))}
    </div>

    <div style={{
      padding: 12,
      borderTop: "1px solid #F0ECDF",
      display: "flex",
      gap: 8
    }}>
      <button
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          border: "1px solid #DCD5C2",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}
        title="Voice input (demo)"
      >
        <Mic
          size={17}
          color="var(--leaf)"
        />
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
          fontSize: 13.5
        }}
      />

      <button
        onClick={() => send()}
        disabled={loading}
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
          opacity: loading ? 0.6 : 1
        }}
      >
        <Send
          size={16}
          color="#fff"
        />
      </button>
    </div>
  </div>
</div>

);}
