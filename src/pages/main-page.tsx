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
    <main className="bg-[#f6ebdf] min-h-screen px-4 py-8 text-[#40312d]">
      <section className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 mb-12">
        <img
          src={main1}
          alt="Zefir Hero"
          className="rounded-2xl shadow-md object-cover w-full lg:w-1/2 cursor-pointer"
        />
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Homemade Zefir, <br className="hidden sm:inline" /> No Artificial
            Flavors
          </h1>
          <p className="text-lg text-[#5a4b47]">
            Whether you prefer natural flavors, homemade treats, or desserts
            without artificial additives.
          </p>
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            <button className="border px-4 py-1 rounded-full text-sm cursor-pointer hover:bg-[#40312d] hover:text-white">
              HIGH QUALITY
            </button>
            <button className="border px-4 py-1 rounded-full text-sm cursor-pointer hover:bg-[#40312d] hover:text-white">
              PREMIUM ZEFIR
            </button>
            <button className="border px-4 py-1 rounded-full text-sm cursor-pointer hover:bg-[#40312d] hover:text-white">
              VERSATILE
            </button>
            <button className="bg-[#40312d] text-white px-4 py-1 rounded-full text-sm flex items-center gap-1 hover:bg-[#5a4b47] cursor-pointer">
              LEARN MORE <span>➝</span>
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productCards.map((card) => (
          <div
            key={card.id}
            className="relative text-white rounded-2xl overflow-hidden shadow-md cursor-pointer"
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
            />

            <div className="absolute top-2 left-2 bg-transparent rounded-full w-6 h-6 text-xs flex items-center justify-center font-bold border border-white">
              {card.id}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-black/20 text-white">
              <h3 className="text-lg font-semibold leading-tight">
                {card.title}
              </h3>
              <p className="text-sm leading-snug text-white/90">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}

export default MainPage
