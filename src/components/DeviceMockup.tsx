export default function DeviceMockup({
  browser,
  phone,
}: {
  browser: React.ReactNode;
  phone: React.ReactNode;
}) {
  return (
    <div className="relative pb-10 pr-8 sm:pb-12 sm:pr-12">
      <div className="overflow-hidden rounded-xl border border-rule bg-cream-soft shadow-[0_30px_60px_-20px_rgba(21,18,13,0.25)]">
        <div className="flex items-center gap-1.5 border-b border-rule bg-cream-deep/50 px-4 py-2.5">
          <span className="h-2 w-2 rounded-full bg-ink/15" />
          <span className="h-2 w-2 rounded-full bg-ink/15" />
          <span className="h-2 w-2 rounded-full bg-ink/15" />
        </div>
        <div className="aspect-[16/10]">{browser}</div>
      </div>

      <div className="absolute bottom-0 right-0 w-[34%] min-w-[92px] overflow-hidden rounded-[1.1rem] border-[3px] border-ink bg-ink shadow-[0_24px_50px_-16px_rgba(21,18,13,0.4)]">
        <div className="aspect-[9/19]">{phone}</div>
      </div>
    </div>
  );
}
