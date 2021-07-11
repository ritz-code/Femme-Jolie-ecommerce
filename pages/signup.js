import { useState } from "react"
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify';
import baseUrl from '../helpers/baseUrl'
import { useRouter } from 'next/router'

const Signup = () => {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const router = useRouter()

  /* POST user signup data to DB */
  const userSignup = async (e) => {

    e.preventDefault()
    const res = await fetch(`${baseUrl}/api/signup`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password
      })
    })

    const res2 = await res.json()

    const { error } = res2
    if (error) {
      toast.error(`${error}`)
    } else {
      router.push("/login")
    }
  }

  /* displays signup page */
  return (
    <>
      <form className="signup-container container" onSubmit={(e) => userSignup(e)}>
        <div className="signup-icon"><i className="far fa-3x fa-user-circle"></i></div>
        <input type="text" name="name" placeholder="Name"
          autoComplete="off"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <button className="btn register-btn">Register</button>
        <ToastContainer draggable={false} autoClose={4000} />
        <Link href="/login"><a><h6>Already have an account?</h6></a></Link>
      </form>
    </>
  )
}

export default Signup