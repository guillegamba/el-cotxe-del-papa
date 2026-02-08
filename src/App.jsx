import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Wallet, TrendingUp, TrendingDown, Car, AlertTriangle, Info, Calculator, Check, X, ArrowRight
} from 'lucide-react';

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ title, icon: Icon, subtitle }) => (
  <div className="mb-6 border-b pb-4">
    <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
      {Icon && <Icon className="w-6 h-6 text-blue-600" />}
      {title}
    </div>
    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
  </div>
);

const InputGroup = ({ label, value, onChange, type = "number", suffix = "", step = "1", min="0" }) => (
  <div className="mb-3">
    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</label>
    <div className="relative rounded-md shadow-sm">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        step={step}
        min={min}
        className="block w-full rounded-md border-gray-300 pl-3 pr-12 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-50 border"
      />
      {suffix && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-gray-500 sm:text-sm">{suffix}</span>
        </div>
      )}
    </div>
  </div>
);

// Component nou per a les targetes estil "screenshot"
const ResultCard = ({ title, status, monthlyCashFlow, carCost, netMonthly, projections }) => {
  const isSustainable = status === 'green';
  const isWarning = status === 'orange';
  
  // Colors segons estat
  const headerColor = isSustainable ? 'text-emerald-800' : (isWarning ? 'text-amber-800' : 'text-red-800');
  const iconColor = isSustainable ? 'text-emerald-600' : (isWarning ? 'text-amber-600' : 'text-red-600');
  const borderColor = isSustainable ? 'border-emerald-200' : (isWarning ? 'border-amber-200' : 'border-red-200');
  const bgColor = isSustainable ? 'bg-emerald-50' : (isWarning ? 'bg-amber-50' : 'bg-red-50');
  
  // Icona
  const StatusIcon = isSustainable ? Check : (isWarning ? AlertTriangle : X);
  const statusText = isSustainable ? 'Sostenible' : (isWarning ? 'Ajustos' : 'Insostenible');

  return (
    <div className={`rounded-xl border shadow-sm overflow-hidden ${borderColor} ${bgColor}`}>
      {/* Capçalera */}
      <div className="p-5 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className={`rounded-full p-1 border-2 ${borderColor} bg-white`}>
            <StatusIcon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${headerColor}`}>{title}</h3>
            <p className={`text-xs uppercase tracking-wide opacity-70 ${headerColor}`}>{statusText}</p>
          </div>
        </div>

        {/* Línies de detall */}
        <div className="mt-6 space-y-3">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Marge mensual (Pensió - Despeses)</span>
            <span className={monthlyCashFlow >= 0 ? "font-medium" : "text-red-600 font-medium"}>
              {Math.round(monthlyCashFlow)} €
            </span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Cost real cotxe/mes (mitjana 10a)</span>
            <span className="font-bold text-gray-800">
              - {Math.round(carCost)} €
            </span>
          </div>
          <div className="h-px bg-black/5 my-2"></div>
          <div className="flex justify-between items-center text-base">
            <span className="font-bold text-gray-700">Net Mensual Resultant</span>
            <span className={`font-bold text-lg ${netMonthly >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {netMonthly > 0 ? '+' : ''}{Math.round(netMonthly)} €
            </span>
          </div>
        </div>
      </div>

      {/* Caixa Projeccions Inferior */}
      <div className="bg-black/5 p-4 grid grid-cols-3 gap-2 text-center border-t border-black/5">
        <div>
          <div className="text-[10px] uppercase text-gray-500 font-bold mb-1">Any 1</div>
          <div className="text-sm font-bold text-gray-800">{projections[1].toLocaleString()} €</div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-gray-500 font-bold mb-1">Any 5</div>
          <div className="text-sm font-bold text-gray-800">{projections[5].toLocaleString()} €</div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-gray-500 font-bold mb-1">Any 10</div>
          <div className="text-sm font-bold text-gray-800">{projections[10].toLocaleString()} €</div>
        </div>
      </div>
    </div>
  );
};

export default function DashboardFinancesComparatiu() {
  // --- ESTAT ---

  // Secció A: Finances Bàsiques
  const [basicFinance, setBasicFinance] = useState({
    savings: 80000,
    pension: 1050,
    expenses: 800,
  });

  // Secció B: Dades Comunes Cotxes
  const [carCommon, setCarCommon] = useState({
    kmPerYear: 10000,
    fuelCost: 1.6, // €/L
  });

  // Opció 1: Quedar-se el cotxe (Toyota Corolla Renting)
  const [opt1, setOpt1] = useState({
    name: "Opció 1 (Actual)",
    finalPayment: 20000,
    annualMaintenance: 600,
    consumption: 5.0, // L/100km
    insurance: 600,
  });

  // Opció 2: Opció A (Neutre)
  const [opt2, setOpt2] = useState({
    name: "Opció 2 (Econòmic)",
    price: 18000,
    isFinanced: false,
    downPayment: 5000,
    interestRate: 6.5,
    years: 5,
    consumption: 6.5,
    annualMaintenance: 400,
    insurance: 500,
  });

  // Opció 3: Opció B (Neutre)
  const [opt3, setOpt3] = useState({
    name: "Opció 3 (Nou)",
    price: 28000,
    isFinanced: true,
    downPayment: 8000,
    interestRate: 5.5,
    years: 6,
    consumption: 4.5,
    annualMaintenance: 300,
    insurance: 700,
  });

  // Secció C: Inversions
  const [investment, setInvestment] = useState({
    percentToInvest: 50, // % dels estalvis restants
    returnRate: 4.0, // % anual
    inflation: 3.0, // % anual
  });

  // --- CÀLCULS AUXILIARS ---

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

  // --- CÀLCULS PRINCIPALS I PROJECCIÓ ---

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

  // Estats finals i dades per als cards
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

  // Funció per extreure les dades de projecció d'una opció específica (1, 5, 10 anys)
  const getProjectionsForOption = (optionKey) => ({
      1: projectionData[1][optionKey],
      5: projectionData[5][optionKey],
      10: projectionData[10][optionKey]
  });

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-700 pb-12">
      {/* HEADER */}
      <header className="bg-slate-800 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Calculator className="h-8 w-8 text-blue-300" />
            Dashboard Comparatiu de Jubilació
          </h1>
          <p className="text-slate-300 mt-2 text-lg">
            Simulació simultània de les 3 opcions financeres a 10 anys vista.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* SECCIÓ A: FINANCES BÀSIQUES */}
        <section>
          <SectionTitle 
            title="A. Situació Base" 
            icon={Wallet} 
            subtitle="Defineix la teva capacitat econòmica actual."
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <InputGroup label="Estalvis Disponibles (€)" value={basicFinance.savings} onChange={(v) => setBasicFinance({...basicFinance, savings: v})} step="1000" />
              <InputGroup label="Pensió Mensual Neta (€)" value={basicFinance.pension} onChange={(v) => setBasicFinance({...basicFinance, pension: v})} />
              <InputGroup label="Despeses Fixes (€)" value={basicFinance.expenses} onChange={(v) => setBasicFinance({...basicFinance, expenses: v})} />
            </Card>
            
            <div className={`p-4 rounded-lg border flex flex-col justify-center items-center ${monthlyCashFlow >= 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
               <div className="text-sm uppercase tracking-wide opacity-70">Marge Mensual</div>
               <div className="text-3xl font-bold mt-2">{monthlyCashFlow > 0 ? '+' : ''}{monthlyCashFlow} €</div>
               <div className="text-xs mt-1 opacity-70">Disponibles per a cotxe/estalvi</div>
            </div>

            <div className="md:col-span-2 bg-white rounded-xl shadow-sm border p-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Balanç Mensual</h4>
               <div className="h-24 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={[{ name: 'Balanç', ing: basicFinance.pension, desp: basicFinance.expenses }]} margin={{top:0, left:0, right:30, bottom:0}}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" hide />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="ing" fill="#10B981" radius={[0, 4, 4, 0]} name="Ingressos" barSize={20} />
                    <Bar dataKey="desp" fill="#EF4444" radius={[0, 4, 4, 0]} name="Despeses" barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
               </div>
            </div>
          </div>
        </section>

        {/* SECCIÓ B: COMPARADOR DE COTXE */}
        <section>
          <SectionTitle 
            title="B. Configuració de les 3 Opcions" 
            icon={Car} 
            subtitle="Defineix els detalls de cada escenari per comparar-los."
          />

          {/* PARÀMETRES COMUNS */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6 flex flex-wrap gap-6 items-center">
             <div className="text-blue-800 font-bold flex items-center gap-2">
               <Info className="w-5 h-5" />
               Dades Comunes:
             </div>
             <div className="w-40">
                <InputGroup label="Km Anuals" value={carCommon.kmPerYear} onChange={(v) => setCarCommon({...carCommon, kmPerYear: v})} step="1000" suffix="km" />
             </div>
             <div className="w-40">
                <InputGroup label="Preu Gasolina" value={carCommon.fuelCost} onChange={(v) => setCarCommon({...carCommon, fuelCost: v})} step="0.1" suffix="€/L" />
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Opció 1 */}
            <div className="rounded-xl border-t-4 border-t-blue-500 bg-white shadow-sm border p-4">
              <div className="mb-4 border-b pb-2">
                <input 
                  type="text" 
                  value={opt1.name} 
                  onChange={(e) => setOpt1({...opt1, name: e.target.value})} 
                  className="font-bold text-lg text-blue-900 w-full focus:outline-none focus:bg-gray-50 rounded"
                />
              </div>
              <div className="space-y-3">
                <InputGroup label="Pagament Final" value={opt1.finalPayment} onChange={(v) => setOpt1({...opt1, finalPayment: v})} step="500" suffix="€" />
                <InputGroup label="Consum (L/100km)" value={opt1.consumption} onChange={(v) => setOpt1({...opt1, consumption: v})} step="0.1" />
                <InputGroup label="Mant. + Assegurança (Anual)" value={opt1.annualMaintenance + opt1.insurance} onChange={(v) => setOpt1({...opt1, annualMaintenance: v, insurance: 0})} suffix="€" />
                
                <div className="bg-gray-50 p-3 rounded mt-4">
                  <div className="text-xs text-gray-500">Cost total 10 anys</div>
                  <div className="text-xl font-bold text-blue-600">{Math.round(scenario1.totalCost10Years).toLocaleString()} €</div>
                  <div className="text-xs text-gray-400 mt-1">{Math.round(scenario1.monthlyAverage)} € / mes (mitjana)</div>
                </div>
              </div>
            </div>

            {/* Opció 2 */}
            <div className="rounded-xl border-t-4 border-t-emerald-500 bg-white shadow-sm border p-4">
              <div className="mb-4 border-b pb-2">
                <input 
                  type="text" 
                  value={opt2.name} 
                  onChange={(e) => setOpt2({...opt2, name: e.target.value})} 
                  className="font-bold text-lg text-emerald-900 w-full focus:outline-none focus:bg-gray-50 rounded"
                />
              </div>
              <div className="space-y-3">
                <InputGroup label="Preu Compra" value={opt2.price} onChange={(v) => setOpt2({...opt2, price: v})} suffix="€" />
                <div className="flex items-center mb-2 text-sm">
                  <input type="checkbox" checked={opt2.isFinanced} onChange={(e) => setOpt2({...opt2, isFinanced: e.target.checked})} className="mr-2" />
                  <span className={opt2.isFinanced ? "font-bold text-emerald-700" : "text-gray-500"}>Finançar Compra</span>
                </div>
                {opt2.isFinanced && (
                  <div className="grid grid-cols-2 gap-2 bg-emerald-50 p-2 rounded text-xs">
                     <div className="col-span-2"><InputGroup label="Entrada" value={opt2.downPayment} onChange={(v) => setOpt2({...opt2, downPayment: v})} suffix="€" /></div>
                     <InputGroup label="Interès %" value={opt2.interestRate} onChange={(v) => setOpt2({...opt2, interestRate: v})} step="0.1" />
                     <InputGroup label="Anys" value={opt2.years} onChange={(v) => setOpt2({...opt2, years: v})} />
                  </div>
                )}
                <InputGroup label="Consum (L/100km)" value={opt2.consumption} onChange={(v) => setOpt2({...opt2, consumption: v})} step="0.1" />
                <InputGroup label="Mant. + Assegurança (Anual)" value={opt2.annualMaintenance + opt2.insurance} onChange={(v) => setOpt2({...opt2, annualMaintenance: v, insurance: 0})} suffix="€" />

                <div className="bg-gray-50 p-3 rounded mt-4">
                  <div className="text-xs text-gray-500">Cost total 10 anys</div>
                  <div className="text-xl font-bold text-emerald-600">{Math.round(scenario2.totalCost10Years).toLocaleString()} €</div>
                  <div className="text-xs text-gray-400 mt-1">{Math.round(scenario2.monthlyAverage)} € / mes (mitjana)</div>
                </div>
              </div>
            </div>

            {/* Opció 3 */}
            <div className="rounded-xl border-t-4 border-t-purple-500 bg-white shadow-sm border p-4">
              <div className="mb-4 border-b pb-2">
                <input 
                  type="text" 
                  value={opt3.name} 
                  onChange={(e) => setOpt3({...opt3, name: e.target.value})} 
                  className="font-bold text-lg text-purple-900 w-full focus:outline-none focus:bg-gray-50 rounded"
                />
              </div>
              <div className="space-y-3">
                <InputGroup label="Preu Compra" value={opt3.price} onChange={(v) => setOpt3({...opt3, price: v})} suffix="€" />
                <div className="flex items-center mb-2 text-sm">
                  <input type="checkbox" checked={opt3.isFinanced} onChange={(e) => setOpt3({...opt3, isFinanced: e.target.checked})} className="mr-2" />
                  <span className={opt3.isFinanced ? "font-bold text-purple-700" : "text-gray-500"}>Finançar Compra</span>
                </div>
                {opt3.isFinanced && (
                  <div className="grid grid-cols-2 gap-2 bg-purple-50 p-2 rounded text-xs">
                     <div className="col-span-2"><InputGroup label="Entrada" value={opt3.downPayment} onChange={(v) => setOpt3({...opt3, downPayment: v})} suffix="€" /></div>
                     <InputGroup label="Interès %" value={opt3.interestRate} onChange={(v) => setOpt3({...opt3, interestRate: v})} step="0.1" />
                     <InputGroup label="Anys" value={opt3.years} onChange={(v) => setOpt3({...opt3, years: v})} />
                  </div>
                )}
                <InputGroup label="Consum (L/100km)" value={opt3.consumption} onChange={(v) => setOpt3({...opt3, consumption: v})} step="0.1" />
                <InputGroup label="Mant. + Assegurança (Anual)" value={opt3.annualMaintenance + opt3.insurance} onChange={(v) => setOpt3({...opt3, annualMaintenance: v, insurance: 0})} suffix="€" />

                <div className="bg-gray-50 p-3 rounded mt-4">
                  <div className="text-xs text-gray-500">Cost total 10 anys</div>
                  <div className="text-xl font-bold text-purple-600">{Math.round(scenario3.totalCost10Years).toLocaleString()} €</div>
                  <div className="text-xs text-gray-400 mt-1">{Math.round(scenario3.monthlyAverage)} € / mes (mitjana)</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓ C: INVERSIÓ */}
        <section>
          <SectionTitle 
            title="C. Estratègia d'Inversió" 
            icon={TrendingUp} 
            subtitle="Configura el rendiment dels estalvis que no gastis en el cotxe."
          />
          <Card className="bg-gradient-to-r from-gray-50 to-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputGroup 
                label="% Estalvis a Invertir" 
                value={investment.percentToInvest} 
                onChange={(v) => setInvestment({...investment, percentToInvest: Math.min(100, Math.max(0, v))})} 
                suffix="%" 
                step="5"
              />
              <InputGroup 
                label="Rendiment Esperat (Anual)" 
                value={investment.returnRate} 
                onChange={(v) => setInvestment({...investment, returnRate: v})} 
                suffix="%" 
                step="0.1"
              />
              <InputGroup 
                label="Inflació Estimada" 
                value={investment.inflation} 
                onChange={(v) => setInvestment({...investment, inflation: v})} 
                suffix="%" 
                step="0.1"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * El gràfic següent mostra el patrimoni <strong>Nominal</strong> (els diners que veuràs al compte bancari).
            </p>
          </Card>
        </section>

        {/* SECCIÓ D: PROJECCIÓ COMPARATIVA */}
        <section>
          <SectionTitle 
            title="D. Projecció Comparativa a 10 Anys" 
            icon={TrendingUp} 
            subtitle="Evolució dels teus estalvis segons l'opció que triïs."
          />
          
          <Card>
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectionData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" tick={{fontSize: 12}} />
                  <YAxis tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
                  <RechartsTooltip formatter={(val) => `${Math.round(val).toLocaleString()} €`} />
                  <Legend wrapperStyle={{paddingTop: '20px'}} />
                  
                  <Line type="monotone" dataKey="opt1" name={`1. ${opt1.name}`} stroke="#3B82F6" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="opt2" name={`2. ${opt2.name}`} stroke="#10B981" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="opt3" name={`3. ${opt3.name}`} stroke="#A855F7" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        {/* SECCIÓ E: SEMÀFOR COMPARATIU (NOU DISSENY) */}
        <section>
          <SectionTitle 
            title="E. Semàfor de Viabilitat" 
            icon={AlertTriangle} 
            subtitle="Anàlisi final i detall de sostenibilitat."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             
             {/* Resultat Opció 1 */}
             <ResultCard 
                title={opt1.name}
                status={getStatusColor(finalState.opt1)}
                monthlyCashFlow={monthlyCashFlow}
                carCost={scenario1.monthlyAverage}
                netMonthly={monthlyCashFlow - scenario1.monthlyAverage}
                projections={getProjectionsForOption('opt1')}
             />

             {/* Resultat Opció 2 */}
             <ResultCard 
                title={opt2.name}
                status={getStatusColor(finalState.opt2)}
                monthlyCashFlow={monthlyCashFlow}
                carCost={scenario2.monthlyAverage}
                netMonthly={monthlyCashFlow - scenario2.monthlyAverage}
                projections={getProjectionsForOption('opt2')}
             />

             {/* Resultat Opció 3 */}
             <ResultCard 
                title={opt3.name}
                status={getStatusColor(finalState.opt3)}
                monthlyCashFlow={monthlyCashFlow}
                carCost={scenario3.monthlyAverage}
                netMonthly={monthlyCashFlow - scenario3.monthlyAverage}
                projections={getProjectionsForOption('opt3')}
             />

          </div>
          
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm text-gray-600 flex gap-4">
             <Info className="w-5 h-5 flex-shrink-0" />
             <p>
               <strong>Nota sobre el Cost Real:</strong> El "Cost cotxe" mostrat aquí és la mitjana mensual durant 10 anys, incloent-hi la compra/entrada amortitzada, la gasolina i el manteniment. Això permet comparar millor cotxes barats de compra però cars de manteniment.
             </p>
          </div>
        </section>

      </main>
    </div>
  );
}
