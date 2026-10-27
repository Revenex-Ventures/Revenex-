interface BrandLogoProps {
  tone?: "dark" | "light";
  size?: "xs" | "sm" | "md" | "lg";
  stacked?: boolean;
  full?: boolean;
  className?: string;
}
const sizes = {
  xs: { mark: 18, word: 70 },
  sm: { mark: 32, word: 144 },
  md: { mark: 40, word: 170 },
  lg: { mark: 96, word: 260 },
};
export function BrandLogo({
  tone = "dark",
  size = "md",
  stacked = false,
  full = false,
  className = "",
}: BrandLogoProps) {
  const dimensions = sizes[size];
  return (
    <span
      className={`brand-logo ${stacked ? "brand-logo--stacked" : ""} ${className}`}
      role="img"
      aria-label="Revenex Ventures Pvt. Ltd. — Software Solutions"
    >
      <img
        src={`/brand/mark-${tone}.svg`}
        alt=""
        aria-hidden="true"
        width={dimensions.mark}
        height={Math.round((dimensions.mark * 128) / 168)}
        className="brand-logo__mark"
      />
      <span className="brand-logo__type" style={{ width: dimensions.word }}>
        <img
          src={`/brand/wordmark-${tone}.svg`}
          alt=""
          aria-hidden="true"
          width={dimensions.word}
          height={Math.round((dimensions.word * 50) / 461)}
        />
        {full && (
          <>
            <span className="brand-logo__company">Ventures Pvt. Ltd.</span>
            <span
              className="brand-logo__descriptor"
              style={{ color: tone === "light" ? "#C0E8F0" : "#17375D" }}
            >
              Software Solutions
            </span>
          </>
        )}
      </span>
    </span>
  );
}
