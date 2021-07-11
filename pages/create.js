import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import baseUrl from '../helpers/baseUrl'
import { parseCookies } from 'nookies'

const Create = () => {

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [media, setMedia] = useState("")
  const [description, setDescription] = useState("")

  /* submit new product info */
  const handleSubmit = async (e) => {
    e.preventDefault()

    const mediaUrl = await imageUpload()

    const res = await fetch(`${baseUrl}/api/products`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        price: price,
        mediaUrl: mediaUrl,
        description: description
      })
    })
    const res2 = await res.json()
    console.log("res2.error ", res2)
    if (res2.error) {
      toast.error(`${res2.error}`)
    } else {
      toast.success("Update Successful")
    }

  }

  /* Uploading the image received in the Create form to Cloudinary 
  and returns the Cloudinary URL */
  const imageUpload = async () => {
    const data = new FormData();

    data.append('file', media)
    data.append('upload_preset', 'myshop')
    data.append('cloud_name', 'ritubrmseo')

    const res = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: data
    })

    const res2 = await res.json()
    const { url } = res2
    return url

  }

  /* displays create new product form */
  return (

    <form className="create-container container" onSubmit={(e) => handleSubmit(e)}>
      <input type="text" name="name" placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input type="text" name="price" placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <div className="file-input">
        <input type="file"
          accept="image/*"
          onChange={(e) => setMedia(e.target.files[0])}
        />
      </div>
      <textarea name="description"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="createpage-textarea"
      ></textarea>

      <button className="btn create-btn">Submit</button>
      <ToastContainer draggable={false} autoClose={2000} />
    </form>

  )
}
export default Create

export async function getServerSideProps(context) {

  const userCookie = parseCookies(context)
  const user = userCookie.user ? JSON.parse(userCookie.user) : ""

  if (user.role == "user") {
    return {
      redirect: {
        permanent: false,
        destination: "/login"
      }
    }
  }

  return {
    props: {},
  }
}