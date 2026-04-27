import { useInView } from "@/hooks/use-scroll";

export default function CheckmarkAnimation() {
  const [ref, inView] = useInView(0.5);

  return (
    <div ref={ref} className="checkmark-wrap" style={{ display: "inline-flex", justifyContent: "center" }}>
      <svg width="64" height="64" viewBox="0 0 64 64" style={{ overflow: "visible" }}>
        <circle
          cx="32" cy="32" r="28"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="3"
          strokeDasharray="176"
          strokeDashoffset={inView ? "0" : "176"}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.8s cubic-bezier(0.65,0,0.35,1)",
            filter: "drop-shadow(0 0 8px rgba(0,212,170,0.6))",
          }}
        />
        <polyline
          points="20,34 28,42 44,24"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="40"
          strokeDashoffset={inView ? "0" : "40"}
          style={{
            transition: "stroke-dashoffset 0.6s cubic-bezier(0.65,0,0.35,1) 0.5s",
            filter: "drop-shadow(0 0 6px rgba(0,212,170,0.8))",
          }}
        />
        {inView && (
          <circle cx="32" cy="32" r="28" fill="none" stroke="var(--color-primary)" strokeWidth="2" opacity="0.3">
            <animate attributeName="r" from="28" to="42" dur="1s" begin="0.8s" fill="freeze" />
            <animate attributeName="opacity" from="0.4" to="0" dur="1s" begin="0.8s" fill="freeze" />
          </circle>
        )}
      </svg>
    </div>
  );
}
