import { useEffect, useMemo, useState } from "react";
import "./styles.css";
import carHero from "./assets/phev7_blue.png";

const ENERGY_RATE = 0.2703;
const CAPACITY_RATE = 0.0455;
const NETWORK_RATE = 0.1285;
const EFFICIENT_INCENTIVE = 0.21;
const KWTBB_RATE = 0.016;
const SERVICE_TAX_RATE = 0.08;
const ST_THRESHOLD_KWH = 600;

const variantSpecs = {
  Prime: {
    batteryKwh: 18.4,
    evRangeKm: 105,
  },
  Premium: {
    batteryKwh: 18.4,
    evRangeKm: 105,
  },
  "Premium Plus": {
    batteryKwh: 29.8,
    evRangeKm: 170,
  },
};

const guideArticles = [
  {
    title: "When should I charge my PHEV?",
    category: "Charging",
    content:
      "Charge when you actually need it. For moderate daily driving, charging to 60% to 70% is often enough and may help control your home electricity bill.",
  },
  {
    title: "Should I charge to 100% every night?",
    category: "Charging",
    content:
      "Not always. Full charging every night is useful only if you need the full EV range the next day. Partial charging is often more practical.",
  },
  {
    title: "How often should I charge my PHEV?",
    category: "Charging",
    content:
      "Charge based on your daily usage, not by habit. If your daily trips are short, charging every 1 to 2 days may already be enough.",
  },
  {
    title: "Should I charge every night?",
    category: "Charging",
    content:
      "Not necessarily. Charging every night is convenient but not always needed. If you still have enough battery for the next day, you can skip charging.",
  },
  {
    title: "What is the best charging percentage for daily use?",
    category: "Charging",
    content:
      "For daily driving, charging to around 60% to 80% is usually enough. Full charging is more useful when you expect longer trips.",
  },
  {
    title: "When should I charge to 100%?",
    category: "Charging",
    content:
      "Charge to 100% when you plan to use the full EV range, such as long commutes or multiple trips in a day.",
  },
  {
    title: "Is it okay to leave the car plugged in overnight?",
    category: "Charging",
    content:
      "Yes. Charging overnight is one of the most common and convenient ways to use a PHEV at home.",
  },
  {
    title: "Should I charge immediately after driving?",
    category: "Charging",
    content:
      "You can, but it is not required. Charging based on your next usage is more important than charging immediately after every drive.",
  },
  {
    title: "What is the difference between home charging and public charging?",
    category: "Charging",
    content:
      "Home charging is usually slower but more convenient and cheaper. Public charging is faster and useful when you need a quick top-up.",
  },
  {
    title: "Is slow charging better for daily use?",
    category: "Charging",
    content:
      "Yes. For daily use, slow home charging is usually sufficient and more practical for regular charging habits.",
  },
  {
    title: "What happens if I stop charging halfway?",
    category: "Charging",
    content:
      "Nothing harmful happens. Partial charging is normal and often recommended for daily driving.",
  },
  {
    title: "How long does a full charge usually take?",
    category: "Charging",
    content:
      "Charging time depends on your charger type. Home charging usually takes several hours, while faster chargers can reduce the time significantly.",
  },
  {
    title: "Should I worry about charging too frequently?",
    category: "Charging",
    content:
      "No. Frequent charging is part of normal PHEV usage. What matters more is charging based on actual driving needs.",
  },
  {
    title: "Can I rely only on petrol and not charge?",
    category: "Charging",
    content:
      "Yes, the car will still run using petrol. However, you lose the cost-saving and efficiency benefits of using electric driving.",
  },
  {
    title: "What is the simplest charging habit for beginners?",
    category: "Charging",
    content:
      "A simple habit is to charge when needed, avoid unnecessary full charges, and use home charging as your main routine.",
  },
  {
    title: "Should I charge before a long trip?",
    category: "Charging",
    content:
      "Yes, if possible. Starting with a charged battery helps improve efficiency and gives you more flexibility during the trip.",
  },
  {
    title: "How do I know if I need to charge today?",
    category: "Charging",
    content:
      "Check your remaining battery and think about your next trip. If your battery can cover your expected driving, charging may not be necessary.",
  },
  {
    title: "Does charging increase my electricity bill a lot?",
    category: "Charging",
    content:
      "Charging adds to your home usage, but the overall cost is usually still lower than petrol, especially with efficient charging habits.",
  },

  {
    title: "What happens when the battery gets low?",
    category: "Battery",
    content:
      "The petrol engine supports the car automatically. A PHEV does not become unusable just because the battery is low.",
  },
  {
    title: "Is it okay to charge every day?",
    category: "Battery",
    content:
      "Yes. Daily charging is normal for a PHEV, especially if you use the car often. What matters more is charging based on your actual driving needs rather than charging full all the time unnecessarily.",
  },
  {
    title: "Should I always charge to 100%?",
    category: "Battery",
    content:
      "Not always. If your next day's driving is short or moderate, charging to 60% to 80% may already be enough. Full charging makes more sense when you expect heavier use.",
  },
  {
    title: "Does AC use battery power?",
    category: "Battery",
    content:
      "Yes. Air conditioning, especially in hot weather, can reduce EV-only efficiency. It does not usually cause a major problem, but it can shorten the electric range.",
  },
  {
    title: "Does highway driving use battery faster?",
    category: "Battery",
    content:
      "Usually yes. Higher speed tends to consume electric energy faster than steady city driving, so EV-only range is usually lower on highways.",
  },
  {
    title: "Does slow driving save battery?",
    category: "Battery",
    content:
      "Usually yes. Smooth city driving, gentle acceleration, and lower speeds generally help the battery last longer than aggressive driving.",
  },
  {
    title: "Is fast charging bad for the battery?",
    category: "Battery",
    content:
      "Fast charging is useful, especially when you need convenience, but frequent fast charging all the time is generally not as gentle as normal slower charging. For regular daily use, home charging is usually the better habit.",
  },
  {
    title: "Is home charging better for daily use?",
    category: "Battery",
    content:
      "Yes. Home charging is usually the most practical and comfortable way to keep your PHEV ready for daily driving, especially if you can charge overnight.",
  },
  {
    title: "Why does my battery percentage drop faster some days?",
    category: "Battery",
    content:
      "Battery use can vary depending on driving style, speed, traffic, air conditioning, terrain, passenger load, and whether the trip is short or long.",
  },
  {
    title: "Should I worry if I do not charge for a few days?",
    category: "Battery",
    content:
      "Not usually. A PHEV still has petrol backup, so the car remains usable. You simply lose some EV benefit until you charge again.",
  },
  {
    title: "What is the best battery habit for a new owner?",
    category: "Battery",
    content:
      "A simple habit is to charge based on your next day's needs, avoid unnecessary full charging every night, and use home charging as your regular routine.",
  },
  {
    title: "Will battery size change how I use the car?",
    category: "Battery",
    content:
      "Yes. A larger battery gives you more EV-only flexibility, but the best usage habit is still the same: charge according to your driving pattern and let the hybrid system help when needed.",
  },
  {
    title: "Can I keep using the car even if I forget to charge?",
    category: "Battery",
    content:
      "Yes. That is one of the main advantages of a PHEV. If the battery is low, the petrol engine can continue supporting your journey.",
  },
  {
    title: "What causes battery efficiency to feel lower?",
    category: "Battery",
    content:
      "Common reasons include high speed, heavy air conditioning use, steep roads, aggressive acceleration, extra vehicle load, and charging habits that do not match your driving needs.",
  },
  {
    title: "What battery info should I check on the screen?",
    category: "Battery",
    content:
      "As a new owner, focus on battery percentage, estimated EV range, energy flow, charging status, and any charging-related settings shown on the main screen.",
  },

  {
    title: "How many driving modes does the e.MAS 7 PHEV have?",
    category: "Modes",
    content:
      "The brochure shows 3 driver-selectable driving modes: Pure, Hybrid, and Power. These are the main modes you choose directly.",
  },
  {
    title: "What does Pure mode do?",
    category: "Modes",
    content:
      "Pure mode focuses on electric driving. It is best for shorter daily trips, smoother city driving, and situations where you want quieter and cheaper EV-style driving.",
  },
  {
    title: "When should I use Pure mode?",
    category: "Modes",
    content:
      "Use Pure mode for short city trips, nearby errands, school runs, and regular daily driving when you still have enough battery available.",
  },
  {
    title: "What does Hybrid mode do?",
    category: "Modes",
    content:
      "Hybrid mode lets the car manage battery and engine more intelligently for mixed driving. It is usually the easiest everyday mode when your route includes different speeds or longer distances.",
  },
  {
    title: "When should I use Hybrid mode?",
    category: "Modes",
    content:
      "Use Hybrid mode for mixed city and highway driving, daily commuting, or anytime you want the car to balance efficiency and convenience automatically.",
  },
  {
    title: "What does Power mode do?",
    category: "Modes",
    content:
      "Power mode is for stronger performance and quicker response. It is more useful when you want more urgent acceleration rather than maximum efficiency.",
  },
  {
    title: "When should I use Power mode?",
    category: "Modes",
    content:
      "Use Power mode when overtaking, joining faster traffic, climbing steeper routes, or when you want a more responsive driving feel.",
  },
  {
    title: "Which mode is best for daily use?",
    category: "Modes",
    content:
      "For many drivers, Hybrid mode is the safest all-round choice for daily use. Pure mode is best when you want to maximize electric driving, while Power mode is more situational.",
  },
  {
    title: "Which mode saves the most energy?",
    category: "Modes",
    content:
      "Pure mode is usually the best choice for maximizing electric-only use in suitable daily driving conditions. Smooth driving habits still matter whichever mode you use.",
  },
  {
    title: "Do I need to keep changing modes all the time?",
    category: "Modes",
    content:
      "Not necessarily. Many owners can leave the car in Hybrid mode most of the time, then switch to Pure for shorter EV-focused trips or Power when stronger acceleration is needed.",
  },
  {
    title: "What is the difference between driving modes and power transitions?",
    category: "Modes",
    content:
      "Driving modes are the ones you select yourself: Pure, Hybrid, and Power. Power transitions are the automatic ways the car uses battery and engine in the background while you drive.",
  },
  {
    title: "What are the automatic power transitions?",
    category: "Modes",
    content:
      "The brochure describes four automatic operating states: Electric-only drive, Range-extended electric drive, Direct-engine drive, and Dual-powered drive.",
  },
  {
    title: "What is Electric-only drive?",
    category: "Modes",
    content:
      "This is when the wheels are driven only by the electric motor. The brochure links this to higher battery state of charge and city driving situations.",
  },
  {
    title: "What is Range-extended electric drive?",
    category: "Modes",
    content:
      "This is when the engine generates power for the motor and battery while the wheels are still driven by the motor. It is part of the car's automatic energy management.",
  },
  {
    title: "What is Direct-engine drive?",
    category: "Modes",
    content:
      "This is when the wheels are driven by the engine. The brochure associates this with lower battery state of charge and highway cruising conditions.",
  },
  {
    title: "What is Dual-powered drive?",
    category: "Modes",
    content:
      "This is when the engine and electric motor work together to drive the wheels. The brochure links this to harder acceleration and overtaking situations.",
  },
  {
    title: "What is the easiest way for a new owner to use modes?",
    category: "Modes",
    content:
      "Start simple: use Hybrid as your default, Pure for short EV-friendly trips, and Power only when you want stronger response. Let the car handle the background transitions automatically.",
  },

  {
    title: "Why should I watch 600 kWh at home?",
    category: "Savings",
    content:
      "Higher household usage can increase the overall bill impact. If your charging pushes your home usage much higher, the cost benefit becomes less strong.",
  },
  {
    title: "Is a PHEV still worth it if my bill increases?",
    category: "Savings",
    content:
      "Usually yes, especially if your previous petrol cost was high. The portal compares your estimated EV charging cost against your current fuel spending.",
  },

  {
    title: "How should I prepare for a long trip?",
    category: "Long Trip",
    content:
      "Start with a good charge if possible, but do not worry too much. A PHEV still has petrol backup, which makes long-distance travel easier than a full EV.",
  },

  {
    title: "What is the simplest way to use a PHEV?",
    category: "Basics",
    content:
      "Charge when useful, drive normally, use EV for short trips, and let Hybrid mode help for mixed or longer journeys.",
  },

  {
    title: "How do I start using the main screen?",
    category: "Screen & App",
    content:
      "Start by getting familiar with the home screen, climate controls, navigation, media, and vehicle settings. The main screen is the control center for many daily functions inside the car.",
  },
  {
    title: "What should I set up first after getting the car?",
    category: "Screen & App",
    content:
      "Set up the Proton app, pair your phone, check connectivity, learn the shortcut icons, test voice command, and review vehicle settings before your first regular drive.",
  },
  {
    title: "Which functions are controlled from the mobile app?",
    category: "Screen & App",
    content:
      "The app is typically used for remote access, status checking, and convenient pre-drive controls. It is useful for checking battery or vehicle information without sitting inside the car.",
  },
  {
    title: "Which functions should I use from the car screen?",
    category: "Screen & App",
    content:
      "Use the in-car screen for navigation, media, climate, driving information, camera view, and settings that you need while seated in the vehicle.",
  },
  {
    title: "How do I use the voice assistant?",
    category: "Screen & App",
    content:
      "Use voice command for simple hands-free actions like navigation, media, or climate adjustments. It is helpful when you want to reduce touching the screen while driving.",
  },
  {
    title: "Why does the car feel app-driven?",
    category: "Screen & App",
    content:
      "Because many convenience features are connected digitally. The screen manages in-car functions, while the mobile app extends access and monitoring from outside the car.",
  },
  {
    title: "What should I learn first on the screen as a new owner?",
    category: "Screen & App",
    content:
      "Focus first on home screen shortcuts, battery and energy information, charging-related info, navigation, climate control, phone connection, and settings.",
  },
];

