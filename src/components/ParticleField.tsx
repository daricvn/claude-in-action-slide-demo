import { onMount, onCleanup, type Component } from 'solid-js';

/**
 * Animated canvas background — the headline "wow".
 *
 * A drifting constellation: particles float, link to nearby neighbours with
 * additive (neon) lines, react to the cursor, and occasionally a shooting star
 * streaks across. The whole field's colour lerps to the active slide's accent,
 * so navigating recolours the universe in one smooth motion.
 *
 * Rendered with `globalCompositeOperation = 'lighter'` so overlapping strokes
 * bloom — that's what gives the expensive, glowing look on the dark canvas.
 */

const PALETTE: [number, number, number][] = [
  [103, 232, 249], // cyan
  [192, 132, 252], // violet
  [110, 231, 183], // emerald
  [129, 140, 248], // indigo
];

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number;
  life: number; // 1 → 0
}

const LINK_DIST = 132; // px at which two particles connect
const MOUSE_R2 = 16000; // squared radius of cursor influence

const ParticleField: Component<{ slide: number }> = (props) => {
  let canvas!: HTMLCanvasElement;

  onMount(() => {
    const ctx = canvas.getContext('2d')!;
    // Cap DPR at 1.5: at 2 a 1440p screen repaints ~14.7M px/frame. 1.5 halves
    // the fill cost with no visible difference on the soft, blurred field.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const FRAME_MS = 1000 / 30; // throttle the field to 30fps (plenty for drift)

    let w = 0;
    let h = 0;
    let raf = 0;
    let parts: P[] = [];
    const stars: Star[] = [];
    const mouse = { x: -9999, y: -9999 };
    const cur: [number, number, number] = [...PALETTE[0]];
    let nextStarIn = 60; // frames until next shooting star

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    function resize() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Density scales with area, clamped so big screens stay performant.
      // Cap lowered to 90: the link pass is O(n²), so 150→90 cuts the inner
      // loop from ~11k to ~4k pairs/frame.
      const count = Math.min(90, Math.max(45, Math.round((w * h) / 20000)));
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.5 + 0.7,
      }));
    }

    function spawnStar() {
      const fromLeft = Math.random() > 0.5;
      const speed = 7 + Math.random() * 5;
      stars.push({
        x: fromLeft ? -40 : w + 40,
        y: Math.random() * h * 0.6,
        vx: fromLeft ? speed : -speed,
        vy: speed * (0.35 + Math.random() * 0.3),
        len: 120 + Math.random() * 120,
        life: 1,
      });
    }

    let lastDraw = 0;
    function frame(now: number) {
      // Keep the rAF chain alive (it auto-pauses when the tab is hidden), but
      // only actually draw at ~30fps. The drift is slow enough that 30 looks
      // identical to 60 while halving CPU/GPU work.
      raf = requestAnimationFrame(frame);
      if (now - lastDraw < FRAME_MS) return;
      lastDraw = now;

      // Ease the field colour toward the active slide's accent.
      const tg = PALETTE[props.slide % PALETTE.length];
      cur[0] += (tg[0] - cur[0]) * 0.045;
      cur[1] += (tg[1] - cur[1]) * 0.045;
      cur[2] += (tg[2] - cur[2]) * 0.045;
      const r = Math.round(cur[0]);
      const g = Math.round(cur[1]);
      const b = Math.round(cur[2]);

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      // --- update particles ---
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x += w;
        else if (p.x > w) p.x -= w;
        if (p.y < 0) p.y += h;
        else if (p.y > h) p.y -= h;

        // Cursor gently pushes nearby particles outward (parallax feel).
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < MOUSE_R2) {
          const f = ((MOUSE_R2 - d2) / MOUSE_R2) * 0.8;
          const d = Math.sqrt(d2) || 1;
          p.x += (dx / d) * f;
          p.y += (dy / d) * f;
        }
      }

      // --- links between particles ---
      ctx.lineWidth = 0.7;
      for (let i = 0; i < parts.length; i++) {
        const a = parts[i];
        for (let j = i + 1; j < parts.length; j++) {
          const bp = parts[j];
          const dx = a.x - bp.x;
          const dy = a.y - bp.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            const o = (1 - dist / LINK_DIST) * 0.32;
            ctx.strokeStyle = `rgba(${r},${g},${b},${o})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(bp.x, bp.y);
            ctx.stroke();
          }
        }
      }

      // --- links to the cursor (interactive highlight) ---
      if (mouse.x > -9000) {
        for (const p of parts) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 170) {
            ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - dist / 170) * 0.5})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      // --- particle nodes with soft glow ---
      // No ctx.shadowBlur (one of the slowest Canvas2D ops, paid per node every
      // frame). Under 'lighter' compositing a translucent halo ring + bright
      // core gives the same bloom far cheaper.
      for (const p of parts) {
        ctx.fillStyle = `rgba(${r},${g},${b},0.18)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${r},${g},${b},0.95)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- shooting stars ---
      if (!reduced && --nextStarIn <= 0) {
        spawnStar();
        nextStarIn = 20 + Math.floor(Math.random() * 60);
      }
      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.012;
        if (s.life <= 0 || s.x < -80 || s.x > w + 80 || s.y > h + 80) {
          stars.splice(i, 1);
          continue;
        }
        const tx = s.x - (s.vx / Math.hypot(s.vx, s.vy)) * s.len;
        const ty = s.y - (s.vy / Math.hypot(s.vx, s.vy)) * s.len;
        const grad = ctx.createLinearGradient(s.x, s.y, tx, ty);
        grad.addColorStop(0, `rgba(255,255,255,${0.9 * s.life})`);
        grad.addColorStop(0.3, `rgba(${r},${g},${b},${0.6 * s.life})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
      }

      ctx.globalCompositeOperation = 'source-over';
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(frame);

    onCleanup(() => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    });
  });

  return (
    <canvas
      ref={canvas}
      class="fixed inset-0 w-full h-full z-0 pointer-events-none"
    />
  );
};

export default ParticleField;
