import bcrypt from 'bcrypt'

const rounds = parseInt(process.env.HASH_ROUNDS)

export async function make(data) {
  return await bcrypt.hash(data, rounds)
}

export async function compare(data, encrypted) {
  return await bcrypt.compare(data, encrypted)
}

export default {
  make,
  compare,
}