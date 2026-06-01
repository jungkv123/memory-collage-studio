import italy from "@/assets/polaroid-italy.jpg";
import kyoto from "@/assets/polaroid-kyoto.jpg";
import morocco from "@/assets/polaroid-morocco.jpg";

const journals = [
  {
    img: italy,
    place: "Cinque Terre, IT",
    title: "Houses the color of fruit.",
    author: "Clara M.",
    tape: "tape",
    rotate: "-rotate-2",
  },
  {
    img: kyoto,
    place: "Kyoto, JP",
    title: "Rain through cedar.",
    author: "Kenji S.",
    tape: "tape-pink",
    rotate: "rotate-1 mt-10",
  },
  {
    img: morocco,
    place: "Marrakesh, MA",
    title: "Lanterns and saffron dust.",
    author: "Elena R.",
    tape: "tape-blue",
    rotate: "-rotate-1",
  },
];

export function JournalGrid() {
  return (
    <section className="mt-32 max-w-6xl mx-auto px-6">
      <div className="flex items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-charcoal/50">
            §05 — Featured Journals
          </span>
          <h2 className="font-serif text-5xl md:text-6xl mt-2 italic">From the archive</h2>
        </div>
        <p className="font-hand text-2xl text-pinkv max-w-[20ch] hidden md:block -rotate-1">
          recent stories from the community
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {journals.map((j) => (
          <article key={j.title} className={`group cursor-pointer ${j.rotate}`}>
            <div className="relative bg-white p-3 pb-12 border border-charcoal/10 scrap-shadow transition-transform group-hover:rotate-0 group-hover:-translate-y-1">
              <span className={`${j.tape} absolute -top-3 left-10 w-16 h-6 rotate-[-4deg] z-10`} />
              <img src={j.img} alt="" className="block w-full aspect-[4/5] object-cover" />
              <div className="mt-4 space-y-1 px-1">
                <p className="text-[10px] uppercase tracking-[0.25em] text-charcoal/50">
                  {j.place}
                </p>
                <h3 className="font-serif text-2xl italic leading-tight">{j.title}</h3>
                <p className="font-hand text-lg text-dusty pt-1">by {j.author}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}