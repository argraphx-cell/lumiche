import { useCallback, useEffect, useRef, useState } from "react";
import hero1 from "@/assets/hero1.PNG";
import hero2 from "@/assets/hero2.PNG";
import hero3 from "@/assets/hero3.PNG";

const SLIDES = [hero1, hero2, hero3];

const BLOCK = 8;            // fine mosaic block size in px
const HOLD_MS = 5000;
const DISSOLVE_FRAMES = 72; // ~1.2 s at 60 fps

function drawTop(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  W: number,
  H: number
) {
  if (!img.naturalWidth) return;
  // Scale so the image fills the full canvas width exactly.
  // sy=0: always sample from the very top of the source.
  // Anything below the canvas bottom is simply not drawn (cropped).
  const scale = W / img.naturalWidth;
  const srcH = Math.min(H / scale, img.naturalHeight);
  const dstH = srcH * scale; // equals H when image is tall enough
  ctx.drawImage(img, 0, 0, img.naturalWidth, srcH, 0, 0, W, dstH);
}

export default function HeroSlideshow() {
  const [visIdx, setVisIdx] = useState(0);
  const [dotIdx, setDotIdx] = useState(0);
  const [showCanvas, setShowCanvas] = useState(false);
  // Read navbar height synchronously so there is no layout flash, then keep
  // it updated via ResizeObserver for any zoom/resize changes.
  const [navbarH, setNavbarH] = useState(
    () => document.querySelector<HTMLElement>("header")?.offsetHeight ?? 0
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgEls = useRef<HTMLImageElement[]>([]);
  const rafRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const busyRef = useRef(false);
  const currentRef = useRef(0);

  useEffect(() => {
    SLIDES.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      imgEls.current[i] = img;
    });
  }, []);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>("header");
    if (!header) return;
    const ro = new ResizeObserver(() => setNavbarH(header.offsetHeight));
    ro.observe(header);
    return () => ro.disconnect();
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
        // Fisher-Yates shuffle of all block coords
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

        ctx.clearRect(0, 0, W, H);
        drawTop(ctx, fromImg, W, H);

        // Offscreen canvas holds the destination image
        const off = document.createElement("canvas");
        off.width = W;
        off.height = H;
        drawTop(off.getContext("2d")!, toImg, W, H);

        const bpf = Math.max(1, Math.ceil(blocks.length / DISSOLVE_FRAMES));
        let revealed = 0;

        const step = () => {
          const end = Math.min(revealed + bpf, blocks.length);

          // Build a clip path covering only the new blocks this frame,
          // then stamp the entire destination image through it — one GPU call.
          ctx.save();
          const path = new Path2D();
          for (let i = revealed; i < end; i++) {
            const [c, r] = blocks[i];
            path.rect(c * BLOCK, r * BLOCK, BLOCK, BLOCK);
          }
          ctx.clip(path);
          ctx.drawImage(off, 0, 0);
          ctx.restore();

          revealed = end;
          if (revealed >= blocks.length) { onComplete(); return; }
          rafRef.current = requestAnimationFrame(step);
        };

        rafRef.current = requestAnimationFrame(step);
      };

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
      setShowCanvas(true);

      dissolve(fromIdx, toIdx, () => {
        currentRef.current = toIdx;
        setVisIdx(toIdx);
        setShowCanvas(false);
        busyRef.current = false;

        timerRef.current = setTimeout(() => {
          goTo((toIdx + 1) % SLIDES.length);
        }, HOLD_MS);
      });
    },
    [dissolve]
  );

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
      style={{ height: "85vh", backgroundColor: "#FFFFFF", marginTop: navbarH, padding: 0 }}
    >
      {/* Current slide image — top-aligned */}
      <img
        src={SLIDES[visIdx]}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: showCanvas ? 0 : 1, objectPosition: "top center" }}
      />

      {/* Pixel-dissolve canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: showCanvas ? "block" : "none" }}
      />

      {/* CTA — bottom center, above dots */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
        <a
          href="https://kickstarter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-12 py-4 text-[11px] tracking-[0.28em] uppercase transition-colors duration-300 whitespace-nowrap"
          style={{ border: "1px solid rgba(17,17,17,0.5)", color: "rgba(17,17,17,0.5)" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "white"; e.currentTarget.style.color = "white"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(17,17,17,0.5)"; e.currentTarget.style.color = "rgba(17,17,17,0.5)"; }}
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
              backgroundColor: i === dotIdx ? "white" : "rgba(255,255,255,0.38)",
              transform: i === dotIdx ? "scale(1.45)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
