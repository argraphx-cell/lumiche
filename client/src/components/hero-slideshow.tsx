import { useCallback, useEffect, useRef, useState } from "react";
import hero1 from "@/assets/hero1.PNG";
import hero2 from "@/assets/hero2.PNG";
import hero3 from "@/assets/hero3.PNG";

const SLIDES = [
  { image: hero1, tagline: "Scarcity by design. Beauty by intention." },
  { image: hero2, tagline: "One piece. One person. Full intention." },
  { image: hero3, tagline: "Quiet luxury. Radical scarcity." },
];

const BLOCK = 36;         // mosaic block size in px
const HOLD_MS = 5000;     // display time per slide
const DISSOLVE_FRAMES = 72; // ~1.2 s at 60 fps

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  W: number,
  H: number
) {
  if (!img.naturalWidth) return;
  const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
  const sw = img.naturalWidth * scale;
  const sh = img.naturalHeight * scale;
  ctx.drawImage(img, (W - sw) / 2, (H - sh) / 2, sw, sh);
}

export default function HeroSlideshow() {
  const [visIdx, setVisIdx] = useState(0);
  const [dotIdx, setDotIdx] = useState(0);
  const [showCanvas, setShowCanvas] = useState(false);
  const [textOpacity, setTextOpacity] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgEls = useRef<HTMLImageElement[]>([]);
  const rafRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const busyRef = useRef(false);
  const currentRef = useRef(0);

  // Preload all images
  useEffect(() => {
    SLIDES.forEach((s, i) => {
      const img = new Image();
      img.src = s.image;
      imgEls.current[i] = img;
    });
  }, []);

  const dissolve = useCallback(
    (from: number, to: number, onComplete: () => void) => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) { onComplete(); return; }

      const W = container.clientWidth;
      const H = container.clientHeight;
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) { onComplete(); return; }

      const fromImg = imgEls.current[from];
      const toImg = imgEls.current[to];

      const run = () => {
        // Build a Fisher-Yates shuffled list of block coordinates
        const cols = Math.ceil(W / BLOCK);
        const rows = Math.ceil(H / BLOCK);
        const blocks: [number, number][] = [];
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) blocks.push([c, r]);
        }
        for (let i = blocks.length - 1; i > 0; i--) {
          const j = (Math.random() * (i + 1)) | 0;
          [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
        }

        // Seed canvas with the "from" image
        ctx.clearRect(0, 0, W, H);
        drawCover(ctx, fromImg, W, H);

        // Render "to" image into an offscreen canvas for block-copy source
        const off = document.createElement("canvas");
        off.width = W;
        off.height = H;
        const offCtx = off.getContext("2d")!;
        drawCover(offCtx, toImg, W, H);

        const bpf = Math.max(1, Math.ceil(blocks.length / DISSOLVE_FRAMES));
        let revealed = 0;

        const step = () => {
          const end = Math.min(revealed + bpf, blocks.length);
          for (let i = revealed; i < end; i++) {
            const [c, r] = blocks[i];
            const x = c * BLOCK;
            const y = r * BLOCK;
            // Copy one mosaic block from the "to" image
            ctx.drawImage(off, x, y, BLOCK, BLOCK, x, y, BLOCK, BLOCK);
          }
          revealed = end;
          if (revealed >= blocks.length) { onComplete(); return; }
          rafRef.current = requestAnimationFrame(step);
        };

        rafRef.current = requestAnimationFrame(step);
      };

      // Wait for both images to be loaded before starting
      let pending = 2;
      const ready = () => { if (--pending === 0) run(); };
      if (fromImg.complete) ready(); else fromImg.onload = ready;
      if (toImg.complete) ready(); else toImg.onload = ready;
    },
    []
  );

  const goTo = useCallback(
    (toIdx: number) => {
      if (busyRef.current || toIdx === currentRef.current) return;
      busyRef.current = true;
      clearTimeout(timerRef.current);
      cancelAnimationFrame(rafRef.current);

      const fromIdx = currentRef.current;
      setDotIdx(toIdx);
      setTextOpacity(0);
      setShowCanvas(true);

      dissolve(fromIdx, toIdx, () => {
        currentRef.current = toIdx;
        setVisIdx(toIdx);
        setShowCanvas(false);
        setTextOpacity(1);
        busyRef.current = false;

        timerRef.current = setTimeout(() => {
          goTo((toIdx + 1) % SLIDES.length);
        }, HOLD_MS);
      });
    },
    [dissolve]
  );

  // Kick off auto-advance on mount
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      goTo(1);
    }, HOLD_MS);
    return () => {
      clearTimeout(timerRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [goTo]);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: "85vh", backgroundColor: "#FFFFFF" }}
    >
      {/* Current slide image */}
      <img
        src={SLIDES[visIdx].image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: showCanvas ? 0 : 1 }}
      />

      {/* Pixel-dissolve canvas (shown during transitions only) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: showCanvas ? "block" : "none" }}
      />

      {/* Radial vignette for text legibility */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 70% at 50% 50%, rgba(0,0,0,0.38) 0%, transparent 100%)",
        }}
      />

      {/* Overlay text */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 z-10"
        style={{ transition: "opacity 0.55s ease", opacity: textOpacity }}
      >
        <h1
          className="font-serif italic leading-none tracking-tight text-white select-none"
          style={{
            fontSize: "clamp(4.5rem, 12vw, 10.5rem)",
            textShadow: "0 2px 40px rgba(0,0,0,0.2)",
          }}
        >
          LUMÍCHE
        </h1>

        <p
          className="mt-5 text-[11px] tracking-[0.35em] uppercase font-light text-white/85"
          style={{ textShadow: "0 1px 12px rgba(0,0,0,0.35)" }}
        >
          {SLIDES[dotIdx].tagline}
        </p>

        <a
          href="https://kickstarter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-block border border-white text-white px-12 py-4 text-[11px] tracking-[0.28em] uppercase hover:bg-white hover:text-ink transition-colors duration-300"
        >
          Back This Project
        </a>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor:
                i === dotIdx ? "white" : "rgba(255,255,255,0.38)",
              transform: i === dotIdx ? "scale(1.45)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
