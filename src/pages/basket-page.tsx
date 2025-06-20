import { useState } from 'react'
import recommended1 from '../assets/images/recommend-1.png'
import recommended2 from '../assets/images/recommend-2.png'

const BasketPage = () => {
  const [quantity, setQuantity] = useState(1)
  const [removed, setRemoved] = useState(false)

  const price = 14.5
  const total = price * quantity
  const minOrder = 20

  const handleRemove = () => {
    setQuantity(0)
    setRemoved(true)
  }

  return (
    <div className="bg-[#f6ebdf] text-[#40312d] px-4 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-3xl font-bold mb-6">Cart</h2>
          {!removed ? (
            <div className="space-y-4">
              <div>
                <button
                  onClick={handleRemove}
                  className="w-2xs text-1xl text-black-600 bg-[#ded2c5] rounded-full mt-2 mb-2 hover:bg-[#bdbab7] cursor-pointer"
                >
                  Remove from Cart
                </button>
                <div className="uppercase text-sm tracking-wide">
                  Apple-Cranberry 9
                </div>
                <div className="flex items-center justify-between">
                  <span>${price.toFixed(2)}</span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      ➖
                    </button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity((q) => q + 1)}>
                      ➕
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="uppercase">Box 1</span>
                <span>1</span>
              </div>
              <div className="flex justify-between">
                <span className="uppercase">Delivery</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-semibold mt-6">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              {total < minOrder && (
                <p className="text-sm mt-2 uppercase">Not enough to order</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 italic">Cart is empty</p>
          )}
          <div className="mt-8">
            <label className="flex items-center gap-3 text-sm font-medium">
              <input type="checkbox" className="accent-[#40312d]" />I agree to
              the terms and conditions
            </label>
            <button
              disabled={total < minOrder}
              className="mt-4 w-full bg-[#ded2c5] text-[#40312d] py-3 rounded-full font-semibold disabled:opacity-50"
            >
              Order now
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-center uppercase text-sm mb-4">
            Personalized Recommendations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                image: recommended1,
                title: 'Apple-Cranberry Pink',
                desc: 'Refined Zefir, half-coated milk chocolate, balancing fruity and apple.',
                price: 7.0,
              },
              {
                image: recommended2,
                title: 'Apple-natural',
                desc: 'Delicate airy Zefir with pure fruity flavor, 4-piece box.',
                price: 11.0,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-3xl overflow-hidden bg-[#4d2d2d] text-white p-4 relative"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="relative z-10 space-y-2">
                  <div className="text-xs font-bold">0{index + 1}</div>
                  <div className="text-lg font-semibold leading-tight">
                    {item.title}
                  </div>
                  <p className="text-sm">{item.desc}</p>
                  <div className="text-lg font-bold">
                    ${item.price.toFixed(2)}
                  </div>
                  <button className="mt-2 px-4 py-2 bg-[#ded2c5] text-[#40312d] text-sm rounded-full">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasketPage
