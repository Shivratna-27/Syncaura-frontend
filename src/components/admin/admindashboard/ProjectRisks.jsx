import React from "react";
import { motion } from "framer-motion";

const ProjectRisks = () => {

  const data = [
    {
      name: "Alpha Redesign",
      risk: "Backend integration delay",
      owner: "John D.",
      initials: "JD",
      avatarColor: "bg-purple-100 text-purple-600 dark:bg-purple-600 dark:text-white",
      severity: "High",
      sevColor: "text-red-600 bg-red-50 border-red-100 dark:bg-transparent dark:border-red-600 dark:text-red-500"
    },
    {
      name: "Mobile App v2",
      risk: "Resource shortage in QA",
      owner: "Sarah M.",
      initials: "SM",
      avatarColor: "bg-blue-100 text-blue-600 dark:bg-blue-600 dark:text-white",
      severity: "Medium",
      sevColor: "text-yellow-600 bg-yellow-50 border-yellow-100 dark:bg-transparent dark:border-yellow-600 dark:text-yellow-500"
    },
    {
      name: "Cloud Migration",
      risk: "Minor budget variance",
      owner: "Alex K.",
      initials: "AK",
      avatarColor: "bg-green-100 text-green-600 dark:bg-green-600 dark:text-white",
      severity: "Low",
      sevColor: "text-gray-600 bg-gray-50 border-gray-200 dark:bg-transparent dark:border-green-600 dark:text-green-500"
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const row = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (

    <motion.div
      className="bg-white dark:bg-[#0d1117] rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 mt-6 overflow-hidden transition-colors duration-300"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >

      {/* Header */}
      <div className="p-4 px-6 flex justify-between items-center border-b border-gray-100 dark:border-zinc-800/50">

        <h2 className="text-2xl font-bold  text-black dark:text-white">
          Project Risks
        </h2>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-xl font-bold text-gray-900 dark:text-[#00a3ff]"
        >
          View All
        </motion.button>

      </div>

      {/* Table */}
      <div className="overflow-hidden">

        <table className="w-full text-left">

          <thead>
            <tr className="bg-gray-50/50 dark:bg-[#161b22] text-[13px] uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-zinc-800">
              <th className="py-4 px-6 text-l font-semibold dark:text-white">Project Name</th>
              <th className="py-4 px-6 text-l font-semibold dark:text-white">Risk Description</th>
              <th className="py-4 px-6 text-l font-semibold dark:text-white">Owner</th>
              <th className="py-4 pr-20 text-l text-right font-semibold dark:text-white">Severity</th>
            </tr>
          </thead>

          <motion.tbody
            variants={container}
            initial="hidden"
            animate="show"
            className="divide-y divide-gray-100 dark:divide-zinc-800/50"
          >

            {data.map((item, index) => (

              <motion.tr
                key={index}
                variants={row}
                whileHover={{ scale: 1.01 }}
                className="hover:bg-gray-50/30 dark:hover:bg-zinc-800/20 transition-colors"
              >

                <td className="py-4 px-6 text-sm text-black dark:text-gray-300">
                  {item.name}
                </td>

                <td className="py-4 px-6 text-sm text-black dark:text-gray-400">
                  {item.risk}
                </td>

                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">

                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${item.avatarColor}`}>
                      {item.initials}
                    </div>

                    <span className="text-sm text-black dark:text-gray-300">
                      {item.owner}
                    </span>

                  </div>
                </td>

                <td className="py-4 pr-20 text-right">
                  <span className={`px-3 py-0.5 rounded-full text-[12px] font-medium border ${item.sevColor}`}>
                    {item.severity}
                  </span>
                </td>

              </motion.tr>

            ))}

          </motion.tbody>

        </table>

      </div>

    </motion.div>
  );
};

export default ProjectRisks;