import { useCallback, useEffect, useRef, useState } from "react";
import hero1 from "@/assets/hero1.PNG";
import hero2 from "@/assets/hero2.PNG";
import hero3 from "@/assets/hero3.PNG";

const SLIDES = [hero1, hero2, hero3];

const COLS = 20;
const ROWS = 14;
const TOTAL = COLS * ROWS;
const HOLD_MS = 5000;
const SPREAD_S = 0.85;   // random-delay spread across all cells
const CELL_S = 0.2;      // each cell's individual opacity duration
const DISSOLVE_MS = (SPREAD_S + CELL_S) * 1000 + 100; // total + buffer

// Exact CSS required by spec
const SLIDE_IMG: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "top center",
  position: "absolute",
  top: 0,
  left: 0,
};

function makeDelays(): number[] {
  // Fisher-Yates shuffle → map rank to a delay in [0, SPREAD_S]
  const arr = Array.from({ length: TOTAL }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.map(rank => (rank / TOTAL) * SPREAD_S);
}

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [nextIdx, setNextIdx] = useState(0);
  const [dotIdx, setDotIdx] = useState(0);
  const [showMosaic, setShowMosaic] = useState(false);
  // Separate flag so we can let cells mount at opacity:0 before triggering transition
  const [mosaicActive, setMosaicActive] = useState(false);
  const [delays, setDelays] = useState<number[]>(() => Array(TOTAL).fill(0));

  const busyRef = useRef(false);
  const currentRef = useRef(0);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const dissolveTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // One RAF after showMosaic=true so cells start at 0 and animate to 1
  useEffect(() => {
    if (!showMosaic) { setMosaicActive(false); return; }
    const id = requestAnimationFrame(() => setMosaicActive(true));
    return () => cancelAnimationFrame(id);
  }, [showMosaic]);

  const goTo = useCallback((toIdx: number) => {
    if (busyRef.current || toIdx === currentRef.current) return;
    busyRef.current = true;
    clearTimeout(holdTimerRef.current);
    clearTimeout(dissolveTimerRef.current);

    setNextIdx(toIdx);
    setDotIdx(toIdx);
    setDelays(makeDelays());
    setShowMosaic(true);

    dissolveTimerRef.current = setTimeout(() => {
      currentRef.current = toIdx;
      setCurrent(toIdx);
      setShowMosaic(false);
      busyRef.current = false;

      holdTimerRef.current = setTimeout(() => {
        goTo((toIdx + 1) % SLIDES.length);
      }, HOLD_MS);
    }, DISSOLVE_MS);
  }, []);

  useEffect(() => {
    holdTimerRef.current = setTimeout(() => goTo(1), HOLD_MS);
    return () => {
      clearTimeout(holdTimerRef.current);
      clearTimeout(dissolveTimerRef.current);
    };
  }, [goTo]);

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "85vh",
        backgroundColor: "#FFFFFF",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Base slide */}
      <img src={SLIDES[current]} alt="" style={SLIDE_IMG} />

      {/* Mosaic dissolve grid — mounts when a transition begins */}
      {showMosaic && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
            zIndex: 1,
          }}
        >
          {Array.from({ length: TOTAL }, (_, i) => {
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            return (
              <div
                key={i}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  // Cells start transparent; mosaicActive flips them to 1 with per-cell delay
                  opacity: mosaicActive ? 1 : 0,
                  transition: mosaicActive
                    ? `opacity ${CELL_S}s ease ${delays[i].toFixed(3)}s`
                    : "none",
                }}
              >
                {/*
                  The img is sized to the full container (COLS×ROWS of the cell),
                  then offset so this cell's window shows exactly its portion.
                  Percentages are relative to the containing cell, so:
                    width: COLS*100% = container width
                    height: ROWS*100% = container height
                    left: -col*100% = -col * cell_width
                    top:  -row*100% = -row * cell_height
                */}
                <img
                  src={SLIDES[nextIdx]}
                  alt=""
                  style={{
                    position: "absolute",
                    width: `${COLS * 100}%`,
                    height: `${ROWS * 100}%`,
                    left: `${-col * 100}%`,
                    top: `${-row * 100}%`,
                    objectFit: "cover",
                    objectPosition: "top center",
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* CTA button — bottom center, above dots */}
      <div
        style={{
          position: "absolute",
          bottom: "5rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <a
          href="https://kickstarter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-12 py-4 text-[11px] tracking-[0.28em] uppercase transition-colors duration-300 whitespace-nowrap"
          style={{ border: "1px solid rgba(17,17,17,0.5)", color: "rgba(17,17,17,0.5)" }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "white";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "rgba(17,17,17,0.5)";
            e.currentTarget.style.color = "rgba(17,17,17,0.5)";
          }}
        >
          Back This Project
        </a>
      </div>

      {/* Dot indicators */}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "0.75rem",
          zIndex: 10,
        }}
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: "0.5rem",
              height: "0.5rem",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              padding: 0,
              backgroundColor: i === dotIdx ? "white" : "rgba(255,255,255,0.38)",
              transform: i === dotIdx ? "scale(1.45)" : "scale(1)",
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>
    </section>
  );
}
