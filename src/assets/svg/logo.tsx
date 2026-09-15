import Image from "next/image";

interface AppLogoProps {
  size?: number;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function AppLogo({
  size = 1,
  width,
  height,
  className,
  priority,
}: AppLogoProps) {
  const calculatedWidth = width ?? (size ? Math.round(size * 37) : 37);
  const calculatedHeight = height ?? (size ? Math.round(size * 41) : 41);

  return (
    <Image
      src="/app-logo.svg"
      alt="Application Logo"
      width={calculatedWidth}
      height={calculatedHeight}
      className={className}
      priority={priority}
    />
  );
}
