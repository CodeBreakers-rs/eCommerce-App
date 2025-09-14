import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  initializeCart,
  removeFromCart,
  selectCart,
  selectCartStatus,
  selectCartError,
} from '../store/slices/cart-slice'
import { updateCartQuantity } from '../features/basket/services/cart-quantity'

const BasketPage = () => {
  const dispatch = useAppDispatch()
  const cart = useAppSelector(selectCart)
  const status = useAppSelector(selectCartStatus)
  const error = useAppSelector(selectCartError)

  useEffect(() => {
    void dispatch(initializeCart())
  }, [dispatch])

  const handleRemove = (lineItemId: string) => {
    void dispatch(removeFromCart(lineItemId))
  }

  if (!cart) return <p>Cart not loaded</p>

  const handleQuantityChange = (lineItemId: string, change: number) => {
    const lineItem = cart.lineItems.find((item) => item.id === lineItemId)
    if (!lineItem) return

    const newQty = lineItem.quantity + change
    if (newQty < 1) return

    void dispatch(updateCartQuantity({ lineItemId, quantity: newQty }))
  }

  const total = (cart.totalPrice?.centAmount ?? 0) / 100

  return (
    <div className="min-h-screen bg-[#f5e6d8] text-[#2f2b27] p-4 sm:p-6">
      {status === 'loading' && <p>Loading cart...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8">Cart</h2>

      {(cart.lineItems?.length ?? 0) > 0 ? (
        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="space-y-6">
            {cart.lineItems.map((item) => {
              const { id, name, quantity, price, totalPrice, variant } = item
              const imageUrl = variant?.images?.[0]?.url

              return (
                <div
                  key={id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 border-[#ded2c5] gap-4"
                >
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={name['en']}
                        className="w-24 h-24 rounded-xl object-cover self-center sm:self-start"
                      />
                    )}
                    <div className="space-y-1 flex-1 min-w-0">
                      <h3 className="uppercase text-base sm:text-lg font-semibold break-words">
                        {name['en']}
                      </h3>
                      <p className="text-sm sm:text-base">
                        ${(price.value.centAmount / 100).toFixed(2)}
                      </p>
                      <p className="text-sm">Quantity: {quantity}</p>
                      <p className="text-sm">
                        Total: ${(totalPrice.centAmount / 100).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          className="border border-gray-400 rounded-full px-2 py-1"
                          onClick={() => handleQuantityChange(id, -1)}
                        >
                          −
                        </button>
                        <span>{quantity}</span>
                        <button
                          className="border border-gray-400 rounded-full px-2 py-1"
                          onClick={() => handleQuantityChange(id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    className="self-end sm:self-center text-sm bg-[#6b4f43] hover:bg-[#523e36] text-white px-4 py-2 rounded-xl"
                    onClick={() => handleRemove(id)}
                  >
                    Remove
                  </button>
                </div>
              )
            })}

            <div className="text-sm space-y-2 pt-4">
              <div className="flex justify-between max-w-full sm:max-w-sm">
                <span>Box</span>
                <span>{cart.lineItems.length}</span>
              </div>
              <div className="flex justify-between max-w-full sm:max-w-sm">
                <span>Delivery</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between max-w-full sm:max-w-sm font-semibold text-lg pt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <p className="text-sm pt-1">Not enough to order</p>
            </div>

            <div className="pt-4">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" className="accent-[#6b4f43]" />
                <span className="underline break-words">
                  I agree to the terms and conditions
                </span>
              </label>
              <button
                className="mt-4 block w-full max-w-full sm:max-w-xs bg-[#d8c8b9] text-white text-sm py-3 rounded-full cursor-not-allowed"
                disabled
              >
                ORDER NOW
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 italic">Cart is empty</p>
      )}
    </div>
  )
}

export default BasketPage