import { useRef, useState } from "react";
import { Upload, Camera, Scissors } from "lucide-react";
import toast from "react-hot-toast";
import { normalizeImage } from "../../lib/imageProcess";
import { removePhotoBackground } from "../../lib/backgroundRemoval";
import { useFaceDetection } from "../../hooks/useFaceDetection";
import { useSounds } from "../../hooks/useSounds";
export default function PhotoUploader({
  onPhoto,
}: {
  onPhoto: (data: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState("");
  const [current, setCurrent] = useState("");
  const [lastFace, setLastFace] = useState<any>(null);
  const fd = useFaceDetection();
  const snd = useSounds();
  async function handle(file?: File) {
    if (!file) return;
    setBusy(true);
    try {
      setStage("Fixing image orientation…");
      const img = await normalizeImage(file);
      setCurrent(img);
      onPhoto(img);
      snd.play("upload");
      setStage("Detecting face…");
      const face = await fd.run(img);
      setLastFace(face);
      toast(
        face
          ? "Face detected. Use Remove BG if you want a clean cutout."
          : "No face detected — original photo kept. Remove BG may still work.",
        { icon: face ? "😎" : "⚠️" },
      );
    } catch (e) {
      toast.error("Could not process image. Try JPG/PNG/WEBP/HEIC.");
    } finally {
      setBusy(false);
      setStage("");
    }
  }
  async function cutout(e: React.MouseEvent) {
    e.stopPropagation();
    if (!current) return toast.error("Upload a photo first");
    setBusy(true);
    setStage("Removing background locally…");
    try {
      await new Promise((r) => setTimeout(r, 80));
      const out = await removePhotoBackground(current, lastFace);
      onPhoto(out);
      toast.success(
        out === current
          ? "Background remover unavailable — original photo kept."
          : "Background removed. Only the person cutout is placed on the Goa template.",
        { icon: "✂️" },
      );
    } catch {
      toast.error("Background removal failed — original photo kept.");
    } finally {
      setBusy(false);
      setStage("");
    }
  }
  return (
    <div
      onDrop={(e) => {
        e.preventDefault();
        handle(e.dataTransfer.files[0]);
      }}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => input.current?.click()}
      className="grid min-h-44 cursor-pointer place-items-center rounded-3xl border-2 border-dashed border-yellow-sun/50 bg-ink/40 p-6 text-center hover:border-pink-hot"
    >
      <input
        ref={input}
        type="file"
        hidden
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
        onChange={(e) => handle(e.target.files?.[0])}
      />
      {busy ? (
        <div className="text-yellow-sun">
          <Scissors className="mx-auto mb-3 animate-pulse" />
          <b>{stage || "Processing photo…"}</b>
          <p className="mt-2 text-xs text-cream/60">
            This runs locally. The page may take a moment on first use.
          </p>
        </div>
      ) : (
        <div>
          <Upload className="mx-auto mb-3 text-yellow-sun" />
          <b>Drop photo or click to upload</b>
          <p className="mt-2 text-xs text-cream/60">
            Original photo is used first · optional background remover
          </p>
          {current && (
            <button
              onClick={cutout}
              className="btn mt-4 bg-pink-hot px-4 py-2 text-xs text-cream"
            >
              <Scissors size={14} /> Remove BG
            </button>
          )}
          <Camera className="mx-auto mt-3 text-pink-hot" size={18} />
        </div>
      )}
    </div>
  );
}
