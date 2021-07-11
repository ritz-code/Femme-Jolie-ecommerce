import Link from 'next/link'
import { useRouter } from 'next/router'
import cookie from 'js-cookie'
import { parseCookies } from 'nookies'

const Navbar = () => {

    const router = useRouter()
    const cookieUser = parseCookies()

    /* retreiving and parsing user data from parseCookies */
    const user = cookieUser.user ? JSON.parse(cookieUser.user) : ""


    return (
        <>
            <nav>
                <div className="nav-wrapper">
                    <Link href="/"><a><span className="logo">FEMME-JOLIE</span></a></Link>
                    <ul className="nav-list">
                        <li className={router.pathname == "/" ? "active" : ""}><Link href="/"><a>Home</a></Link></li>
                        
                        {/* Login and Signup visible in Navbar when user is not logged in */
                            user.role != "user" && user.role != "admin" && user.role != "root" &&
                            <>
                                <li className={router.pathname == "/login" ? "active" : ""}><Link href="/login"><a>Login</a></Link></li>
                                <li className={router.pathname == "/signup" ? "active" : ""}><Link href="/signup"><a>Signup</a></Link></li>
                            </>
                        }
                        {/* Create available only for root and admin */
                            (user.role == "root" || user.role == "admin") &&
                            <li className={router.pathname == "/create" ? "active" : ""}><Link href="/create"><a>Create</a></Link></li>
                        }
                        { /* Cart and Account visible in Navbar when user logged in */
                            (user.role == "user" || user.role == "root" || user.role == "admin") &&
                            <>
                                <li className={router.pathname == "/cart" ? "active" : ""}><Link href="/cart"><a>Cart</a></Link></li>
                                <li className={router.pathname == "/account" ? "active" : ""}><Link href="/account"><a>Account</a></Link></li>
                                <li><button className="logout-btn" onClick={() => {
                                    cookie.remove('token')
                                    cookie.remove('user')
                                    router.push('/login')
                                }}>Logout</button></li>
                            </>
                        }
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default Navbar