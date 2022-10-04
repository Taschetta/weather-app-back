import { BadRequestError } from "../errors.js"
import database from '@packages/database'
import hash from '@packages/hash'

const table = database.table('user')

export async function insert(req, res) {
  const username = req.body.username
  const password = req.body.password
  
  if(!username) {
    throw new BadRequestError('Username missing')
  }

  if(!password) {
    throw new BadRequestError('Password missing')
  }

  const id = await table.insert({ 
    username, 
    password: await hash.make(password),
  })

  res.send({
    success: true,
    id,
  })
}