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
          className="absolute inset-y-0 left-0 w-2/3 p-4 flex flex-col justify-center text-white z-10"
          style={{
            background: `linear-gradient(90deg,
             rgba(102, 71, 47, 1) 0%,
             rgba(102, 71, 47, 0.75) 20%,
             rgba(102, 71, 47, 0.5) 50%,
             rgba(73, 50, 32, 0.155) 75%,
             rgba(73, 50, 32, 0.155) 80%,
             rgba(73, 50, 32, 0.155) 100%`,
          }}
        >
          <div className="absolute top-3 left-3 bg-black/40 text-white rounded-full w-7 h-7 text-xs flex items-center justify-center font-bold z-10">
          {card.id}
        </div>
          <h3 className="text-white sm:text-2xl font-bold leading-tight drop-shadow-sm">
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

<section className="bg-[#f5e6d8] px-4 py-14">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
    <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
      <div className="relative mb-6 md:mb-0 md:mr-6">
        <img
          src="src\assets\images\Canada.jpg"
          alt="Delivery area"
          className="w-64 h-auto object-contain"
        />
        <div className="absolute top-[22%] left-[32%] w-32 h-32 rounded-full border-[6px] border-[#493220] overflow-hidden shadow-xl">
          <img
            src="/images/pin-image.png"
            alt="Pin"
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      <div className="flex flex-col items-center md:items-start space-y-4 text-[#493220] font-medium text-lg">
        <div className="space-y-1">
          <p>Mississauga</p>
          <p>Toronto</p>
          <p>GTA</p>
        </div>
        <button className="border border-[#2f2b27] px-6 py-2 rounded-full text-sm hover:bg-[#2f2b27] hover:text-white transition">
          DELIVERY
        </button>
      </div>
    </div>

    <div className="text-[#2f2b27] text-base space-y-4 max-w-lg mx-auto md:mx-0">
      <p>
        We offer a convenient delivery service within Toronto for a flat fee of $35. You can choose
        to have your order delivered by taxi or by car, ensuring quick and reliable service.
      </p>
      <p>
        Enjoy free delivery on orders of $120 or more, or take advantage of our special offer: free
        delivery every Tuesday between 12–2 pm, regardless of your order amount.
      </p>
    </div>
  </div>

  <div className="mt-10 flex flex-wrap md:flex-nowrap items-start justify-center gap-25 md:justify-start md:px-8">
  <div className="flex flex-col items-center space-y-4 max-w-sm text-center">
    <button className="border border-[#2f2b27] px-6 py-2 rounded-full text-sm hover:bg-[#2f2b27] hover:text-white transition">
      SWEET INFO
    </button>

    <div className="text-sm text-[#493220] space-y-2 text-left w-full">
      <p>Minimum Order: All orders must be at least $27.</p>
      <p>
        Order Deadline: Please place your orders at least 2 days before the desired pickup or
        delivery date. This ensures that your desserts are prepared fresh and on time.
      </p>
    </div>
  </div>
  <div className="mt-10 flex flex-wrap md:flex-nowrap items-start justify-center gap-8 md:justify-start md:px-8">
  <img
    src="src\assets\images\recommend-1.png"
    alt="Zefir thumbnail thin"
    className="w-24 h-32 object-cover rounded-xl shadow-md"
  />
  <img
    src={main2}
    alt="Zefir thumbnail medium"
    className="w-32 h-32 object-cover rounded-xl shadow-md"
  />
  <img
    src="src\assets\images\recommend-2.png"
    alt="Zefir thumbnail thick"
    className="w-40 h-32 object-cover rounded-xl shadow-md"
  />
  </div>
</div>



</section>

<footer className="bg-[#f5e6d8] py-8 px-4 mt-16">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[#493220]">
    <p className="text-sm text-center md:text-left">
      Terms of Condition.
    </p>

    <div className="flex gap-4">
      <a href="twitter" target="_blank" rel="noopener noreferrer">
        <img
          src="src\assets\svg\twitter.svg"
          alt="Twitter"
          className="w-6 h-6 hover:scale-110 transition-transform"
        />
      </a>
      <a href="https://facebook.com/yourprofile" target="_blank" rel="noopener noreferrer">
        <img
          src="src/assets/svg/facebook.svg"
          alt="facebook"
          className="w-6 h-6 hover:scale-110 transition-transform"
        />
      </a>
      <a href="https://instagram.com/yourprofile">
        <img
          src="src/assets/svg/instagram.svg"
          alt="instagram"
          className="w-6 h-6 hover:scale-110 transition-transform"
        />
      </a>
    </div>
  </div>
</footer>

    </>
  )
}

export default MainPage