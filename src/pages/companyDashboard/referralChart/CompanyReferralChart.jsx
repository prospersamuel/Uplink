import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Line } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Filler,
  Tooltip
} from "chart.js";
import { FiArrowUpRight, FiInfo, FiChevronDown, FiChevronUp } from "react-icons/fi";

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Filler,
  Tooltip
);

export default function CompanyReferralChart() {
  const [timeRange, setTimeRange] = useState("90d");
  const [showDetails, setShowDetails] = useState(false);
  
  // Sample data for different time ranges
  const dataSets = {
    "30d": {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      data: [180, 240, 320, 420],
      percentChange: 18.2,
      details: {
        topSources: [
          { name: "Direct Traffic", value: 125, percent: 35 },
          { name: "Social Media", value: 110, percent: 31 },
          { name: "Email Campaign", value: 85, percent: 24 },
          { name: "Referral Links", value: 35, percent: 10 }
        ],
        conversionRate: "2.8%",
        avgSessionDuration: "3m 42s"
      }
    },
    "90d": {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      data: [120, 190, 300, 420, 310, 600],
      percentChange: 42.8,
      details: {
        topSources: [
          { name: "Direct Traffic", value: 420, percent: 38 },
          { name: "Social Media", value: 350, percent: 32 },
          { name: "Email Campaign", value: 220, percent: 20 },
          { name: "Referral Links", value: 110, percent: 10 }
        ],
        conversionRate: "3.1%",
        avgSessionDuration: "4m 15s"
      }
    },
    "1y": {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      data: [800, 1200, 950, 1500],
      percentChange: 87.5,
      details: {
        topSources: [
          { name: "Direct Traffic", value: 1800, percent: 40 },
          { name: "Social Media", value: 1350, percent: 30 },
          { name: "Email Campaign", value: 900, percent: 20 },
          { name: "Referral Links", value: 450, percent: 10 }
        ],
        conversionRate: "3.5%",
        avgSessionDuration: "4m 50s"
      }
    }
  };

  const { labels, data, percentChange, details } = dataSets[timeRange];

  const chartData = {
    labels,
    datasets: [
      {
        data,
        borderColor: "#6366f1",
        borderWidth: 3,
        tension: 0.3,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(99, 102, 241, 0.3)");
          gradient.addColorStop(1, "rgba(99, 102, 241, 0)");
          return gradient;
        },
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: "#6366f1",
        pointBorderColor: "#fff",
        pointBorderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { 
        display: false,
        suggestedMin: Math.min(...data) * 0.8,
        suggestedMax: Math.max(...data) * 1.2
      },
      x: { 
        grid: { display: false },
        ticks: {
          color: "#64748b",
          font: {
            family: "'Inter', sans-serif"
          }
        }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#f8fafc",
        bodyColor: "#e2e8f0",
        borderColor: "#334155",
        borderWidth: 1,
        padding: 12,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            return `Referrals: ${context.raw}`;
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Referral Growth</h3>
          <div className="flex items-center mt-1">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {Math.max(...data).toLocaleString()}
            </span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs flex items-center ${
              percentChange >= 0 
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            }`}>
              {percentChange >= 0 ? "↑" : "↓"} {Math.abs(percentChange)}%
              <FiInfo className="ml-1" size={12} />
            </span>
          </div>
        </div>
        
        <div className="flex gap-1 bg-slate-100/50 dark:bg-slate-700/50 p-1 rounded-lg">
          {["30d", "90d", "1y"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`text-xs px-3 py-1 rounded-md transition-colors ${
                timeRange === range
                  ? "bg-white dark:bg-slate-600 shadow text-blue-600 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-600/30"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      
      <motion.div 
        key={timeRange}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 250 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden"
      >
        <Line 
          data={chartData} 
          options={chartOptions}
          redraw={false}
        />
      </motion.div>
      
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
          <FiInfo className="mr-1" size={14} />
          <span>+{percentChange}% vs previous period</span>
        </div>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          {showDetails ? "Hide details" : "View detailed analytics"}
          {showDetails ? (
            <FiChevronUp className="ml-1" />
          ) : (
            <FiArrowUpRight className="ml-1" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 overflow-hidden"
          >
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-3">Referral Sources</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Top Sources</h5>
                  <div className="space-y-3">
                    {details.topSources.map((source, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-700 dark:text-slate-300">{source.name}</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {source.value.toLocaleString()} ({source.percent}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full" 
                            style={{ width: `${source.percent}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-100/50 dark:bg-slate-700/50 p-4 rounded-lg">
                    <h5 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Conversion Rate</h5>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{details.conversionRate}</p>
                  </div>
                  <div className="bg-slate-100/50 dark:bg-slate-700/50 p-4 rounded-lg">
                    <h5 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Avg. Session</h5>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{details.avgSessionDuration}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </>
  );
}