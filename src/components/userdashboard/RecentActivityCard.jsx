import React from "react";
import { motion } from "framer-motion";
import { Check, GitPullRequest, MessageSquareText } from "lucide-react";

const activities = [
  {
    icon: <GitPullRequest className="w-5 h-5" />,
    title: (
      <>
        <span className="font-semibold">Merged PR #452</span> into{" "}
        <span className="text-blue-600 dark:text-blue-400">main</span>
      </>
    ),
    time: "2 hours ago",
    color: "bg-blue-500",
  },
  {
    icon: <Check className="w-5 h-5" />,
    title: (
      <>
        <span className="font-semibold">Completed Task:</span> Finalize documentation
      </>
    ),
    time: "5 hours ago",
    color: "bg-green-500",
  },
  {
    icon: <MessageSquareText className="w-5 h-5" />,
    title: (
      <>
        <span className="font-semibold">Sarah Chen</span> commented on Login Refactor
      </>
    ),
    time: "Yesterday",
    color: "bg-gray-400",
  },
];

const RecentActivityCard = () => {
  return (
    <div
      className="
        w-full
        p-5
        rounded-2xl
        bg-white
        dark:bg-[#1E1E1E]
        shadow-[0_0_12px_#00000020]
        dark:shadow-[0_0_12px_#00000080]
      "
    >
      {/* Title */}
      <h2 className="text-[#64748B] dark:text-gray-200 font-bold text-xl sm:text-2xl mb-6">
        Recent Activity
      </h2>

      <div className="relative flex flex-col gap-6">

        {/* Timeline Line */}
        <span
          className="
            absolute left-4 top-0
            h-full w-[2px]
            bg-[#E3E5EA] dark:bg-[#2A2A2A]
          "
        />

        {activities.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.4 }}
            className="flex items-start gap-4 relative"
          >
            {/* Icon */}
            <div
              className={`
                w-9 h-9
                rounded-full
                flex items-center justify-center
                text-white
                ${item.color}
                z-10
              `}
            >
              {item.icon}
            </div>

            {/* Content */}
            <div className="flex flex-col">
              <div className="text-[#64748B] dark:text-gray-200 text-sm">
                {item.title}
              </div>

              <div className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                {item.time}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivityCard;