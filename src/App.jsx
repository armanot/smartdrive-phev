import { useMemo, useState } from "react";
import "./styles.css";
import carHero from "./assets/phev7_blue.png";

const ENERGY_RATE = 0.2703;
const CAPACITY_RATE = 0.0455;
const NETWORK_RATE = 0.1285;
const EFFICIENT_INCENTIVE = 0.21;
const KWTBB_RATE = 0.016;
const SERVICE_TAX_RATE = 0.08;
const ST_THRESHOLD_KWH = 600;

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
    title: "What happens when the battery gets low?",
    category: "Battery",
    content:
      "The petrol engine supports the car automatically. A PHEV does not become unusable just because the battery is low.",
  },
  {
    title: "What is the best mode for city driving?",
    category: "Modes",
    content:
      "For short city trips, EV or Pure mode is usually best if you have enough battery. It is quieter and cheaper to run.",
  },
  {
    title: "When should I use Hybrid mode?",
    category: "Modes",
    content:
      "Use Hybrid mode for mixed driving, longer trips, or when you want the car to manage EV and petrol more efficiently.",
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
];

const guideCategories = [
  "All",
  "Charging",
  "Battery",
  "Modes",
  "Savings",
  "Long Trip",
  "Basics",
];

function estimateBillFromKwh(totalKwh) {
  const safeKwh = Number(totalKwh) || 0;

  const basePerKwh =
    ENERGY_RATE + CAPACITY_RATE + NETWORK_RATE - EFFICIENT_INCENTIVE;

  const subtotal = safeKwh * basePerKwh;
  const kwtbb = subtotal * KWTBB_RATE;
  const serviceTax = safeKwh > ST_THRESHOLD_KWH ? subtotal * SERVICE_TAX_RATE : 0;
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

  const [batteryKwh, setBatteryKwh] = useState(18.4);
  const [householdKwh, setHouseholdKwh] = useState(329);
  const [chargesPerMonth, setChargesPerMonth] = useState(15);
  const [chargePercent, setChargePercent] = useState(70);
  const [monthlyPetrolSpend, setMonthlyPetrolSpend] = useState(350);
  const [carName, setCarName] = useState("PROTON e.MAS 7 PHEV Premium");

  const [guideSearch, setGuideSearch] = useState("");
  const [guideCategory, setGuideCategory] = useState("All");

  const results = useMemo(() => {
    const safeBatteryKwh = Number(batteryKwh) || 0;
    const safeHouseholdKwh = Number(householdKwh) || 0;
    const safeChargesPerMonth = Number(chargesPerMonth) || 0;
    const safeChargePercent = Number(chargePercent) || 0;
    const safeMonthlyPetrolSpend = Number(monthlyPetrolSpend) || 0;

    const chargeKwh = safeBatteryKwh * (safeChargePercent / 100);
    const monthlyEvKwh = chargeKwh * safeChargesPerMonth;
    const newTotalKwh = safeHouseholdKwh + monthlyEvKwh;

    const currentBill = estimateBillFromKwh(safeHouseholdKwh);
    const newBill = estimateBillFromKwh(newTotalKwh);

    const incrementalEvCost = newBill.totalBill - currentBill.totalBill;
    const costPerCharge =
      safeChargesPerMonth > 0 ? incrementalEvCost / safeChargesPerMonth : 0;

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
    };
  }, [batteryKwh, householdKwh, chargesPerMonth, chargePercent, monthlyPetrolSpend]);

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
          <p className="eyebrow">SmartDrive PHEV</p>
          <h1>New owner companion</h1>
          <p className="subtext">Simple home charging and savings guide</p>
        </header>

        <main className="content">
          {activeTab === "home" && (
            <>
              <section className="hero-card clean-hero">
                <div className="hero-bg-glow" />
                <div className="hero-content clean-layout">
                  <div className="hero-copy">
                    <p className="label">Vehicle</p>
                    <h2>{carName}</h2>
                    <p className="hero-meta">Battery size: {batteryKwh} kWh</p>

                    <div className="hero-bottom">
                      <div className="mini-pill">
                        <span>⚡</span>
                        <strong>{formatMoney(results.costPerCharge)}</strong>
                        <small>per charge</small>
                      </div>

                      <div className="mini-pill">
                        <span>🔋</span>
                        <strong>{chargePercent}%</strong>
                        <small>charge target</small>
                      </div>
                    </div>
                  </div>

                  <div className="hero-visual">
                    <div className={`zone-badge ${results.zoneClass}`}>
                      {results.zone} Zone
                    </div>
                    <img
                      src={carHero}
                      alt="PROTON e.MAS 7 PHEV"
                      className="hero-car"
                    />
                  </div>
                </div>
              </section>

              <section className="card premium-card pulse-card">
                <div className="card-header">
                  <p className="label">Should I charge tonight?</p>
                  <span className={`signal-dot ${results.zoneClass}`} />
                </div>
                <h3>{results.recommendChargeTonight}</h3>
                <p>{results.advice}</p>

                <div className="advice-strip">
                  <div>
                    <small>Best strategy</small>
                    <strong>{results.chargeLevel}</strong>
                  </div>
                  <div>
                    <small>Projected usage</small>
                    <strong>{formatKwh(results.newTotalKwh)}</strong>
                  </div>
                </div>
              </section>

              <section className="stats-grid">
                <button className="card stat-card interactive" type="button">
                  <p className="label">Cost per charge</p>
                  <h3>{formatMoney(results.costPerCharge)}</h3>
                  <span className="card-hint">Tap to compare scenarios</span>
                </button>

                <button className="card stat-card interactive" type="button">
                  <p className="label">Monthly EV cost</p>
                  <h3>{formatMoney(results.incrementalEvCost)}</h3>
                  <span className="card-hint">Based on added home bill</span>
                </button>

                <button className="card stat-card interactive positive" type="button">
                  <p className="label">Petrol savings</p>
                  <h3>{formatMoney(results.estimatedSavings)}</h3>
                  <span className="card-hint">Estimated monthly savings</span>
                </button>

                <button className="card stat-card interactive" type="button">
                  <p className="label">New home usage</p>
                  <h3>{formatKwh(results.newTotalKwh)}</h3>
                  <span className="card-hint">Includes EV charging</span>
                </button>
              </section>

              <section className="card premium-card">
                <div className="card-header">
                  <p className="label">Quick summary</p>
                  <span className="glass-chip">Live estimate</span>
                </div>

                <div className="summary-list">
                  <div className="summary-row">
                    <span>Current estimated bill</span>
                    <strong>{formatMoney(results.currentBill.totalBill)}</strong>
                  </div>
                  <div className="summary-row">
                    <span>New estimated bill</span>
                    <strong>{formatMoney(results.newBill.totalBill)}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Added EV kWh</span>
                    <strong>{formatKwh(results.monthlyEvKwh)}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Effective new rate</span>
                    <strong>RM {results.newBill.effectiveRate.toFixed(3)} / kWh</strong>
                  </div>
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
                    <label>Battery size (kWh)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={batteryKwh}
                      onChange={(e) => setBatteryKwh(e.target.value)}
                    />
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
                  Estimated monthly savings compared with your current petrol spend.
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
                </div>
              </section>
            </>
          )}

          {activeTab === "guide" && (
            <>
              <section className="card premium-card">
                <div className="card-header">
                  <p className="label">Guide search</p>
                  <span className="glass-chip">{filteredGuides.length} results</span>
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

              <section className="guide-results">
                {filteredGuides.length > 0 ? (
                  filteredGuides.map((article, index) => (
                    <article key={index} className="card premium-card guide-card">
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
                      Try another keyword like charge, battery, hybrid, or savings.
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