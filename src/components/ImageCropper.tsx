"use client";

import React, { useState, useCallback } from "react";
import Cropper, { type Point, type Area } from "react-easy-crop";
import { Check, X, ZoomIn, ZoomOut } from "lucide-react";

interface ImageCropperProps {
  imageSrc: string;
  aspect: number;
  onCropComplete: (croppedAreaPixels: Area) => void;
  onCancel: () => void;
}

export default function ImageCropper({
  imageSrc,
  aspect,
  onCropComplete,
  onCancel,
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [croppedAreaPixelsData, setCroppedAreaPixelsData] =
    useState<Area | null>(null);

  const onCropChange = (newCrop: Point) => {
    setCrop(newCrop);
  };

  const onZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  const onCropCompleteCallback = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixelsData(croppedAreaPixels);
    },
    [],
  );

  const handleSave = () => {
    if (croppedAreaPixelsData) {
      onCropComplete(croppedAreaPixelsData);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 md:p-6">
      <div className="flex h-[90vh] w-full max-w-[650px] flex-col overflow-hidden rounded-3xl bg-[#F7F1DE] shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-brand-dark/10 bg-[#F7F1DE] px-5 py-4 md:px-6 md:py-5">
          <h2 className="font-mono text-lg font-extrabold text-brand-dark md:text-xl">
            Crop &amp; Center Photo
          </h2>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-full p-2 text-brand-dark/60 transition hover:bg-brand-dark/5 hover:text-brand-dark"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        {/* Cropper area */}
        <div className="relative min-h-0 flex-1 bg-[#0b251e]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteCallback}
            onZoomChange={onZoomChange}
            cropShape="rect"
            showGrid={true}
            style={{
              containerStyle: {
                background: "transparent",
              },
              cropAreaStyle: {
                border: "2px solid #EC1E6E",
                boxShadow:
                  "0 0 0 9999px rgba(11, 46, 34, 0.75)",
              },
            }}
          />
        </div>

        {/* Zoom Controls */}
        <div className="shrink-0 space-y-5 border-t border-brand-dark/10 bg-[#F7F1DE] p-5">
          <div className="flex items-center gap-4">
            <ZoomOut
              size={16}
              className="shrink-0 text-brand-dark/40"
            />

            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) =>
                setZoom(parseFloat(e.target.value))
              }
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg bg-brand-dark/20 accent-brand-pink"
            />

            <ZoomIn
              size={16}
              className="shrink-0 text-brand-pink"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl border border-brand-dark/20 px-4 py-3 font-mono text-sm text-brand-dark/70 transition duration-200 hover:bg-brand-dark/5"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!croppedAreaPixelsData}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-pink to-brand-gold px-4 py-3 text-sm font-extrabold text-brand-dark shadow-[0_4px_15px_rgba(236,30,110,0.25)] transition duration-200 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check size={18} />
              Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}