const guideCategories = [
  "All",
  "Charging",
  "Battery",
  "Modes",
  "Savings",
  "Long Trip",
  "Basics",
  "Screen & App",
];

function estimateBillFromKwh(totalKwh) {
  const safeKwh = Number(totalKwh) || 0;

  const basePerKwh =
    ENERGY_RATE + CAPACITY_RATE + NETWORK_RATE - EFFICIENT_INCENTIVE;

  const subtotal = safeKwh * basePerKwh;
  const kwtbb = subtotal * KWTBB_RATE;
  const serviceTax =
    safeKwh > ST_THRESHOLD_KWH ? subtotal * SERVICE_TAX_RATE : 0;
  const totalBill = subtotal + kwtbb + serviceTax;

  return {
    subtotal,
    kwtbb,
    serviceTax,
    totalBill,
    effectiveRate: safeKwh > 0 ? totalBill / safeKwh : 0,
  };
}

function formatMoney(value) {
  return `RM ${Number(value || 0).toFixed(2)}`;
}

function formatKwh(value) {
  return `${Number(value || 0).toFixed(2)} kWh`;
}

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  const [selectedVariant, setSelectedVariant] = useState("Premium");
  const [batteryKwh, setBatteryKwh] = useState(variantSpecs.Premium.batteryKwh);
  const [evRangeKm, setEvRangeKm] = useState(variantSpecs.Premium.evRangeKm);
  const [householdKwh, setHouseholdKwh] = useState(329);
  const [chargesPerMonth, setChargesPerMonth] = useState(15);
  const [chargePercent, setChargePercent] = useState(70);
  const [monthlyPetrolSpend, setMonthlyPetrolSpend] = useState(350);
  const [petrolCostPerKm, setPetrolCostPerKm] = useState(0.18);
  const [carName, setCarName] = useState("PROTON e.MAS 7 PHEV Premium");
  const [customRate, setCustomRate] = useState("");

  const [guideSearch, setGuideSearch] = useState("");
  const [guideCategory, setGuideCategory] = useState("All");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setBatteryKwh(variantSpecs[variant].batteryKwh);
    setEvRangeKm(variantSpecs[variant].evRangeKm);
    setCarName(`PROTON e.MAS 7 PHEV ${variant}`);
  };

  const results = useMemo(() => {
    const safeBatteryKwh = Number(batteryKwh) || 0;
    const safeEvRangeKm = Number(evRangeKm) || 0;
    const safeHouseholdKwh = Number(householdKwh) || 0;
    const safeChargesPerMonth = Number(chargesPerMonth) || 0;
    const safeChargePercent = Number(chargePercent) || 0;
    const safeMonthlyPetrolSpend = Number(monthlyPetrolSpend) || 0;
    const safeCustomRate = Number(customRate) || 0;
    const safePetrolCostPerKm = Number(petrolCostPerKm) || 0;

    const chargeKwh = safeBatteryKwh * (safeChargePercent / 100);
    const monthlyEvKwh = chargeKwh * safeChargesPerMonth;
    const newTotalKwh = safeHouseholdKwh + monthlyEvKwh;

    let incrementalEvCost = 0;
    let currentBill;
    let newBill;
    let rateSource = "Estimated tariff model";

    if (safeCustomRate > 0) {
      const currentCost = safeHouseholdKwh * safeCustomRate;
      const newCost = newTotalKwh * safeCustomRate;

      incrementalEvCost = newCost - currentCost;

      currentBill = {
        totalBill: currentCost,
        effectiveRate: safeCustomRate,
      };
      newBill = {
        totalBill: newCost,
        effectiveRate: safeCustomRate,
      };
      rateSource = "Custom user rate";
    } else {
      currentBill = estimateBillFromKwh(safeHouseholdKwh);
      newBill = estimateBillFromKwh(newTotalKwh);
      incrementalEvCost = newBill.totalBill - currentBill.totalBill;
    }

    const costPerCharge =
      safeChargesPerMonth > 0 ? incrementalEvCost / safeChargesPerMonth : 0;

    const estimatedEvRangePerFullCharge = safeEvRangeKm;
    const estimatedEvRangePerActualCharge =
      estimatedEvRangePerFullCharge * (safeChargePercent / 100);

    const evCostPerKm =
      estimatedEvRangePerActualCharge > 0
        ? costPerCharge / estimatedEvRangePerActualCharge
        : 0;

    const savingsPerKm = safePetrolCostPerKm - evCostPerKm;

    let zone = "Safe";
    let zoneClass = "safe";
    let advice = "You can charge normally this month.";
    let chargeLevel = "Charge normally";

    if (newTotalKwh >= 500 && newTotalKwh < 600) {
      zone = "Watch";
      zoneClass = "watch";
      advice =
        "You are getting close to 600 kWh. Partial charging is a smarter option.";
      chargeLevel = "Partial charging is better";
    } else if (newTotalKwh >= 600) {
      zone = "High";
      zoneClass = "high";
      advice =
        "You are likely above 600 kWh. Your total bill impact will rise more noticeably.";
      chargeLevel = "Avoid full nightly charging";
    }

    const estimatedSavings = safeMonthlyPetrolSpend - incrementalEvCost;
    const recommendChargeTonight =
      newTotalKwh < 500
        ? "YES - charging tonight is still efficient."
        : newTotalKwh < 600
        ? "YES - but partial charging is better."
        : "Maybe not full. Consider a smaller charge tonight.";

    return {
      chargeKwh,
      monthlyEvKwh,
      newTotalKwh,
      currentBill,
      newBill,
      incrementalEvCost,
      costPerCharge,
      estimatedSavings,
      zone,
      zoneClass,
      advice,
      recommendChargeTonight,
      chargeLevel,
      rateSource,
      estimatedEvRangePerFullCharge,
      estimatedEvRangePerActualCharge,
      evCostPerKm,
      savingsPerKm,
      petrolCostPerKm: safePetrolCostPerKm,
    };
  }, [
    batteryKwh,
    evRangeKm,
    householdKwh,
    chargesPerMonth,
    chargePercent,
    monthlyPetrolSpend,
    petrolCostPerKm,
    customRate,
  ]);

  const filteredGuides = useMemo(() => {
    return guideArticles.filter((article) => {
      const matchesCategory =
        guideCategory === "All" || article.category === guideCategory;

      const q = guideSearch.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        article.title.toLowerCase().includes(q) ||
        article.content.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [guideCategory, guideSearch]);

  const formattedDateTime = now.toLocaleString("en-MY", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const billDifference =
    (results?.newBill?.totalBill || 0) - (results?.currentBill?.totalBill || 0);

  const smartStatusText =
    results.zone === "Safe"
      ? "Safe charging plan"
      : results.zone === "Watch"
      ? "Watch household usage"
      : "High tariff risk";

  const recommendedMode =
    selectedVariant === "Premium Plus" && chargePercent >= 80
      ? "Pure / Hybrid"
      : chargePercent >= 60
      ? "Hybrid"
      : "Hybrid";

  const tabs = [
    { key: "home", label: "Home", icon: "🏠" },
    { key: "charge", label: "Charge", icon: "⚡" },
    { key: "savings", label: "Savings", icon: "📊" },
    { key: "guide", label: "Guide", icon: "📘" },
  ];

  return (
    <div className="app-shell">
      <div className="app-container">
        <header className="topbar">
          <div className="topbar-row">
            <div>
              <p className="eyebrow">SmartDrive PHEV</p>
              <h1>New owner companion</h1>
            </div>

            <div className="datetime">{formattedDateTime}</div>
          </div>

          <p className="subtext">Simple home charging and savings guide</p>

          <div className={`smart-status ${results.zoneClass}`}>
            <span className={`signal-dot ${results.zoneClass}`} />
            <span>{smartStatusText}</span>
          </div>
        </header>

        <main className="content">
          {activeTab === "home" && (
  <>
    <section className="tesla-hero">
      <div className="tesla-hero-bg" />
      <div className="tesla-hero-content">
        <div className="tesla-hero-top">
          <div>
            <p className="eyebrow">SmartDrive PHEV</p>
            <h2 className="tesla-title">{carName}</h2>
            <p className="tesla-subtitle">
              {selectedVariant} • {batteryKwh} kWh • Official EV range {evRangeKm} km
            </p>
          </div>

          <div className={`tesla-status ${results.zoneClass}`}>
            <span className={`signal-dot ${results.zoneClass}`} />
            <span>{smartStatusText}</span>
          </div>
        </div>

        <div className="tesla-hero-main">
          <div className="tesla-left">
            <div className="tesla-battery-card">
              <div className="tesla-battery-header">
                <span>Charge target</span>
                <strong>{chargePercent}%</strong>
              </div>

              <div className="battery-track">
                <div
                  className="battery-fill"
                  style={{ width: `${chargePercent}%` }}
                />
              </div>

              <div className="battery-meta">
                <span>Estimated range after charge</span>
                <strong>{results.estimatedEvRangePerActualCharge.toFixed(0)} km</strong>
              </div>
            </div>

            <div className="tesla-mini-stats">
              <div className="tesla-mini-card">
                <small>Cost per charge</small>
                <strong>{formatMoney(results.costPerCharge)}</strong>
              </div>

              <div className="tesla-mini-card">
                <small>EV cost per km</small>
                <strong>RM {results.evCostPerKm.toFixed(2)}</strong>
              </div>

              <div className="tesla-mini-card">
                <small>Savings per km</small>
                <strong>RM {results.savingsPerKm.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          <div className="tesla-right">
            <img
              src={carHero}
              alt="PROTON e.MAS 7 PHEV"
              className="tesla-car"
            />
          </div>
        </div>
      </div>
    </section>

    <section className="dashboard-grid">
      <section className="tesla-panel primary-panel">
        <div className="panel-top">
          <p className="panel-label">Smart assistant</p>
          <span className="panel-chip">Live</span>
        </div>

        <h3 className="panel-title">{results.recommendChargeTonight}</h3>
        <p className="panel-text">{results.advice}</p>

        <div className="assistant-grid">
          <div className="assistant-box">
            <small>Recommended target</small>
            <strong>{chargePercent}%</strong>
          </div>
          <div className="assistant-box">
            <small>Best mode today</small>
            <strong>{recommendedMode}</strong>
          </div>
          <div className="assistant-box">
            <small>Projected usage</small>
            <strong>{formatKwh(results.newTotalKwh)}</strong>
          </div>
          <div className="assistant-box">
            <small>Rate source</small>
            <strong>{results.rateSource}</strong>
          </div>
        </div>
      </section>

      <section className="tesla-panel bill-panel">
        <div className="panel-top">
          <p className="panel-label">Bill impact</p>
          <span className="panel-chip">This month</span>
        </div>

        <div className="bill-row-modern">
          <div className="bill-modern-box">
            <small>Current</small>
            <strong>{formatMoney(results.currentBill.totalBill)}</strong>
          </div>

          <div className="bill-modern-divider" />

          <div className="bill-modern-box">
            <small>Projected</small>
            <strong>{formatMoney(results.newBill.totalBill)}</strong>
          </div>
        </div>

        <div className="bill-diff">
          <span>Difference</span>
          <strong>{formatMoney(billDifference)}</strong>
        </div>
      </section>
    </section>

    <section className="tesla-strip">
      <div className="strip-card">
        <small>Monthly EV cost</small>
        <strong>{formatMoney(results.incrementalEvCost)}</strong>
      </div>

      <div className="strip-card">
        <small>Added EV kWh</small>
        <strong>{formatKwh(results.monthlyEvKwh)}</strong>
      </div>

      <div className="strip-card">
        <small>Effective rate</small>
        <strong>RM {results.newBill.effectiveRate.toFixed(3)}</strong>
      </div>

      <div className="strip-card positive-strip">
        <small>Estimated monthly savings</small>
        <strong>{formatMoney(results.estimatedSavings)}</strong>
      </div>
    </section>
  </>
)}

          {activeTab === "charge" && (
            <>
              <section className="card premium-card">
                <div className="card-header">
                  <p className="label">Charging inputs</p>
                  <span className="glass-chip">Interactive</span>
                </div>

                <div className="form-grid">
                  <div className="field">
                    <label>Car name</label>
                    <input
                      type="text"
                      value={carName}
                      onChange={(e) => setCarName(e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label>
                      Select Variant (affects features, not always battery)
                    </label>
                    <select
                      value={selectedVariant}
                      onChange={(e) => handleVariantChange(e.target.value)}
                    >
                      {Object.keys(variantSpecs).map((variant) => (
                        <option key={variant} value={variant}>
                          {variant}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field">
                    <label>Battery size (kWh)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={batteryKwh}
                      onChange={(e) => setBatteryKwh(e.target.value)}
                    />
                    <p className="muted">
                      Prime and Premium share the same battery size. Differences
                      are mainly features.
                    </p>
                  </div>

                  <div className="field">
                    <label>Official EV range (km)</label>
                    <input type="number" value={evRangeKm} readOnly />
                    <p className="muted">
                      Based on brochure/specification value for the selected
                      variant.
                    </p>
                  </div>

                  <div className="field">
                    <label>Electricity rate (RM per kWh)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 0.55 (leave empty for auto)"
                      value={customRate}
                      onChange={(e) => setCustomRate(e.target.value)}
                    />
                    <p className="muted">
                      Leave empty to use estimated TNB tariff. Enter your actual
                      rate if you know it.
                    </p>
                  </div>

                  <div className="field">
                    <label>Current household usage (kWh)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={householdKwh}
                      onChange={(e) => setHouseholdKwh(e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label>Charging sessions per month</label>
                    <input
                      type="number"
                      value={chargesPerMonth}
                      onChange={(e) => setChargesPerMonth(e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label>Charge percentage each time (%)</label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={chargePercent}
                      onChange={(e) => setChargePercent(e.target.value)}
                    />
                    <div className="range-readout">{chargePercent}%</div>
                  </div>

                  <div className="field">
                    <label>Monthly petrol spend now (RM)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={monthlyPetrolSpend}
                      onChange={(e) => setMonthlyPetrolSpend(e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label>Petrol cost per km (RM)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={petrolCostPerKm}
                      onChange={(e) => setPetrolCostPerKm(e.target.value)}
                    />
                    <p className="muted">
                      Example: 0.18 means RM0.18 per km for your current petrol
                      car.
                    </p>
                  </div>
                </div>
              </section>

              <section className="card premium-card">
                <p className="label">Charging result</p>
                <div className="summary-list">
                  <div className="summary-row">
                    <span>kWh per charge</span>
                    <strong>{formatKwh(results.chargeKwh)}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Cost per charge</span>
                    <strong>{formatMoney(results.costPerCharge)}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Monthly EV charging usage</span>
                    <strong>{formatKwh(results.monthlyEvKwh)}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Monthly added electricity cost</span>
                    <strong>{formatMoney(results.incrementalEvCost)}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Estimated EV range this charge</span>
                    <strong>
                      {results.estimatedEvRangePerActualCharge.toFixed(0)} km
                    </strong>
                  </div>
                  <div className="summary-row">
                    <span>Rate source</span>
                    <strong>{results.rateSource}</strong>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab === "savings" && (
            <>
              <section className="card premium-card savings-hero">
                <p className="label">Savings comparison</p>
                <div className="big-number">
                  {formatMoney(results.estimatedSavings)}
                </div>
                <p className="muted">
                  Estimated monthly savings compared with your current petrol
                  spend.
                </p>
              </section>

              <section className="card premium-card">
                <div className="summary-list">
                  <div className="summary-row">
                    <span>Current monthly petrol spend</span>
                    <strong>{formatMoney(monthlyPetrolSpend)}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Estimated EV charging cost</span>
                    <strong>{formatMoney(results.incrementalEvCost)}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Estimated savings</span>
                    <strong>{formatMoney(results.estimatedSavings)}</strong>
                  </div>
                  <div className="summary-row">
                    <span>EV cost per km</span>
                    <strong>RM {results.evCostPerKm.toFixed(2)}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Petrol cost per km</span>
                    <strong>RM {results.petrolCostPerKm.toFixed(2)}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Savings per km</span>
                    <strong>RM {results.savingsPerKm.toFixed(2)}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Official EV range</span>
                    <strong>{evRangeKm} km</strong>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab === "guide" && (
            <>
              <section className="card premium-card">
                <div className="card-header">
                  <p className="label">Guide search</p>
                  <span className="glass-chip">
                    {filteredGuides.length} results
                  </span>
                </div>

                <div className="field">
                  <label>Search guide topics</label>
                  <input
                    type="text"
                    placeholder="Try: charge, hybrid, battery, 600 kWh..."
                    value={guideSearch}
                    onChange={(e) => setGuideSearch(e.target.value)}
                  />
                </div>

                <div className="chip-row">
                  {guideCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`filter-chip ${
                        guideCategory === cat ? "active-chip" : ""
                      }`}
                      onClick={() => setGuideCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </section>

              {guideCategory === "Battery" && (
                <section className="card premium-card">
                  <p className="label">Battery basics</p>
                  <p className="muted">
                    Focus on three things first: charge based on need,
                    understand what happens when battery is low, and know that
                    driving style affects EV efficiency.
                  </p>
                </section>
              )}

              {guideCategory === "Charging" && (
                <section className="card premium-card">
                  <p className="label">Charging basics</p>
                  <p className="muted">
                    Charge based on your daily needs, not by habit. Partial
                    charging is often enough, and home charging is usually the
                    most practical routine.
                  </p>
                </section>
              )}

              {guideCategory === "Modes" && (
                <section className="card premium-card">
                  <p className="label">Modes basics</p>
                  <p className="muted">
                    The car gives you 3 driving modes you choose yourself:
                    Pure, Hybrid, and Power. In the background, it also switches
                    automatically between 4 power-operation states depending on
                    battery level, speed, and driving situation.
                  </p>
                </section>
              )}

              <section className="guide-results">
                {filteredGuides.length > 0 ? (
                  filteredGuides.map((article, index) => (
                    <article
                      key={index}
                      className="card premium-card guide-card"
                    >
                      <div className="guide-top">
                        <p className="label">{article.category}</p>
                      </div>
                      <h3 className="guide-title">{article.title}</h3>
                      <p className="muted">{article.content}</p>
                    </article>
                  ))
                ) : (
                  <section className="card premium-card">
                    <p className="label">No results</p>
                    <p className="muted">
                      Try another keyword like charge, battery, hybrid, or
                      savings.
                    </p>
                  </section>
                )}
              </section>
            </>
          )}
        </main>

        <nav className="bottom-nav">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`nav-btn ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span>{tab.icon}</span>
              <small>{tab.label}</small>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}