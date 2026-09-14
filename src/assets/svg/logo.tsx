import Image from "next/image";

export default function AppLogo({ size = 0 }: { size?: number }) {
  return (
    <Image
      src="/app-logo.svg"
      alt="Application Logo"
      width={size * 37}
      height={size * 41}
    />
  );
}
