"use client";

import { useCallback } from "react";
import { registerSlot, type SlotId } from "@/lib/stage";

/** A DOM area where the WebGL stage draws one of its views. */
export default function StageSlot({ id, className = "" }: { id: SlotId; className?: string }) {
  const ref = useCallback((el: HTMLDivElement | null) => registerSlot(id, el), [id]);
  return (
    <div ref={ref} className={`slot slot--${id} ${className}`} aria-hidden="true">
      <span className="slot__halo" />
      <span className="slot__shadow" />
    </div>
  );
}
