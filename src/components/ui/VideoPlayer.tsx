"use client";
export default function VideoPlayer({ src }: { src: string }) {
  return (
    <video
      controls
      controlsList="nodownload noremoteplayback"
      disablePictureInPicture
      onContextMenu={(e) => e.preventDefault()}
      className="w-full rounded-lg border-2"
      style={{ borderColor: "var(--acnu-primary)" }}
      src={src}
    />
  );
}
