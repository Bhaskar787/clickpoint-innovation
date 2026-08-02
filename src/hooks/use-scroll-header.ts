import { useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

export function useScrollHeader(threshold: number = 16) {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > threshold);
  });

  return scrolled;
}
