import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import QRCode from "qrcode";
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
  baseWidth: number;   // ← add this
  photo: Box;
  fields: Box[];
  qr: Box;
  text: "light" | "dark";
  qrPad?: number;
  labelFontSize?: number;
  valueFontSize?: number;
};

const templates: Record<string, Template> = {
  "card-glow": {
    src: "/templates/card-glow.png",
    ratio: "610/907",
    baseWidth: 610,        // ← was implicitly 477, now correct
    photo: { x: 8.1, y: 29.1, w: 38.5, h: 31.1 },
    fields: [
  { x: 51.8, y: 29.5, w: 40.7, h: 7.3 },
  { x: 51.8, y: 37.4, w: 40.7, h: 7.3 },
  { x: 51.8, y: 45, w: 40.7, h: 7.3 },
  { x: 51.8, y: 53, w: 40.7, h: 7.3 },
],
    qr: { x: 41.8, y: 81.7, w: 16.4, h: 10.7 },
    text: "dark",
    qrPad: 4,
    labelFontSize: 12,
  valueFontSize: 18,
  },
  "card-clean": {
    src: "/templates/card-clean.png",
    ratio: "477/712",
    baseWidth: 477,
    photo: { x: 9.5, y: 28.4, w: 36.1, h: 31.7 },
    fields: [
  { x: 51.8, y: 29.2, w: 40.7, h: 7.3 },
  { x: 51.8, y: 37.0, w: 40.7, h: 7.3 },
  { x: 51.8, y: 44.6, w: 40.7, h: 7.3 },
  { x: 51.8, y: 52, w: 40.7, h: 7.3 },
],
    qr: { x: 41.7, y: 79.5, w: 15.9, h: 10.8 },
    text: "dark",
    qrPad: 4,
    labelFontSize: 8,
  valueFontSize: 13,
  },
  "card-paper": {
    src: "/templates/card-paper.png",
    ratio: "476/713",
    baseWidth: 476,
    photo: { x: 9, y: 28.1, w: 36.6, h: 32.5 },
    fields: [
  { x: 51.8, y: 29.2, w: 40.7, h: 7.3 },
  { x: 51.8, y: 37.0, w: 40.7, h: 7.3 },
  { x: 51.8, y: 44.6, w: 40.7, h: 7.3 },
  { x: 51.8, y: 52.7, w: 40.7, h: 7.3 },
],
    qr: { x: 41.6, y: 79.2, w: 15.8, h: 10.7 },
    text: "dark",
    qrPad: 4,
    labelFontSize: 8,
  valueFontSize: 13,
  },
  "card-night": {
    src: "/templates/card-night.png",
    ratio: "475/711",
    baseWidth: 475,
    photo: { x: 8.6, y: 28.3, w: 36.4, h: 31.2 },
    fields: [
  { x: 51.8, y: 29.1, w: 40.7, h: 7.3 },
  { x: 51.8, y: 36.5, w: 40.7, h: 7.3 },
  { x: 51.8, y: 43.8, w: 40.7, h: 7.3 },
  { x: 51.8, y: 51, w: 40.7, h: 7.3 },
],
    qr: { x: 41.5, y: 79.5, w: 15.8, h: 10.6 },
    text: "light",
    qrPad: 4,
    labelFontSize: 8,
  valueFontSize: 13,
  },
  "card-landscape": {
    src: "/templates/card-landscape.png",
    ratio: "1317/711",
    baseWidth: 1317,
    photo: { x: 11.2, y: 27.8, w: 28.7, h: 50 },
    fields: [
      { x: 48.0, y: 22.0, w: 28.0, h: 8.0 },
      { x: 48.0, y: 34.0, w: 28.0, h: 8.0 },
      { x: 48.0, y: 46.0, w: 28.0, h: 8.0 },
      { x: 48.0, y: 58.0, w: 28.0, h: 8.0 },
    ],
    qr: { x: 82.0, y: 22.0, w: 10.0, h: 18.5 },
    text: "light",
    qrPad: 4,
    labelFontSize: 8,
  valueFontSize: 13,
  },
};
const labels = ["NAME", "TEAM", "ROLE", "GITHUB"];

