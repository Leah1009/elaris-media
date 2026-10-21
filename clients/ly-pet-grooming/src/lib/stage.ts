/**
 * Tiny shared state between the DOM (sections) and the WebGL stage.
 * Mutable on purpose: values are read every frame inside useFrame,
 * so they must not trigger React re-renders.
 */
export type SlotId = "hero" | "services" | "final";

type Listener = () => void;
const listeners = new Set<Listener>();

export const stage = {
  slots: {} as Partial<Record<SlotId, HTMLElement>>,
  // Scroll container of the services list, used for continuous rotation.
  servicesTrack: null as HTMLElement | null,
  activeService: 0,
  pointer: { x: 0, y: 0 },
  reducedMotion: false,
  lowDetail: false,
};

export function registerSlot(id: SlotId, el: HTMLElement | null) {
  if (el) stage.slots[id] = el;
  else delete stage.slots[id];
  listeners.forEach((l) => l());
}

export function subscribeSlots(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
