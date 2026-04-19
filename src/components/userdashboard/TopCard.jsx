const TopCard = ({ title, IconData, count, data = null, titleColor=null, countColor=null }) => {
  return (
    <div
      className="flex flex-col items-start justify-center gap-y-4 w-full px-5 py-3 rounded-lg shadow-[0_0_10px_0_#54545440] pb-8
      /* LIGHT MODE BACKGROUND */
      bg-[#FFFFFF] 
      /* DARK MODE BACKGROUND - Specific Fix */
      dark:bg-[#1E1E1E]"
    >
      <div className="flex items-center justify-between w-full ">
        <h1 className={`${titleColor ?? "text-[#B6C0CB]"} dark:text-gray-400 text-sm font-normal uppercase`}>
          {title}
        </h1>
        <div className="flex items-center justify-center ">{IconData}</div>
      </div>
      <div className="flex items-end justify-between w-full ">
        {/* Count: Black/Grey in light mode, Pure White in dark mode */}
        <h1 className={`${countColor ?? "text-[#5E6575]"} text-4xl font-bold dark:text-white`}>
          {count}
        </h1>
        {data && data}
      </div>
    </div>
  );
};

export default TopCard;