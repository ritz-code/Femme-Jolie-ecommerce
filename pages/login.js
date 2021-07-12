import Link from 'next/link'
import { useState } from "react"
import { ToastContainer, toast } from 'react-toastify';
import baseUrl from '../helpers/baseUrl'
import { useRouter } from 'next/router'
import cookie from 'js-cookie'

const Login = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  /* POSTS user data to API */
  const userLogin = async (e) => {
    e.preventDefault()
    const res = await fetch(`${baseUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })

    const res2 = await res.json()
    if (res2.error) {
      toast.error(`${res2.error}`)
    } else {
      /* in case of error, tokens removed and rerouting to login */
      cookie.set('token', res2.token)
      cookie.set('user', res2.user)
      router.push('/')
    }
  }

  /* login page display */
  return (
    <>
      <form className="login-container container" onSubmit={(e) => { userLogin(e) }}>
        <div className="login-icon"><i className="far fa-3x fa-user-circle"></i></div>

        <input type="text" name="email" placeholder="Email"
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input type="password" name="password" placeholder="Password"
          autoComplete="off"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn login-btn">Login</button>
        <ToastContainer draggable={false} autoClose={2000} />
        <Link href="/signup"><a><h6>{`Don't have an account?`}</h6></a></Link>
      </form>
    </>
  )
}
export default Login