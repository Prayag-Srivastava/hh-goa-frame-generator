import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
export type ExportFormat =
  | "png"
  | "twitter"
  | "square"
  | "story"
  | "whatsapp"
  | "pdf"
  | "gif";
const dims = {
  png: [3000, 4478],
  twitter: [1200, 630],
  square: [1080, 1080],
  story: [1080, 1920],
  whatsapp: [1080, 1080],
} as const;
export async function exportNode(
  el: HTMLElement,
  format: ExportFormat,
  name = "goa-frame",
) {
  const canvas = await html2canvas(el, {
    backgroundColor: null,
    scale: 3,
    useCORS: true,
    logging: false,
  });

  if (format === "pdf") {
    const targetWidth = 1080;
    const targetHeight = Math.round(
      targetWidth * (canvas.height / canvas.width)
    );

    const pdf = new jsPDF({
      orientation: targetWidth > targetHeight ? "landscape" : "portrait",
      unit: "px",
      format: [targetWidth, targetHeight],
    });

    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      0,
      0,
      targetWidth,
      targetHeight
    );

    pdf.save(`${name}.pdf`);
    return;
  }

  /*
   * PNG = exact card only
   *
   * The output keeps the same aspect ratio as the actual
   * rendered card. No green background and no stretching.
   */
  if (format === "png") {
    const targetWidth = 3000;
    const targetHeight = Math.round(
      targetWidth * (canvas.height / canvas.width)
    );

    const out = document.createElement("canvas");
    out.width = targetWidth;
    out.height = targetHeight;

    const ctx = out.getContext("2d")!;

    ctx.drawImage(
      canvas,
      0,
      0,
      targetWidth,
      targetHeight
    );

    const a = document.createElement("a");
    a.href = out.toDataURL("image/png");
    a.download = `${name}.png`;
    a.click();

    return;
  }

  /*
   * Social formats
   * These intentionally use their own aspect ratios.
   */
  const [w, h] =
    dims[format === "gif" ? "png" : format] || dims.png;

  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;

  const ctx = out.getContext("2d")!;

  ctx.fillStyle = "#0a3527";
  ctx.fillRect(0, 0, w, h);

  const s = Math.min(
    w / canvas.width,
    h / canvas.height
  );

  const dw = canvas.width * s;
  const dh = canvas.height * s;

  ctx.drawImage(
    canvas,
    (w - dw) / 2,
    (h - dh) / 2,
    dw,
    dh
  );

  const a = document.createElement("a");
  a.href = out.toDataURL("image/png");
  a.download = `${name}-${format}.png`;
  a.click();
}
