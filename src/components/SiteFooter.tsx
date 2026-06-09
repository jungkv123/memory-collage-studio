export function SiteFooter() {
  return (
    <footer className="relative border-t border-charcoal/10 bg-ivory/60 mt-32">
      <div className="paper-texture absolute inset-0 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5 space-y-4">
          <h3 className="font-serif text-5xl italic">Fragmented.</h3>
          <p className="text-charcoal/60 max-w-sm leading-relaxed">
            一份装不进盒子的旅行纪念品的数字档案。献给漫游者、碎片收藏者，和慢慢回忆的人。
          </p>
          <p className="font-hand text-2xl text-dusty pt-2">— 旅行是一种感觉，而不是一条路线。</p>
        </div>
        <FooterCol title="工作室" items={["宣言", "过程", "媒体包", "故事"]} />
        <FooterCol title="创作" items={["画布", "模板", "AI 排版", "音频"]} />
        <FooterCol title="其他" items={["Instagram", "Are.na", "Pinterest", "邮件订阅"]} />
      </div>
      <div className="relative max-w-7xl mx-auto px-6 pb-10 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.25em] text-charcoal/40 gap-3">
        <span>© 2026 记忆档案工作室</span>
        <span>第 04 卷 · 印于米白与象牙色</span>
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