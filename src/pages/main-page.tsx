import main1 from '../assets/images/main1.png'
import main2 from '../assets/images/main2.png'
import main3 from '../assets/images/main3.png'
import main4 from '../assets/images/main4.png'

const productCards = [
  {
    id: '01',
    title: 'Apple-Cranberry',
    description:
      'Perfect sweet-tangy Zefir with refreshing notes, 9-piece box.',
    image: main2,
  },
  {
    id: '02',
    title: 'Apple-natural',
    description: 'Delicate airy Zefir with pure fruity flavor, 4-piece box.',
    image: main3,
  },
  {
    id: '03',
    title: 'Apple-Fully Milk Chocolate',
    description: 'Zefir coated in rich milk chocolate, 4-piece box.',
    image: main4,
  },
]

const MainPage = () => {
  return (
    <>
      <section className="bg-[#f5e6d8]  w-full px-4 pt-4 pb-4">
  <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-center rounded-3xl bg-[#fbeee2] p-2">
    <img
      src={main1}
      alt="Zefir Hero"
      className="rounded-2xl object-cover w-full lg:w-1/2 h-[320px] lg:h-auto"
    />

    <div className="flex-1 text-center lg:text-left space-y-4">
      <h1 className="text-4xl sm:text-5xl font-extrabold leading-snug text-[#2f2b27]">
        Homemade Zefir,<br className="hidden sm:inline" /> No Artificial Flavors
      </h1>
      <p className="text-base sm:text-lg text-[#5a4b47] max-w-xl mx-auto lg:mx-0">
        Whether you prefer natural flavors, homemade treats, or desserts without artificial additives.
      </p>
      <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-2">
        <button className="border border-[#2f2b27] px-4 py-1 rounded-full text-xs sm:text-sm hover:bg-[#2f2b27] hover:text-white transition">
          HIGH QUALITY
        </button>
        <button className="border border-[#2f2b27] px-4 py-1 rounded-full text-xs sm:text-sm hover:bg-[#2f2b27] hover:text-white transition">
          PREMIUM ZEFIR
        </button>
        <button className="border border-[#2f2b27] px-4 py-1 rounded-full text-xs sm:text-sm hover:bg-[#2f2b27] hover:text-white transition">
          VERSATILE
        </button>
        <button className="bg-[#2f2b27] text-white px-4 py-1 rounded-full text-xs sm:text-sm flex items-center gap-1 hover:bg-[#40312d]">
          LEARN MORE ➝
        </button>
      </div>
    </div>
  </div>
</section>

<section className="bg-[#f5e6d8] py-10 px-4">
  <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {productCards.map((card) => (
      <div
        key={card.id}
        className="relative rounded-[1.5rem] overflow-hidden shadow-md cursor-pointer group bg-black"
      >
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />


        <div
          className="absolute inset-y-0 left-0 w-1/2 p-4 flex flex-col justify-center text-white z-10"
          style={{
            background: `linear-gradient(90deg,
             rgba(102, 71, 47, 1) 0%,
             rgba(102, 71, 47, 0.75) 20%,
             rgba(102, 71, 47, 0.75) 30%,
             rgba(73, 50, 32, 0.155) 75%,
             rgba(73, 50, 32, 0.155) 80%,
             rgba(73, 50, 32, 0.155) 100%`,
          }}
        >
          <div className="absolute top-3 left-3 bg-black/40 text-white rounded-full w-7 h-7 text-xs flex items-center justify-center font-bold z-10">
          {card.id}
        </div>
          <h3 className="text-white font-bold leading-tight drop-shadow-sm">
            {card.title}
          </h3>
          <p className="text-sm text-white/90 drop-shadow-sm">
            {card.description}
          </p>
        </div>
      </div>
    ))}
  </div>
</section>


    </>
  )
}

export default MainPage