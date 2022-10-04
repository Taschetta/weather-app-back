import jwt from "jsonwebtoken"

const SECRET = process.env.TOKEN_SECRET
const EXPIRATION = parseInt(process.env.TOKEN_EXPIRATION)

class InvalidTokenError extends Error {
  constructor() {
    super('The token provided is invalid')
    this.name = 'InvalidTokenError'
    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidTokenError)
    }
  }
}

export function sign(payload, { expiresIn } = {}) {
  return jwt.sign(payload, SECRET, { expiresIn })
}

export function signAccessToken(payload) {
  payload.type = 'access'
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRATION })
}

export function signRefreshToken(payload) {
  payload.type = 'refresh'
  return jwt.sign(payload, SECRET)
}

export function decode(token) {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    throw new InvalidTokenError()
  }
}

export function verify(token) {
  try {
    jwt.verify(token, SECRET)
    return true
  } catch {
    return false
  }
}

export function verifyAccessToken(token) {
  try {
    const payload = decode(token)
  
    if(payload.type !== 'access') {
      return false
    }
  
    return true    
  } catch {
    return false
  }
}

export function verifyRefreshToken(token) {
  try {
    const payload = decode(token)
  
    if(payload.type !== 'refresh') {
      return false
    }
  
    return true    
  } catch {
    return false
  }
}

export default {
  sign,
  signAccessToken,
  signRefreshToken,
  decode,
  verify,
  verifyAccessToken,
  verifyRefreshToken,
}