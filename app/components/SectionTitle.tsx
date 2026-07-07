interface SectionTitleProps {
  en: string;
  ko: string;
  light?: boolean;
  align?: "center" | "left";
  noMargin?: boolean;
}

export default function SectionTitle({
  en,
  ko,
  light = false,
  align = "center",
  noMargin = false,
}: SectionTitleProps) {
  const textAlign = align === "center" ? "text-center" : "text-left";
  const itemsAlign = align === "center" ? "items-center" : "items-start";

  return (
    <div className={`flex flex-col ${itemsAlign} ${textAlign} ${noMargin ? "" : "mb-14"} gap-4`}>
      <span
        className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide ${
          light
            ? "bg-white/10 text-white/70"
            : "bg-[#2A8EA2]/10 text-[#1E7A8D]"
        }`}
      >
        {en}
      </span>
      <h2
        className={`text-4xl md:text-5xl font-bold tracking-tight ${
          light ? "text-white" : "text-gray-900"
        }`}
      >
        {ko}
      </h2>
    </div>
  );
}
