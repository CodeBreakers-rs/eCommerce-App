import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  initializeCart,
  removeFromCart,
  selectCart,
  selectCartStatus,
  selectCartError,
} from '../store/slices/cart-slice'

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

  return (
    <div className="p-6">
      {status === 'loading' && <p>Loading cart...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {(cart?.lineItems?.length ?? 0) > 0 ? (
        <div className="space-y-6">
          {cart.lineItems.map((item) => {
            const { id, name, quantity, price, totalPrice, variant } = item
            const imageUrl = variant?.images?.[0]?.url

            return (
              <div
                key={id}
                className="border-b border-[#ded2c5] pb-4 flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={name['en']}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <div className="uppercase text-sm font-semibold mb-1">
                      {name['en']}
                    </div>
                    <div>${(price.value.centAmount / 100).toFixed(2)} each</div>
                    <div className="text-sm text-gray-600">
                      Quantity: {quantity}
                    </div>
                    <div className="text-sm text-gray-600">
                      Total: ${(totalPrice.centAmount / 100).toFixed(2)}
                    </div>
                  </div>
                </div>

                <button
                  className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded"
                  onClick={() => handleRemove(id)}
                >
                  Remove
                </button>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-gray-500 italic">Cart is empty</p>
      )}
    </div>
  )
}

export default BasketPage
