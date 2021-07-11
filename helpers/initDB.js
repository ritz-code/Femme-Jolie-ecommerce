import mongoose from 'mongoose'

function initDB() {

  if (mongoose.connections[0].readyState) {
    console.log("already connected...")
    return
  }


  mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })

  mongoose.connection.on('connected', () => {
    console.log("Connected to Mongo...")
  })

  mongoose.connection.on('error', (err) => {
    console.log("Error Connecting...", err)
  })
}

export default initDB
