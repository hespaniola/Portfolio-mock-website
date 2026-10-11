import Image, { type ImageProps } from "next/image";

/** next/image with sensible defaults; SVG placeholders skip the optimizer. */
export function Media({ src, alt, sizes = "100vw", className, ...rest }: Omit<ImageProps, "src"> & { src: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      unoptimized={src.endsWith(".svg")}
      className={`object-cover ${className ?? ""}`}
      {...rest}
    />
  );
}
