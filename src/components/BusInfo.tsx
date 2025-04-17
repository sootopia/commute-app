interface BusInfoProps {
  name: string;
  direction: string;
  type: string;
  time: string;
  bgColor: string;
  textColor: string;
}

const BusInfo = ({ name, direction, type, time, bgColor, textColor }: BusInfoProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2 items-center text-[15px] font-bold">
        <span
          className="inline-block text-xs py-1 px-2 rounded-lg"
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          {type}
        </span>
        <span className="text-slate-800">
          {name} <em className="text-slate-500 font-normal not-italic">{direction}</em>
        </span>
      </div>
      <span className="text-[15px] text-red-600 font-bold">{time}</span>
    </div>
  );
};

export default BusInfo;
