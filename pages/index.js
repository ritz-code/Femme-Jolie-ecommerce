import Link from 'next/link'
import baseUrl from '../helpers/baseUrl'
import Image from 'next/image'

const Home = ({ products }) => {

  /* all the products displayed */
  const productList = products.map(product => {
    return (
      <div className="image-card" key={product._id}>
        <div className="card-image-div image-container">
          <Image
            src={product.mediaUrl}
            alt="Cute dress"
            width={780}
            height={1196}
            layout="responsive"
            quality={100}
            className="image"
          />
          <span className="card-title">{product.name}</span>
        </div>
        <div className="cost-delivery-div">
          <div className="card-price">${product.price}</div>
          <span className="free-delivery">Free delivery</span>
        </div>
        <div className="card-action">
          <Link href={'/product/[id]'} as={`/product/${product._id}`}><a>See full details</a></Link>
        </div>
      </div>

    )
  })

  return (
    <div className="rootcard">
      {productList}
    </div>
  )
}

export async function getStaticProps(context) {

  /* fetch products from Product DB */
  const res = await fetch(`${baseUrl}/api/products`)
  const data = await res.json()

  return {
    props: { products: data },
  }
}

export default Home