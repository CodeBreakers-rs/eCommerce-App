import { useParams } from 'react-router-dom'

const ProductPage = () => {
  const { id } = useParams()

  return (
    <section className="p-4">
      <h1 className="text-2xl font-bold mb-2">Product Detail</h1>
      <p className="text-gray-600">Slug: {id}</p>
    </section>
  )
}

export default ProductPage