export default function IDLayout({
  card,
  onStickerMove,
}: {
  card: CardData;
  onStickerMove?: (i: number, x: number, y: number) => void;
}) {
  const t =
    templates[card.variant] || templates["card-glow"];

  const cardRef = useRef<HTMLDivElement>(null);

  const [qr, setQr] = useState("");
  const [cardWidth, setCardWidth] = useState(430);

  /*
   * Track the ACTUAL rendered card width.
   *
   * This is intentionally done with ResizeObserver instead of
   * vw/cqw so html2canvas receives ordinary pixel values.
   */
  useEffect(() => {
    const el = cardRef.current;

    if (!el) return;

    const updateSize = () => {
      const width = el.getBoundingClientRect().width;

      if (width > 0) {
        setCardWidth(width);
      }
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(el);

    return () => observer.disconnect();
  }, [card.variant]);

  useEffect(() => {
    const info = [
      `Name: ${card.name || "—"}`,
      `Team: ${card.crew || "—"}`,
      `Role: ${card.role || "—"}`,
      `GitHub: ${card.github || card.callsign || "—"}`,
      "",
      "Hacker House Goa 2026",
    ].join("\n");

    QRCode.toDataURL(info, {
      margin: 1,
      width: 260,
      color: {
        dark: "#0a1810",
        light: "#fffdf2",
      },
    }).then(setQr);
  }, [
    card.name,
    card.crew,
    card.role,
    card.github,
    card.callsign,
  ]);

  const values = [
    card.name,
    card.crew,
    card.role,
    card.github || card.callsign,
  ];

  const landscape = card.variant === "card-landscape";
  const dark = t.text === "dark";

  /*
   * Scale everything according to the ACTUAL card width.
   *
   * Base design widths:
   * portrait ≈ 477px
   * landscape = 1317px
   */

 const baseWidth = Number(t.ratio.split("/")[0]);   // instead of the landscape ? 1317 : 477 ternary
const scale = cardWidth / baseWidth;

 const labelFontSize =
  (t.labelFontSize ?? (landscape ? 9 : 7)) * scale;

const valueFontSize =
  (t.valueFontSize ?? (landscape ? 16 : 11)) * scale;

  const fieldPadding = Math.max(
    3,
    cardWidth * 0.07 * 0.407
  );

  const fieldGap = Math.max(
    2,
    3 * scale
  );

  const fieldRadius = Math.max(
    4,
    (landscape ? 14 : 11) * scale
  );

  const photoRadius = Math.max(
    6,
    25 * scale
  );

  const qrPadding = Math.max(
    2,
    4 * scale
  );

  return (
    <div
      ref={cardRef}
      id="id-template-card"
      className="relative overflow-hidden rounded-[2rem] bg-ink shadow-[0_35px_100px_rgba(0,0,0,.65)]"
      style={{
        aspectRatio: t.ratio,
        width: landscape
          ? "min(94vw,860px)"
          : "min(92vw,477px)",
        fontFamily: "JetBrains Mono, monospace",
      }}
    >
      {/* =========================================
          STATIC TEMPLATE BACKGROUND
          ========================================= */}

      <img
        src={t.src}
        alt=""
        draggable={false}
        className="absolute inset-0 z-0 h-full w-full object-cover select-none pointer-events-none"
      />

      {/* =========================================
          USER PHOTO
          ========================================= */}

      {/* =========================================
    USER PHOTO
    ========================================= */}

<div
  className="absolute z-10 overflow-hidden"
  style={{
    ...box(t.photo, `${photoRadius}px`),
  }}
>
  {card.photo ? (
    <img
      src={card.photo}
      alt="User photo"
      draggable={false}
      className="absolute inset-0 h-full w-full object-cover"
      style={{
        filter: filterCss(card.filter),
        transformOrigin: "center center",
        transform: `
          translate(${card.photoX || 0}px, ${card.photoY || 0}px)
          scale(${card.photoZoom || 1})
          rotate(${card.photoRotate || 0}deg)
        `,
      }}
    />
  ) : (
    <div className="grid h-full w-full place-items-center bg-transparent text-5xl opacity-80">
      👤
    </div>
  )}
</div>

      {/* =========================================
          DYNAMIC FIELDS
          ========================================= */}

      {t.fields.map((b, i) => {
        /*
         * IMPORTANT:
         *
         * Calculate the actual field width from the card width.
         * This prevents percentage padding from being calculated
         * against the entire card.
         */

        const fieldWidth =
          cardWidth * (b.w / 100);

        const horizontalPadding =
          Math.max(3, fieldWidth * 0.07);

        return (
          <div
            key={i}
            className="absolute z-20 overflow-hidden"
            style={{
              ...box(b, `${fieldRadius}px`),
              color: dark
                ? "#163326"
                : "#FBF5E4",

              display: "flex",
              flexDirection: "column",
              justifyContent: "center",

              paddingLeft:
                `${horizontalPadding}px`,

              paddingRight:
                `${horizontalPadding}px`,

              boxSizing: "border-box",

              gap: `${fieldGap}px`,
            }}
          >
            {/* LABEL */}

            <span
              style={{
                display: "block",
                width: "100%",

                fontSize:
                  `${labelFontSize}px`,

                lineHeight: "1",

                letterSpacing:
                  landscape
                    ? "0.20em"
                    : "0.18em",

                fontWeight: 900,

                opacity: 0.6,

                textTransform: "uppercase",

                whiteSpace: "nowrap",

                overflow: "hidden",

                textOverflow: "ellipsis",
              }}
            >
              {labels[i]}
            </span>

            {/* VALUE */}

            <span
              style={{
                display: "block",
                width: "100%",

                fontSize:
                  `${valueFontSize}px`,

                lineHeight: "1",

                fontWeight: 900,

                letterSpacing: "-0.03em",

                whiteSpace: "nowrap",

                overflow: "hidden",

                textOverflow: "ellipsis",

                textShadow: dark
                  ? "0 1px 0 rgba(255,255,255,.22)"
                  : "0 1px 8px rgba(0,0,0,.65)",
              }}
            >
              {values[i] || "—"}
            </span>
          </div>
        );
      })}

      {/* =========================================
          QR CODE
          ========================================= */}

      <div
        className="absolute z-20 grid place-items-center overflow-hidden bg-[#fff8d9]/92 shadow-[0_0_16px_rgba(245,213,71,.5)]"
        style={{
          ...box(
            t.qr,
            `${Math.max(4, 9 * scale)}px`
          ),

          padding: `${qrPadding}px`,

          boxSizing: "border-box",
        }}
      >
        {qr && (
          <img
            src={qr}
            alt="QR code"
            draggable={false}
            className="h-full w-full object-contain"
          />
        )}
      </div>

      {/* =========================================
          STICKERS
          ========================================= */}

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
              onStickerMove
            )
          }
          className={`absolute z-30 select-none ${
            onStickerMove
              ? "cursor-grab active:cursor-grabbing"
              : ""
          }`}
          style={{
            left: `${st.x}%`,
            top: `${st.y}%`,

            fontSize: `${Math.max(
              12,
              24 * st.s * scale
            )}px`,

            transform:
              `translate(-50%,-50%) ` +
              `rotate(${st.r}deg)`,

            touchAction: "none",
          }}
        >
          {st.emoji}
        </span>
      ))}

      {/* =========================================
          CARD EDGE
          ========================================= */}

      <div
        className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-white/10"
      />
    </div>
  );
}

function clamp(
  value: number,
  min: number,
  max: number
) {
  return Math.min(
    Math.max(value, min),
    max
  );
}

function box(
  b: Box,
  radius: string
) {
  return {
    left: `${b.x}%`,
    top: `${b.y}%`,
    width: `${b.w}%`,
    height: `${b.h}%`,
    borderRadius: radius,
  } as const;
}

function startDrag(
  e: ReactPointerEvent,
  i: number,
  move?: (
    i: number,
    x: number,
    y: number
  ) => void,
) {
  if (!move) return;

  e.stopPropagation();

  const el =
    e.currentTarget.parentElement as HTMLElement;

  const upd = (
    ev: globalThis.PointerEvent
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
            100
        )
      ),
      Math.max(
        2,
        Math.min(
          98,
          ((ev.clientY - r.top) /
            r.height) *
            100
        )
      ),
    );
  };

  upd(e.nativeEvent);

  window.addEventListener(
    "pointermove",
    upd
  );

  window.addEventListener(
    "pointerup",
    () =>
      window.removeEventListener(
        "pointermove",
        upd
      ),
    { once: true }
  );
}