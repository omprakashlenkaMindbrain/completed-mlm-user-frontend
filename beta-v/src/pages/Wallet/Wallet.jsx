"use client"

import { ArrowUpRight, Award, DollarSign, Eye, EyeOff, Target, TrendingUp, Users, Zap } from "lucide-react"
import { useMemo, useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export default function Wallet() {
  const [showBalance, setShowBalance] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  const dailyIncomeData = [
    { date: "Mon", income: 450, bv: 1200, commission: 45, referrals: 2, refIncome: 50 },
    { date: "Tue", income: 680, bv: 1800, commission: 68, referrals: 3, refIncome: 75 },
    { date: "Wed", income: 520, bv: 1400, commission: 52, referrals: 2, refIncome: 60 },
    { date: "Thu", income: 890, bv: 2400, commission: 89, referrals: 4, refIncome: 120 },
    { date: "Fri", income: 760, bv: 2000, commission: 76, referrals: 3, refIncome: 90 },
    { date: "Sat", income: 1120, bv: 3000, commission: 112, referrals: 5, refIncome: 150 },
    { date: "Sun", income: 950, bv: 2500, commission: 95, referrals: 4, refIncome: 110 },
  ]

  const stats = useMemo(() => {
    const totalIncome = dailyIncomeData.reduce((sum, day) => sum + day.income, 0)
    const totalBV = dailyIncomeData.reduce((sum, day) => sum + day.bv, 0)
    const totalReferrals = dailyIncomeData.reduce((sum, day) => sum + day.referrals, 0)
    const totalRefIncome = dailyIncomeData.reduce((sum, day) => sum + day.refIncome, 0)
    const avgIncome = Math.round(totalIncome / dailyIncomeData.length)

    return { totalIncome, totalBV, avgIncome, totalReferrals, totalRefIncome }
  }, [])

  const performanceData = [
    { metric: "Income", value: Math.round(stats.totalIncome / 30) },
    { metric: "BV", value: Math.round(stats.totalBV / 300) },
    { metric: "Referrals", value: stats.totalReferrals },
    { metric: "Commission", value: Math.round((stats.totalIncome * 0.1) / 30) },
    { metric: "Growth", value: 85 },
  ]


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">Dashboard</h1>
              <p className="text-slate-600">Your financial performance at a glance</p>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-blue-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
            >
              {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
              <span className="text-sm font-semibold">{showBalance ? "Hide" : "Show"} Balance</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Total Income Card */}
          <div className="group relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-400 opacity-10 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-300" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-blue-100">Total Income</h3>
                <div className="p-2 bg-yellow-400 rounded-lg">
                  <DollarSign size={18} className="text-blue-900" />
                </div>
              </div>
              <div className="mb-2">
                <p className="text-white text-3xl md:text-4xl font-bold">
                  {showBalance ? `$${stats.totalIncome}` : "••••"}
                </p>
              </div>
              <p className="text-blue-200 text-xs font-medium flex items-center gap-1">
                <ArrowUpRight size={14} /> +12% this week
              </p>
            </div>
          </div>

          {/* Total BV Card */}
          <div className="group relative bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-300" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-amber-900">Business Volume</h3>
                <div className="p-2 bg-white rounded-lg">
                  <Zap size={18} className="text-yellow-600" />
                </div>
              </div>
              <div className="mb-2">
                <p className="text-white text-3xl md:text-4xl font-bold">
                  {showBalance ? `${stats.totalBV.toLocaleString()}` : "••••"}
                </p>
              </div>
              <p className="text-amber-100 text-xs font-medium flex items-center gap-1">
                <ArrowUpRight size={14} /> +8% this week
              </p>
            </div>
          </div>

          {/* Total Referrals Card */}
          <div className="group relative bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-300 opacity-10 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-300" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-teal-50">Total Referrals</h3>
                <div className="p-2 bg-white rounded-lg">
                  <Users size={18} className="text-teal-600" />
                </div>
              </div>
              <div className="mb-2">
                <p className="text-white text-3xl md:text-4xl font-bold">{showBalance ? stats.totalReferrals : "••"}</p>
              </div>
              <p className="text-teal-100 text-xs font-medium flex items-center gap-1">
                <ArrowUpRight size={14} /> +5 this week
              </p>
            </div>
          </div>

          {/* Referral Income Card */}
          <div className="group relative bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-300 opacity-10 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-300" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-purple-50">Referral Income</h3>
                <div className="p-2 bg-white rounded-lg">
                  <Award size={18} className="text-purple-600" />
                </div>
              </div>
              <div className="mb-2">
                <p className="text-white text-3xl md:text-4xl font-bold">
                  {showBalance ? `$${stats.totalRefIncome}` : "••••"}
                </p>
              </div>
              <p className="text-purple-100 text-xs font-medium flex items-center gap-1">
                <ArrowUpRight size={14} /> +15% this week
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Area Chart - Income Trend */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-600" />
              Income Trend
            </h2>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyIncomeData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0066ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0066ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#0066ff"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                    name="Income ($)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Radar Chart - Performance Metrics */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Target size={20} className="text-purple-600" />
              Performance Metrics
            </h2>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={performanceData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="metric" stroke="#64748b" />
                  <PolarRadiusAxis stroke="#64748b" />
                  <Radar name="Performance" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart - BV vs Income */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-bold text-slate-900 mb-4">BV vs Income</h2>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyIncomeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="bv" fill="#06b6d4" name="BV (Units)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="income" fill="#0066ff" name="Income ($)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Scatter Chart - Referrals vs Income */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Referrals Performance</h2>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="referrals" name="Referrals" stroke="#64748b" />
                  <YAxis dataKey="refIncome" name="Ref Income" stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                    cursor={{ strokeDasharray: "3 3" }}
                  />
                  <Scatter name="Daily Performance" data={dailyIncomeData} fill="#a855f7" shape="circle" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award size={20} className="text-yellow-600" />
              Daily Performance Details
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 md:px-6 py-4 text-left font-semibold text-slate-900">Date</th>
                  <th className="px-4 md:px-6 py-4 text-left font-semibold text-slate-900">BV</th>
                  <th className="px-4 md:px-6 py-4 text-left font-semibold text-slate-900">Income</th>
                  <th className="px-4 md:px-6 py-4 text-left font-semibold text-slate-900">Commission</th>
                  <th className="px-4 md:px-6 py-4 text-left font-semibold text-slate-900">Referrals</th>
                  <th className="px-4 md:px-6 py-4 text-left font-semibold text-slate-900">Ref Income</th>
                </tr>
              </thead>
              <tbody>
                {dailyIncomeData.map((day, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-blue-50 transition-colors">
                    <td className="px-4 md:px-6 py-4 font-semibold text-slate-900">{day.date}</td>
                    <td className="px-4 md:px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-lg bg-cyan-100 text-cyan-700 text-xs font-semibold">
                        {day.bv}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className="font-bold text-blue-600">${day.income}</span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className="font-semibold text-yellow-600">${day.commission}</span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs font-semibold">
                        {day.referrals}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className="font-bold text-purple-600">${day.refIncome}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
