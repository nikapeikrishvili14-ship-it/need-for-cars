"use client";

import { MotionConfig } from "motion/react";

// Visitors with "reduce motion" turned on get fades instead of slides/skews
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
