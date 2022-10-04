import express from 'express'
import routes from './routes.js'

const PORT = process.env.APP_PORT

const app = express()

app.use(express.json())

app.use(routes)

app.use((error, req, res, next) => {
  console.log(error)
  switch (error.name) {
    case 'BadRequestError':
      res.status(400).send({ success: false, message: error.message })
      break;
    case 'NotFoundError':
      res.status(404).send({ success: false, message: error.message })
      break;
    case 'UnauthorizedError':
      res.status(401).send({ success: false, message: error.message })
      break;
    default:
      res.status(500).send({ success: false, message: 'server error'})
      break;
  }
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})