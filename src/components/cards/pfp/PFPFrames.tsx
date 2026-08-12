import type { PointerEvent as ReactPointerEvent } from "react";
import type { CardData } from "../../../types";
import { filterCss } from "../../../lib/imageProcess";

type Box = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type Template = {
  src: string;
  ratio: string;
  photo: Box;
  label: string;
  glow: string;
};

const templates: Record<string, Template> = {
  "pfp-classic": {
    src: "/templates/pfp-classic.png",
    ratio: "620/666",
    photo: {
      x: 13.3 ,
      y: 13.6,
      w: 73.4,
      h: 56.7,
    },
    label: "CLASSIC COAST",
    glow: "",
  },

  "pfp-neon": {
    src: "/templates/pfp-neon.png",
    ratio: "578/661",
    photo: {
      x: 12.5,
      y: 15.8,
      w: 75.0,
      h: 57.5,
    },
    label: "NEON BEACH",
    glow: "",
  },

  "pfp-village": {
    src: "/templates/pfp-village.png",
    ratio: "555/657",
    photo: {
      x: 13.3,
      y: 18.8,
      w: 73.5,
      h: 57.5,
    },
    label: "VILLAGE SUNSET",
    glow: "",
  },

  "pfp-jungle": {
    src: "/templates/pfp-jungle.png",
    ratio: "578/660",
    photo: {
      x: 15.2,
      y: 19.89,
      w: 70.5,
      h: 57.5,
    },
    label: "JUNGLE PORTAL",
    glow: "#",
  },
};

export default function PFPFrame({
  card,
  onStickerMove,
}: {
  card: CardData;
  exporting?: boolean;
  onStickerMove?: (
    i: number,
    x: number,
    y: number,
  ) => void;
}) {
  const t =
    templates[card.variant] ||
    templates["pfp-classic"];

  return (
    <div
      id="pfp-template-card"
      className="relative overflow-hidden rounded-[2rem] bg-black"
      style={{
        aspectRatio: t.ratio,
        width: "min(88vw, 520px)",
      }}
    >
      {/* =====================================================
          USER PHOTO
          ===================================================== */}

      {/* USER PHOTO */}
<div
  className="absolute z-20 overflow-hidden rounded-full"
  style={{
    left: `${t.photo.x}%`,
    top: `${t.photo.y}%`,
    width: `${t.photo.w}%`,
    aspectRatio: "1 / 1",
  }}
>
  {card.photo ? (
    <img
      src={card.photo}
      alt=""
      className="absolute inset-0 h-full w-full object-cover"
      style={{
        filter: filterCss(card.filter),
        transform: `
          translate(${card.photoX}px, ${card.photoY}px)
          scale(${card.photoZoom})
          rotate(${card.photoRotate}deg)
        `,
        transformOrigin: "center center",
      }}
    />
  ) : (
    <div className="grid h-full w-full place-items-center bg-black/20 text-6xl">
      👤
    </div>
  )}
</div>

      {/* =====================================================
          TEMPLATE ART
          ===================================================== */}

      <img
  src={t.src}
  alt=""
  className="pointer-events-none absolute inset-0 z-10 h-full w-full select-none"
  draggable={false}
/>

      {/* =====================================================
          GLOW
          
          IMPORTANT:
          Do NOT use the old huge box-shadow here.
          html2canvas was spreading that translucent shadow
          over the entire exported image.
          ===================================================== */}

      {t.glow && (
        <div
          className="pointer-events-none absolute inset-0 z-30 rounded-[2rem]"
          style={{
            border: `2px solid ${t.glow}`,
            boxShadow: `inset 0 0 12px ${t.glow}55`,
          }}
        />
      )}

      {/* =====================================================
          RARITY
          ===================================================== */}

      <div className="pointer-events-none absolute left-[4%] top-[4%] z-40 rounded-full border border-white/60 bg-black/40 px-4 py-2 text-xs font-black tracking-[0.12em] text-white backdrop-blur-sm">
        {card.rarity || "COMMON"}
      </div>

      {/* =====================================================
          TEMPLATE LABEL
          ===================================================== */}

      <div className="pointer-events-none absolute bottom-[2.5%] left-1/2 z-40 -translate-x-1/2 rounded-full bg-black/70 px-6 py-2 text-xs font-black tracking-[0.18em] text-white">
        {t.label}
      </div>

      {/* =====================================================
          STICKERS
          ===================================================== */}

      {card.stickers.map((st, i) => (
        <span
          key={st.id + i}
          onClick={(e) =>
            e.stopPropagation()
          }
          onPointerDown={(e) =>
            startDrag(
              e,
              i,
              onStickerMove,
            )
          }
          className={`absolute z-50 select-none ${
            onStickerMove
              ? "cursor-grab active:cursor-grabbing"
              : ""
          }`}
          style={{
            left: `${st.x}%`,
            top: `${st.y}%`,
            fontSize: 28 * st.s,
            transform: `translate(-50%,-50%) rotate(${st.r}deg)`,
            touchAction: "none",
          }}
        >
          {st.emoji}
        </span>
      ))}

      {/* =====================================================
          OUTER BORDER
          ===================================================== */}

      <div className="pointer-events-none absolute inset-0 z-[60] rounded-[2rem] ring-1 ring-white/10" />
    </div>
  );
}

function box(b: Box) {
  return {
    left: `${b.x}%`,
    top: `${b.y}%`,
    width: `${b.w}%`,
    height: `${b.h}%`,
  } as const;
}

function startDrag(
  e: ReactPointerEvent,
  i: number,
  move?: (
    i: number,
    x: number,
    y: number,
  ) => void,
) {
  if (!move) return;

  e.stopPropagation();

  const el =
    e.currentTarget
      .parentElement as HTMLElement;

  const upd = (
    ev: globalThis.PointerEvent,
  ) => {
    const r =
      el.getBoundingClientRect();

    move(
      i,
      Math.max(
        2,
        Math.min(
          98,
          ((ev.clientX - r.left) /
            r.width) *
            100,
        ),
      ),
      Math.max(
        2,
        Math.min(
          98,
          ((ev.clientY - r.top) /
            r.height) *
            100,
        ),
      ),
    );
  };

  upd(e.nativeEvent);

  window.addEventListener(
    "pointermove",
    upd,
  );

  window.addEventListener(
    "pointerup",
    () =>
      window.removeEventListener(
        "pointermove",
        upd,
      ),
    { once: true },
  );
}