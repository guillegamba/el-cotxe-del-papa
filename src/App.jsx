import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Car,
  AlertTriangle,
  Info,
  Calculator,
  Check,
  X,
  ChevronRight,
  Settings,
  Fuel,
  PiggyBank,
  Target,
} from 'lucide-react';

// --- UI COMPONENTS ---

const Card = ({ children, className = "", noPadding = false }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
    <div className={noPadding ? "" : "p-6"}>
      {children}
    </div>
  </div>
);

const Badge = ({ children, color = "blue" }) => {
  const styles = {
    blue: "bg-blue-100 text-blue-700",
    emerald: "bg-emerald-100 text-emerald-700",
    purple: "bg-purple-100 text-purple-700",
    gray: "bg-slate-100 text-slate-700",
    red: "bg-red-100 text-red-700",
    amber: "bg-amber-100 text-amber-700",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${styles[color] || styles.gray}`}>
      {children}
    </span>
  );
};

const SectionHeader = ({ title, icon: Icon, subtitle }) => (
  <div className="mb-6">
    <div className="flex items-center gap-3 mb-1">
      <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
        {Icon && <Icon className="w-5 h-5" />}
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    {subtitle && <p className="text-sm text-slate-500 ml-12">{subtitle}</p>}
  </div>
);

const ModernInput = ({ label, value, onChange, type = "number", suffix = "", step = "1", min = "0", icon: Icon }) => (
  <div className="group relative">
    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
      {label}
    </label>
    <div className="relative flex items-center">
      {Icon && (
        <div className="absolute left-3 text-slate-400">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        step={step}
        min={min}
        className={`
          block w-full rounded-xl border-slate-200 bg-slate-50 
          py-2.5 text-slate-700 font-medium shadow-sm transition-all
          focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100
          ${Icon ? 'pl-9' : 'pl-3'} ${suffix ? 'pr-12' : 'pr-3'}
        `}
      />
      {suffix && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-slate-400 text-sm font-medium">{suffix}</span>
        </div>
      )}
    </div>
  </div>
);

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-slate-100 shadow-xl rounded-xl">
        <p className="font-bold text-slate-800 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className="text-slate-500">{entry.name}:</span>
            <span className="font-bold text-slate-700">
              {Math.round(entry.value).toLocaleString()} €
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Component for the "Result/Scenario" cards
const ScenarioResult = ({ title, status, monthlyCashFlow, carCost, netMonthly, projections, colorTheme }) => {
  const isSustainable = status === 'green';
  const isWarning = status === 'orange';
  
  // Dynamic color classes based on theme prop (blue, emerald, purple)
  const themes = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', lightText: 'text-blue-600/80', accent: 'bg-blue-500' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', lightText: 'text-emerald-600/80', accent: 'bg-emerald-500' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', lightText: 'text-purple-600/80', accent: 'bg-purple-500' },
  };
  const t = themes[colorTheme] || themes.blue;

  // Status Logic
  const StatusIcon = isSustainable ? Check : (isWarning ? AlertTriangle : X);
  const statusColor = isSustainable ? 'text-emerald-600 bg-emerald-100' : (isWarning ? 'text-amber-600 bg-amber-100' : 'text-red-600 bg-red-100');
  const statusText = isSustainable ? 'Sostenible' : (isWarning ? 'Atenció' : 'Risc Alt');

  return (
    <div className={`relative flex flex-col h-full rounded-2xl border transition-all duration-300 hover:shadow-md ${t.bg} ${t.border}`}>
      {/* Badge Header */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border border-white ${statusColor}`}>
          <StatusIcon className="w-3 h-3" />
          {statusText}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className={`text-center font-bold text-lg mb-6 ${t.text}`}>{title}</h3>

        {/* Key Metric: Net Monthly */}
        <div className="text-center mb-6">
          <div className="text-xs uppercase text-slate-500 font-semibold mb-1">Balanç Mensual Net</div>
          <div className={`text-3xl font-bold ${netMonthly >= 0 ? 'text-slate-800' : 'text-red-500'}`}>
            {netMonthly > 0 ? '+' : ''}{Math.round(netMonthly)} €
          </div>
          <div className="text-xs text-slate-400 mt-1">després de totes les despeses</div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-3 bg-white/60 p-4 rounded-xl border border-white/50 mb-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Marge Dispon.</span>
            <span className="font-medium text-slate-700">{Math.round(monthlyCashFlow)} €</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Cost Real Cotxe</span>
            <span className="font-bold text-red-500">- {Math.round(carCost)} €</span>
          </div>
        </div>

        {/* Mini Projection Preview */}
        <div className="mt-auto pt-4 border-t border-slate-200/50">
           <div className="flex justify-between items-end">
              <div className="text-left">
                <div className="text-[10px] uppercase text-slate-400 font-bold">Patrimoni Any 10</div>
                <div className={`text-lg font-bold ${projections[10] > 0 ? 'text-slate-700' : 'text-red-600'}`}>
                  {projections[10].toLocaleString()} €
                </div>
              </div>
              <div className="h-8 w-16 opacity-50">
                {/* Visual sparkline simplified */}
                 <div className="flex items-end h-full gap-1">
                    <div className={`w-1/3 rounded-t-sm ${t.accent}`} style={{height: '30%'}}></div>
                    <div className={`w-1/3 rounded-t-sm ${t.accent}`} style={{height: '60%'}}></div>
                    <div className={`w-1/3 rounded-t-sm ${t.accent}`} style={{height: '100%'}}></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function DashboardFinancesModern() {
  // --- STATE ---
  const [basicFinance, setBasicFinance] = useState({
    savings: 80000,
    pension: 1050,
    expenses: 800,
  });

  const [carCommon, setCarCommon] = useState({
    kmPerYear: 10000,
    fuelCost: 1.6,
  });

  const [opt1, setOpt1] = useState({
    name: "Actual (Renting)",
    finalPayment: 20000,
    annualMaintenance: 600,
    consumption: 5.0,
    insurance: 600,
  });

  const [opt2, setOpt2] = useState({
    name: "Ocasió (Econòmic)",
    price: 18000,
    isFinanced: false,
    downPayment: 5000,
    interestRate: 6.5,
    years: 5,
    consumption: 6.5,
    annualMaintenance: 400,
    insurance: 500,
  });

  const [opt3, setOpt3] = useState({
    name: "Nou (Premium)",
    price: 28000,
    isFinanced: true,
    downPayment: 8000,
    interestRate: 5.5,
    years: 6,
    consumption: 4.5,
    annualMaintenance: 300,
    insurance: 700,
  });

  const [investment, setInvestment] = useState({
    percentToInvest: 50,
    returnRate: 4.0,
    inflation: 3.0,
  });

  // --- LOGIC HELPER ---
  const calculateLoanPmt = (principal, rate, years) => {
    if (principal <= 0 || rate <= 0 || years <= 0) return 0;
    const r = rate / 100 / 12;
    const n = years * 12;
    return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  const calculateCarScenario = (optionType, common, specific) => {
    let initialOutlay = 0;
    let monthlyLoanCost = 0;
    let loanMonths = 0;
    
    const annualFuel = (common.kmPerYear / 100) * specific.consumption * common.fuelCost;
    const annualFixed = specific.annualMaintenance + specific.insurance;

    if (optionType === 1) {
      initialOutlay = specific.finalPayment;
    } else {
      if (specific.isFinanced) {
        initialOutlay = specific.downPayment;
        const loanAmount = specific.price - specific.downPayment;
        monthlyLoanCost = calculateLoanPmt(loanAmount, specific.interestRate, specific.years);
        loanMonths = specific.years * 12;
      } else {
        initialOutlay = specific.price;
      }
    }

    const loanTotal = monthlyLoanCost * loanMonths;
    const opsTotal = (annualFuel + annualFixed) * 10;
    const totalCost10Years = initialOutlay + loanTotal + opsTotal;
    const monthlyAverage = totalCost10Years / 120;

    return {
      initialOutlay,
      monthlyLoanCost,
      loanMonths,
      annualFuel,
      annualFixed,
      totalCost10Years,
      monthlyAverage
    };
  };

  // --- CORE CALCULATIONS ---
  const monthlyCashFlow = basicFinance.pension - basicFinance.expenses;
  const annualCashFlow = monthlyCashFlow * 12;

  const scenario1 = calculateCarScenario(1, carCommon, opt1);
  const scenario2 = calculateCarScenario(2, carCommon, opt2);
  const scenario3 = calculateCarScenario(3, carCommon, opt3);

  const generateProjectionSeries = (scenario) => {
    let currentCapital = basicFinance.savings - scenario.initialOutlay;
    let investedAmount = currentCapital * (investment.percentToInvest / 100);
    let liquidAmount = currentCapital - investedAmount;

    const series = [];

    for (let year = 0; year <= 10; year++) {
       if (year === 0) {
         series.push(investedAmount + liquidAmount);
         continue;
       }

       let yearCashFlow = annualCashFlow;
       const carOpsCost = scenario.annualFuel + scenario.annualFixed;
       let loanCostThisYear = 0;
       
       const startMonth = (year - 1) * 12;
       const endMonth = year * 12;
       if (scenario.loanMonths > 0) {
         const overlap = Math.min(scenario.loanMonths, endMonth) - Math.max(0, startMonth);
         if (overlap > 0) loanCostThisYear = overlap * scenario.monthlyLoanCost;
       }

       const totalCarOut = carOpsCost + loanCostThisYear;
       const investmentReturn = investedAmount * (investment.returnRate / 100);
       
       let netFlow = yearCashFlow - totalCarOut;
       liquidAmount += netFlow;
       investedAmount += investmentReturn;

       if (liquidAmount < 2000) {
         const needed = 2000 - liquidAmount;
         if (investedAmount >= needed) {
           investedAmount -= needed;
           liquidAmount += needed;
         } else {
           liquidAmount += investedAmount;
           investedAmount = 0;
         }
       }
       series.push(investedAmount + liquidAmount);
    }
    return series;
  };

  const projectionData = useMemo(() => {
    const s1 = generateProjectionSeries(scenario1);
    const s2 = generateProjectionSeries(scenario2);
    const s3 = generateProjectionSeries(scenario3);

    const data = [];
    for (let i = 0; i <= 10; i++) {
      data.push({
        year: `Any ${i}`,
        opt1: Math.round(s1[i]),
        opt2: Math.round(s2[i]),
        opt3: Math.round(s3[i]),
      });
    }
    return data;
  }, [basicFinance, scenario1, scenario2, scenario3, annualCashFlow, investment]);

  const finalState = {
    opt1: projectionData[10].opt1,
    opt2: projectionData[10].opt2,
    opt3: projectionData[10].opt3,
  };

  const getStatusColor = (finalCapital) => {
    if (finalCapital < 0) return "red";
    if (finalCapital < basicFinance.savings) return "orange";
    return "green";
  };

  const getProjectionsForOption = (optionKey) => ({
      1: projectionData[1][optionKey],
      5: projectionData[5][optionKey],
      10: projectionData[10][optionKey]
  });

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-600 pb-20 selection:bg-blue-100 selection:text-blue-900">
      
      {/* HEADER */}
      <div className="bg-slate-900 text-white pt-8 pb-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
             <div className="flex items-center gap-2 mb-2 opacity-80">
                <Badge color="blue">v2.0 Beta</Badge>
                <span className="text-sm font-medium">Calculadora Jubilació</span>
             </div>
             <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
               El Cotxe del Papa Dashboard
             </h1>
          </div>
          
          <div className="flex gap-4 text-sm text-slate-400">
            <div className="text-right">
              <div className="font-bold text-white text-lg">{basicFinance.savings.toLocaleString()} €</div>
              <div>Patrimoni Inicial</div>
            </div>
            <div className="h-10 w-px bg-slate-700"></div>
            <div className="text-right">
              <div className={`font-bold text-lg ${monthlyCashFlow > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {monthlyCashFlow > 0 ? '+' : ''}{monthlyCashFlow} €
              </div>
              <div>Marge Mensual</div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 -mt-8 space-y-8">
        
        {/* SECTION A: BASE FINANCES (Top Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-lg">
             <SectionHeader title="Finances Personals" icon={Wallet} subtitle="Defineix la teva base econòmica per calcular la viabilitat." />
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <ModernInput label="Estalvis Actuals" value={basicFinance.savings} onChange={(v) => setBasicFinance({...basicFinance, savings: v})} step="1000" suffix="€" icon={PiggyBank} />
                <ModernInput label="Ingressos Nets" value={basicFinance.pension} onChange={(v) => setBasicFinance({...basicFinance, pension: v})} suffix="€/mes" icon={Wallet} />
                <ModernInput label="Despeses Fixes" value={basicFinance.expenses} onChange={(v) => setBasicFinance({...basicFinance, expenses: v})} suffix="€/mes" icon={Target} />
             </div>
          </Card>

          {/* Monthly Margin KPI */}
          <Card className={`flex flex-col justify-center shadow-lg border-l-4 ${monthlyCashFlow >= 0 ? 'border-l-emerald-400' : 'border-l-red-400'}`}>
              <div className="text-center">
                 <div className="inline-flex items-center justify-center p-3 rounded-full bg-slate-100 mb-3">
                   {monthlyCashFlow >= 0 ? <TrendingUp className="w-6 h-6 text-emerald-600" /> : <TrendingDown className="w-6 h-6 text-red-600" />}
                 </div>
                 <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-1">Capacitat d'Estalvi Mensual</h3>
                 <div className={`text-4xl font-extrabold ${monthlyCashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                   {monthlyCashFlow} €
                 </div>
                 <p className="text-slate-400 text-sm mt-2 px-6 leading-tight">
                   Aquests són els diners lliures que tens cada mes per pagar el cotxe i viure.
                 </p>
              </div>
          </Card>
        </div>

        {/* SECTION B: CAR COMPARISON */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Car className="text-blue-600" />
            Comparador d'Escenaris
          </h2>

          {/* Common Settings Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 text-slate-700 font-bold mr-auto">
               <Settings className="w-5 h-5 text-slate-400" />
               <span className="hidden sm:inline">Paràmetres Comuns</span>
            </div>
            <div className="flex gap-4 flex-1 sm:flex-none">
              <div className="flex-1 sm:w-40">
                <ModernInput label="Km / Any" value={carCommon.kmPerYear} onChange={(v) => setCarCommon({...carCommon, kmPerYear: v})} step="1000" suffix="km" />
              </div>
              <div className="flex-1 sm:w-40">
                 <ModernInput label="Preu Gasolina" value={carCommon.fuelCost} onChange={(v) => setCarCommon({...carCommon, fuelCost: v})} step="0.1" suffix="€/L" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* OPTION 1: BLUE */}
            <Card className="border-t-4 border-t-blue-500 hover:border-t-[6px] transition-all">
              <div className="mb-6 flex justify-between items-start">
                 <input type="text" value={opt1.name} onChange={(e) => setOpt1({...opt1, name: e.target.value})} className="font-bold text-lg text-blue-900 w-full bg-transparent border-b border-dashed border-blue-200 focus:outline-none focus:border-blue-500" />
                 <Badge color="blue">Actual</Badge>
              </div>
              <div className="space-y-4">
                <ModernInput label="Pagament Final" value={opt1.finalPayment} onChange={(v) => setOpt1({...opt1, finalPayment: v})} suffix="€" />
                <div className="grid grid-cols-2 gap-4">
                  <ModernInput label="Consum" value={opt1.consumption} onChange={(v) => setOpt1({...opt1, consumption: v})} suffix="L/100" />
                  <ModernInput label="Despeses/Any" value={opt1.annualMaintenance + opt1.insurance} onChange={(v) => setOpt1({...opt1, annualMaintenance: v, insurance: 0})} suffix="€" />
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-1">
                     <span className="text-xs font-bold text-slate-400 uppercase">Cost real mensual</span>
                     <span className="text-lg font-bold text-blue-600">{Math.round(scenario1.monthlyAverage)} €</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{width: `${Math.min(100, (scenario1.monthlyAverage / monthlyCashFlow) * 100)}%`}}></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* OPTION 2: EMERALD */}
            <Card className="border-t-4 border-t-emerald-500 hover:border-t-[6px] transition-all">
              <div className="mb-6 flex justify-between items-start">
                 <input type="text" value={opt2.name} onChange={(e) => setOpt2({...opt2, name: e.target.value})} className="font-bold text-lg text-emerald-900 w-full bg-transparent border-b border-dashed border-emerald-200 focus:outline-none focus:border-emerald-500" />
                 <Badge color="emerald">Econòmic</Badge>
              </div>
              <div className="space-y-4">
                <ModernInput label="Preu Compra" value={opt2.price} onChange={(v) => setOpt2({...opt2, price: v})} suffix="€" />
                
                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  <div className="flex items-center mb-3">
                    <input type="checkbox" id="fin2" checked={opt2.isFinanced} onChange={(e) => setOpt2({...opt2, isFinanced: e.target.checked})} className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                    <label htmlFor="fin2" className="ml-2 text-sm font-medium text-emerald-800">Finançar Compra</label>
                  </div>
                  {opt2.isFinanced && (
                    <div className="grid grid-cols-2 gap-2">
                       <ModernInput label="Entrada" value={opt2.downPayment} onChange={(v) => setOpt2({...opt2, downPayment: v})} suffix="€" />
                       <ModernInput label="Interès" value={opt2.interestRate} onChange={(v) => setOpt2({...opt2, interestRate: v})} suffix="%" step="0.1" />
                       <div className="col-span-2">
                        <ModernInput label="Durada (Anys)" value={opt2.years} onChange={(v) => setOpt2({...opt2, years: v})} suffix="anys" />
                       </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <ModernInput label="Consum" value={opt2.consumption} onChange={(v) => setOpt2({...opt2, consumption: v})} suffix="L/100" />
                  <ModernInput label="Despeses/Any" value={opt2.annualMaintenance + opt2.insurance} onChange={(v) => setOpt2({...opt2, annualMaintenance: v, insurance: 0})} suffix="€" />
                </div>

                 <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-1">
                     <span className="text-xs font-bold text-slate-400 uppercase">Cost real mensual</span>
                     <span className="text-lg font-bold text-emerald-600">{Math.round(scenario2.monthlyAverage)} €</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{width: `${Math.min(100, (scenario2.monthlyAverage / monthlyCashFlow) * 100)}%`}}></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* OPTION 3: PURPLE */}
            <Card className="border-t-4 border-t-purple-500 hover:border-t-[6px] transition-all">
              <div className="mb-6 flex justify-between items-start">
                 <input type="text" value={opt3.name} onChange={(e) => setOpt3({...opt3, name: e.target.value})} className="font-bold text-lg text-purple-900 w-full bg-transparent border-b border-dashed border-purple-200 focus:outline-none focus:border-purple-500" />
                 <Badge color="purple">Premium</Badge>
              </div>
              <div className="space-y-4">
                <ModernInput label="Preu Compra" value={opt3.price} onChange={(v) => setOpt3({...opt3, price: v})} suffix="€" />
                
                <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100">
                  <div className="flex items-center mb-3">
                    <input type="checkbox" id="fin3" checked={opt3.isFinanced} onChange={(e) => setOpt3({...opt3, isFinanced: e.target.checked})} className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500" />
                    <label htmlFor="fin3" className="ml-2 text-sm font-medium text-purple-800">Finançar Compra</label>
                  </div>
                  {opt3.isFinanced && (
                    <div className="grid grid-cols-2 gap-2">
                       <ModernInput label="Entrada" value={opt3.downPayment} onChange={(v) => setOpt3({...opt3, downPayment: v})} suffix="€" />
                       <ModernInput label="Interès" value={opt3.interestRate} onChange={(v) => setOpt3({...opt3, interestRate: v})} suffix="%" step="0.1" />
                       <div className="col-span-2">
                        <ModernInput label="Durada (Anys)" value={opt3.years} onChange={(v) => setOpt3({...opt3, years: v})} suffix="anys" />
                       </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <ModernInput label="Consum" value={opt3.consumption} onChange={(v) => setOpt3({...opt3, consumption: v})} suffix="L/100" />
                  <ModernInput label="Despeses/Any" value={opt3.annualMaintenance + opt3.insurance} onChange={(v) => setOpt3({...opt3, annualMaintenance: v, insurance: 0})} suffix="€" />
                </div>

                 <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-1">
                     <span className="text-xs font-bold text-slate-400 uppercase">Cost real mensual</span>
                     <span className="text-lg font-bold text-purple-600">{Math.round(scenario3.monthlyAverage)} €</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-purple-500 h-1.5 rounded-full" style={{width: `${Math.min(100, (scenario3.monthlyAverage / monthlyCashFlow) * 100)}%`}}></div>
                  </div>
                </div>
              </div>
            </Card>

          </div>
        </div>

        {/* SECTION C & D: INVESTMENT & CHART */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
           
           {/* Investment Sidebar */}
           <div className="lg:col-span-1">
             <Card className="h-full bg-slate-800 text-slate-100 border-none shadow-xl">
               <SectionHeader title="Inversions" icon={TrendingUp} />
               <p className="text-xs text-slate-400 mb-6">Ajusta el rendiment dels diners que NO gastes en el cotxe.</p>
               
               <div className="space-y-6">
                 <div>
                   <div className="flex justify-between text-sm font-bold mb-2">
                      <span>Invertir Estalvis</span>
                      <span className="text-blue-400">{investment.percentToInvest}%</span>
                   </div>
                   <input 
                      type="range" min="0" max="100" step="5"
                      value={investment.percentToInvest}
                      onChange={(e) => setInvestment({...investment, percentToInvest: parseInt(e.target.value)})}
                      className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                   />
                 </div>
                 
                 <div className="space-y-4 pt-4 border-t border-slate-700">
                    <ModernInput label="Rendiment Anual" value={investment.returnRate} onChange={(v) => setInvestment({...investment, returnRate: v})} suffix="%" step="0.1" />
                    <ModernInput label="Inflació" value={investment.inflation} onChange={(v) => setInvestment({...investment, inflation: v})} suffix="%" step="0.1" />
                 </div>
               </div>
             </Card>
           </div>

           {/* Chart Area */}
           <div className="lg:col-span-3">
             <Card className="h-full min-h-[400px]">
               <div className="flex justify-between items-center mb-6">
                 <div>
                   <h3 className="font-bold text-lg text-slate-800">Projecció de Patrimoni a 10 Anys</h3>
                   <p className="text-sm text-slate-500">Comparativa de l'evolució dels estalvis segons l'opció triada.</p>
                 </div>
               </div>
               
               <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorOpt1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorOpt2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorOpt3" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A855F7" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{paddingTop: '20px'}} />
                    
                    <Area type="monotone" dataKey="opt1" name={opt1.name} stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorOpt1)" />
                    <Area type="monotone" dataKey="opt2" name={opt2.name} stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorOpt2)" />
                    <Area type="monotone" dataKey="opt3" name={opt3.name} stroke="#A855F7" strokeWidth={3} fillOpacity={1} fill="url(#colorOpt3)" />
                  </AreaChart>
                </ResponsiveContainer>
               </div>
             </Card>
           </div>
        </div>

        {/* SECTION E: FINAL RESULTS */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
             <Target className="text-blue-600" />
             Conclusions Finals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <ScenarioResult 
                title={opt1.name}
                colorTheme="blue"
                status={getStatusColor(finalState.opt1)}
                monthlyCashFlow={monthlyCashFlow}
                carCost={scenario1.monthlyAverage}
                netMonthly={monthlyCashFlow - scenario1.monthlyAverage}
                projections={getProjectionsForOption('opt1')}
             />
             <ScenarioResult 
                title={opt2.name}
                colorTheme="emerald"
                status={getStatusColor(finalState.opt2)}
                monthlyCashFlow={monthlyCashFlow}
                carCost={scenario2.monthlyAverage}
                netMonthly={monthlyCashFlow - scenario2.monthlyAverage}
                projections={getProjectionsForOption('opt2')}
             />
             <ScenarioResult 
                title={opt3.name}
                colorTheme="purple"
                status={getStatusColor(finalState.opt3)}
                monthlyCashFlow={monthlyCashFlow}
                carCost={scenario3.monthlyAverage}
                netMonthly={monthlyCashFlow - scenario3.monthlyAverage}
                projections={getProjectionsForOption('opt3')}
             />
          </div>
        </div>

      </main>
    </div>
  );
}
