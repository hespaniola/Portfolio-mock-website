// Fixed background glow and a film-grain layer over the whole page.
export function Atmosphere() {
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="glow-blob glow-a left-[-10%] top-[-20%] h-[70vmax] w-[70vmax] bg-[radial-gradient(circle,rgba(200,119,58,0.16),transparent_65%)]" />
        <div className="glow-blob glow-b bottom-[-30%] right-[-20%] h-[80vmax] w-[80vmax] bg-[radial-gradient(circle,rgba(120,60,30,0.14),transparent_65%)]" />
      </div>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] overflow-hidden opacity-[0.07]">
        <div className="grain" />
      </div>
    </>
  );
}
