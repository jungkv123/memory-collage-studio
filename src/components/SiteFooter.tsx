export function SiteFooter() {
  return (
    <footer className="relative border-t border-charcoal/10 bg-ivory/60 mt-32">
      <div className="paper-texture absolute inset-0 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5 space-y-4">
          <h3 className="font-serif text-5xl italic">Fragmented.</h3>
          <p className="text-charcoal/60 max-w-sm leading-relaxed">
            A digital archive for the souvenirs that don't fit in a box. Made
            for wanderers, scrap-keepers, and slow rememberers.
          </p>
          <p className="font-hand text-2xl text-dusty pt-2">— travel is a feeling, not a route.</p>
        </div>
        <FooterCol title="Studio" items={["Manifesto", "Process", "Press kit", "Stories"]} />
        <FooterCol title="Make" items={["Canvas", "Templates", "AI Layouts", "Audio"]} />
        <FooterCol title="Elsewhere" items={["Instagram", "Are.na", "Pinterest", "Newsletter"]} />
      </div>
      <div className="relative max-w-7xl mx-auto px-6 pb-10 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.25em] text-charcoal/40 gap-3">
        <span>© 2026 Memory Archive Labs</span>
        <span>Vol. 04 · Printed in cream &amp; ivory</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="md:col-span-2 space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-charcoal/40">{title}</p>
      <ul className="space-y-2 text-sm">
        {items.map((i) => (
          <li key={i}>
            <a href="#" className="hover:text-dusty transition-colors">
              {i}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}