import baseUrl from '../helpers/baseUrl'
import cookie from 'js-cookie'
import { parseCookies } from 'nookies'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState } from 'react'
import StripeCheckout from 'react-stripe-checkout';
import Image from 'next/image'

const Cart = ({ error, products }) => {

  const [cartProducts, setCartProducts] = useState(products)
  const { token } = parseCookies()
  const router = useRouter()


  if (!token) {
    return (
      <div className="cart-container">
        <p>Please log in to continue</p>
        <Link href="/login"><a><button className="btn login-btn">Login</button></a></Link>
      </div>
    )
  }

  /* if fetching cart from API returns error, remove the token and reroute to login page */
  if (error) {
    cookie.remove("user")
    cookie.remove("token")
    router.push("/login")
  }

  /* deleting an item from cart */
  const deleteItem = async (pid) => {
    const res = await fetch(`${baseUrl}/api/cart`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({
        productId: pid
      })
    })
    const res2 = await res.json()
    setCartProducts(res2)

  }

  /* display cart items */
  const CartItems = () => {
    return (
      <>
        {cartProducts.map(item => {
          return (
            <div className="cart-items" key={item._id}>
              <div className="cart-image image-container" >
              <Image
                src={item.product.mediaUrl}
                alt="Beautiful clothing"
                width={780}
                height={1196}
                layout="responsive"
                quality={100}
                className="image"
              />
              </div>
              <div className="cart-details">
                <div className="product-name">{item.product.name}</div>
                <h6>{item.quantity} x ${item.product.price}</h6>
                <button className="btn delete-btn" onClick={() => deleteItem(item.product._id)}>Delete</button>
              </div>
            </div>
          )
        })}
      </>
    )
  }

  /* sends paymentInfo retreived from StripeCheckout to API */
  const handleCheckout = async (paymentInfo) => {

    const res = await fetch(`${baseUrl}/api/payment`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({
        paymentInfo
      })
    })

    const res2 = await res.json()
  }

  /* display total cos of itemsand include StripeCheckout button */
  const TotalPrice = () => {
    let total = 0
    products.map(item => {
      total += item.quantity * item.product.price
    })

    return (
      <div className="container">
        { total > 0 ?
          <h4>Total Price: ${total}</h4> :
          <>
            <h4>Your Femme-Jolie Cart is empty</h4>
            <Link href="/"><a><h5>Continue shopping</h5></a></Link>
          </>
        }
        {products.length != 0 &&
          <StripeCheckout
            name="Femme Jolie"
            amount={total * 100}
            image={products.length > 0 ? products[0].product.mediaUrl : ""}
            currency="USD"
            shippingAddress={true}
            billingAddress={true}
            zipCode={true}
            stripeKey="pk_test_51J9mNkIEj413ijvW34TB4Z3QomqxkJWD7nkmC9j5019HeNRq038KMgo4qrFG2NaJc7KOOUp2eQER22xHisaMY1jM00fF696gfy"
            token={(paymentInfo) => handleCheckout(paymentInfo)}
          >
            <button className="btn checkout-btn">Checkout</button>
          </StripeCheckout>
        }
      </div>
    )
  }

  return (
    <div className="cart-container">
      <CartItems />
      <TotalPrice />
    </div>
  )
}

export async function getServerSideProps(context) {

  const { token } = parseCookies(context)

  if (!token) {
    return {
      props: { products: [] }
    }
  }

  /* fetch cart details */
  const res = await fetch(`${baseUrl}/api/cart`, {
    method: "GET",
    headers: {
      "Authorization": token,
      "Content-Type": "application/json"
    }
  })

  if (res.error) {
    return {
      props: { error },
    }
  }

  const products = await res.json()

  return {
    props: { products: products },
  }
}

export default Cart