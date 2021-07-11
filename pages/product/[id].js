import { useRouter } from 'next/router'
import baseUrl from '../../helpers/baseUrl'
import { useState } from 'react'
import { parseCookies } from 'nookies'
import cookie2 from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify'
import Link from 'next/link'
import Image from 'next/image'

const Product = ({ product }) => {
    const [quantity, setQuantity] = useState(1)
    const router = useRouter()
    if (router.isFallback) {
        return (
            <h1>Loading...</h1>
        )
    }
    const cookie = parseCookies()

    /* delete product request to API */
    const deleteProduct = async () => {
        const res = await fetch(`${baseUrl}/api/product/${product._id}`, {
            method: "DELETE"
        })
        await res.json()
        router.push('/')
    }

    /* add request to cart API along with token authorization */
    const AddToCart = async () => {
        const res = await fetch(`${baseUrl}/api/cart`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": cookie.token
            },
            body: JSON.stringify({
                quantity: quantity,
                productId: product._id
            })
        })

        const res2 = await res.json()
        /* If unauthorized cookie remove the token and reroute to login page */
        if (res2.error) {
            cookie2.remove("user")
            cookie2.remove("token")
            router.push('/login')
        }

        toast.success("Product added to Cart")
    }

    /* Displaying individual product details */
    const ProductDetails = () => {
        return (
            <div className="container-product" key={product._id}>

                <div className="product-image-div">
                    <Image 
                        src={product.mediaUrl} 
                        alt="Clothing or art?"
                    />
                </div>

                <div className="product-details">
                    <div className="product-title">{product.name}</div>
                    <div className="product-price">${product.price}</div>
                    <p>{product.description}</p>
                    <input
                        className="input-quantity"
                        type="number"
                        value={quantity}
                        style={{ width: "400px", margin: "10px" }}
                        min="1"
                        placeholder="Quantity"
                        onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                    <button className="btn add-btn" onClick={() => AddToCart()}>
                        <i className="fas fa-shopping-bag"></i>  Add to Cart
                </button>
                    <ToastContainer draggable={false} autoClose={2000} />
                    <Link href="/"><a><h5>Continue shopping</h5></a></Link>
                </div>
            </div>
        )
    }

    return (
        <div className="productPage-container">
            <ProductDetails />
        </div>
    )
}

export async function getServerSideProps({ params: { id } }) {
    /* individual product details request to API */
    const res = await fetch(`${baseUrl}/api/product/${id}`)
    const data = await res.json()

    return {
        props: {
            product: data
        }
    }
}

/*export async function getStaticProps({ params: { id } }) {
    /* individual product details request to API */
    /*const res = await fetch(`${baseUrl}/api/product/${id}`)
    const data = await res.json()

    return {
        props: {
            product: data
        }
    }
}

export async function getStaticPaths() {
    return {
        paths: [
            { params: { id: "60ca5f31b0b1061b0eac3bb4" } }
        ],
        fallback: true
    }
}*/

export default Product
