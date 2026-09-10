function IconWrap({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-deep/30 bg-gold/5 text-gold-deep">
      {children}
    </span>
  );
}

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function BookingsVisual() {
  return (
    <IconWrap>
      <svg width="20" height="20" viewBox="0 0 24 24" {...strokeProps}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </svg>
    </IconWrap>
  );
}

export function ClientsVisual() {
  return (
    <IconWrap>
      <svg width="20" height="20" viewBox="0 0 24 24" {...strokeProps}>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5.5 20c1-3.5 3.8-5.5 6.5-5.5s5.5 2 6.5 5.5" />
      </svg>
    </IconWrap>
  );
}

export function PaymentsVisual() {
  return (
    <IconWrap>
      <svg width="20" height="20" viewBox="0 0 24 24" {...strokeProps}>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M3 10h18" />
      </svg>
    </IconWrap>
  );
}

export function InventoryVisual() {
  return (
    <IconWrap>
      <svg width="20" height="20" viewBox="0 0 24 24" {...strokeProps}>
        <path d="M3 8l9-5 9 5-9 5-9-5Z" />
        <path d="M3 8v8l9 5 9-5V8M12 13v8" />
      </svg>
    </IconWrap>
  );
}

export function MarketingVisual() {
  return (
    <IconWrap>
      <svg width="20" height="20" viewBox="0 0 24 24" {...strokeProps}>
        <path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1Z" />
        <path d="M16 9a4 4 0 0 1 0 6" />
      </svg>
    </IconWrap>
  );
}

export function WebsiteVisual() {
  return (
    <IconWrap>
      <svg width="20" height="20" viewBox="0 0 24 24" {...strokeProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9Z" />
      </svg>
    </IconWrap>
  );
}
