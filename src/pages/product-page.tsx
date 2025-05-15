import { useParams } from 'react-router-dom'

const ProductPage = () => {
  const { id } = useParams()

  return (
    <section>
      <h1>Product Page</h1>
      <p>Product ID: {id}</p>
    </section>
  )
}

export default ProductPage
