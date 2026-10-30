import { useEffect, useRef } from "react";

/** Low-res canvas upscaled with pixelated rendering: drifting stars, a pixel planet and a scrolling perspective grid. */
export function PixelBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const W = 320;
    let H = 180;
    let raf = 0;
    const resize = () => {
      H = Math.round((W * window.innerHeight) / window.innerWidth);
      c.width = W;
      c.height = H;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random() * W,
      y: Math.random() * 200,
      z: 1 + Math.floor(Math.random() * 3),
    }));
    const css = getComputedStyle(document.documentElement);
    const primary = css.getPropertyValue("--primary").trim() || "#1e6f80";

    const draw = (t: number) => {
      const s = t / 1000;
      ctx.fillStyle = "#0b0d0f";
      ctx.fillRect(0, 0, W, H);

      // stars
      for (const st of stars) {
        st.x -= 0.04 * st.z;
        if (st.x < 0) st.x = W;
        const tw = Math.sin(s * 2 + st.y) > 0.6 ? 1 : 0;
        ctx.fillStyle = st.z === 3 ? "#f2e6d0" : st.z === 2 ? "#8a7a6a" : "#4a3d35";
        ctx.fillRect(Math.floor(st.x), Math.floor(st.y % (H * 0.6)), 1 + (st.z === 3 ? tw : 0), 1);
      }

      // dithered pixel planet
      const px = Math.floor(W * 0.78), py = Math.floor(H * 0.22), r = 18;
      for (let y = -r; y <= r; y++)
        for (let x = -r; x <= r; x++) {
          const d = x * x + y * y;
          if (d > r * r) continue;
          const light = (x + y) / (r * 2);
          const dither = (x + y) & 1;
          if (light > 0.2 && dither) continue;
          ctx.fillStyle = light > 0.35 ? "#0f2a30" : primary;
          ctx.fillRect(px + x, py + y, 1, 1);
        }
      // ring
      ctx.fillStyle = "#f2e6d0";
      for (let a = 0; a < Math.PI * 2; a += 0.05) {
        const rx = Math.cos(a) * 30, ry = Math.sin(a) * 6;
        if (ry < 0 && rx * rx + (ry * 3) ** 2 < r * r) continue;
        ctx.fillRect(Math.round(px + rx), Math.round(py + ry), 1, 1);
      }

      // perspective grid floor
      const horizon = Math.floor(H * 0.62);
      ctx.fillStyle = "#0c1214";
      ctx.fillRect(0, horizon, W, H - horizon);
      ctx.fillStyle = "#1a5a67";
      for (let i = 0; i < 14; i++) {
        const p = ((i + (s * 0.6) % 1) / 14) ** 2;
        const y = Math.floor(horizon + p * (H - horizon));
        ctx.fillRect(0, y, W, 1);
      }
      for (let i = -12; i <= 12; i++) {
        for (let y = horizon; y < H; y += 1) {
          const k = (y - horizon) / (H - horizon);
          ctx.fillRect(Math.floor(W / 2 + i * 6 + i * k * 40), y, 1, 1);
        }
      }
      ctx.fillStyle = primary;
      ctx.fillRect(0, horizon, W, 1);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <canvas ref={ref} className="pixelated h-full w-full opacity-90" />
      <div className="scanlines absolute inset-0" />
      <div className="vignette absolute inset-0" />
    </div>
  );
}
