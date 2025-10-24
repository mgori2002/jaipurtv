import { memo, useMemo, useState } from "react";

const DancingMascot = () => {
  const primarySources = useMemo(
    () => ["/dancing-mascot.png", "/dancing-mascot.jpg", "/dancing-mascot-2.jpg", "/dancing-mascot-2.png"],
    [],
  );
  const fallbackSources = useMemo(() => ["/jaipurtv-logo.png"], []);

  const initialSource = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * primarySources.length);
    return primarySources[randomIndex];
  }, [primarySources]);

  const sourceOrder = useMemo(() => {
    const remainingPrimary = primarySources.filter((src) => src !== initialSource);
    return [initialSource, ...remainingPrimary, ...fallbackSources];
  }, [fallbackSources, initialSource, primarySources]);

  const [sourceIndex, setSourceIndex] = useState(0);
  const currentSource = sourceOrder[sourceIndex];

  return (
    <div className="pointer-events-none fixed bottom-4 right-3 sm:bottom-6 sm:right-4 md:bottom-10 md:right-10 z-40 hidden sm:flex flex-col items-center gap-2 select-none">
      <img
        src={currentSource}
        alt="JaipurTV dancing mascot"
        className="w-20 md:w-28 lg:w-36 drop-shadow-[0_12px_30px_rgba(0,0,0,0.35)] animate-mascot-bob"
        loading="lazy"
        onError={() =>
          setSourceIndex((prev) => (prev < sourceOrder.length - 1 ? prev + 1 : prev))
        }
      />
      <span className="rounded-full bg-white/70 backdrop-blur px-2 py-1 text-[0.55rem] md:text-[0.65rem] lg:text-xs font-display text-primary/80 tracking-[0.35em] uppercase animate-mascot-wiggle shadow-glow">
        JaipurTV
      </span>
    </div>
  );
};

export default memo(DancingMascot);
