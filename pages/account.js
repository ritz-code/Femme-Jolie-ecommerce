import { parseCookies } from 'nookies'
import Authenticated from '../helpers/Authenticated'
import baseUrl from '../helpers/baseUrl'
import UserRoles from '../components/UserRoles'

const Account = ({ orders }) => {
    const cookie = parseCookies()
    const user = cookie.user ? JSON.parse(cookie.user) : ""
    const total = 0

    /* if no prior orders */
    if (orders.length == 0) {
        return (
            <div className="container">
                <h4>You have no order history</h4>
                {user.role == "root" &&
                    <UserRoles />
                }
            </div>
        )
    }

    /* convertinf from timestamps to monthname dd, yyyy format */
    const getOrderDate = (date) => {
        const d = new Date(date)
        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        return month[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear()
    }

    /* displays prior orders history */
    const OrderHistory = () => {
        return (
            <>
                <h4 className="order-heading">Your Orders</h4>
                {
                    orders.map(order => {
                        return (
                            <li className="orders-list">
                                <div className="orders-container">
                                    <h3>Order Placed: {getOrderDate(order.createdAt)}</h3>
                                    <div className="orders-content">
                                        {
                                            order.products.map(item => {
                                                return (
                                                    <>
                                                        <div className="order-grid">
                                                            <span className="order-image-div">
                                                                <img src={item.product.mediaUrl} />
                                                            </span>
                                                            <h3 className="order-description">{item.product.name} X {item.quantity}</h3>
                                                        </div>
                                                    </>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </li>
                        )
                    })
                }
            </>
        )
    }

    return (
        <div className="container">
            <OrderHistory />
            {user.role == "root" &&
                <UserRoles />
            }
        </div>
    )

}

export async function getServerSideProps(context) {
    const { token } = parseCookies(context)
    if (!token) {
        return {
            redirect: {
                permanent: false,
                destination: "/"
            }
        }
    }

    /* fetches prior orders */
    const res = await fetch(`${baseUrl}/api/orders`, {
        method: "GET",
        headers: {
            'Authorization': token
        }
    })
    const data = await res.json()

    return {
        props: { orders: data },
    }
}

export default Account