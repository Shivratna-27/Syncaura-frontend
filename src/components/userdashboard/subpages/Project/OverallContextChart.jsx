import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { useState } from "react";

const data = [
  { name: "Active", value: 65, color: "#00D2FF" },
  { name: "Completed", value: 25, color: "#22C55E" },
  { name: "At Risk", value: 10, color: "#EF4444" },
  { name: "Upcoming", value: 0, color: "#94a3b8" },
];

const SUCCESS_RATE = 82;

const OverallContextChart = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-white text-black dark:bg-[#1E1E1E] dark:text-white rounded-xl p-6 border border-slate-200 dark:border-[#2d2f31] transition-colors"
    >
      {/* Title */}
      <h2 className="text-2xl font-bold mb-6">
        Overall Context
      </h2>

      <div className="flex flex-col md:flex-row items-center gap-12">

        {/* Chart */}
        <div className="w-[220px] h-[220px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={75}
                outerRadius={95}
                stroke="none"
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.color}
                    opacity={
                      activeIndex === null || activeIndex === index ? 1 : 0.4
                    }
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold">
              {SUCCESS_RATE}%
            </span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 dark:text-[#94a3b8]">
              Success Rate
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-10 gap-y-4 justify-center md:justify-start">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <span
                className="size-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-slate-700 dark:text-[#94a3b8]">
                  {item.name}
                </span>
                <span className="text-xs text-slate-500 dark:text-[#64748b]">
                  ({item.value}%)
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </motion.div>
  );
};

export default OverallContextChart;