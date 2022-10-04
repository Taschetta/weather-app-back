import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors.js"
import database from "@packages/database"
import hash from "@packages/hash"
import token from '@packages/token'

const users = database.table('user')
const sessions = database.table('session')

// middleware

export function authed(req, res, next) {
  const authorization = req.headers.authorization
  
  if(!authorization) {
    throw new BadRequestError('Missing authorization header')
  }

  const [scheme, accessToken] = authorization.split(' ')

  if(scheme !== 'Bearer') {
    throw new BadRequestError('Invalid authorization scheme')
  }

  if(!accessToken) {
    throw new BadRequestError('Missing access token')
  }
  
  if(!token.verifyAccessToken(accessToken)) {
    throw new BadRequestError('Invalid access token')
  }

  const { userId } = token.decode(accessToken)
   
  req.auth = {}
  req.auth.userId = userId

  next()
}

// endpoints

export async function login(req, res) {
  const username = req.query.username
  const password = req.query.password

  if(!username) {
    throw new BadRequestError('Missing username')
  }

  if(!password) {
    throw new BadRequestError('Missing password')
  }

  const user = await users.find({ username })

  if(!user) {
    throw new NotFoundError('Could not find user')
  }

  if(!await hash.compare(password, user.password)) {
    throw new UnauthorizedError('Invalid Password')
  }

  const accessToken = token.signAccessToken({ userId: user.id })
  const refreshToken = token.signRefreshToken({ userId: user.id })

  await sessions.remove('userId', user.id)
  
  await sessions.insert({
    userId: user.id,
    refreshToken,
  })

  res.send({
    success: true,
    accessToken,
    refreshToken,
  })
}

export async function refresh(req, res) {
  const authorization = req.headers.authorization

  if(!authorization) {
    throw new BadRequestError('Missing authorization header')
  }

  const [scheme, refreshToken] = authorization.split(' ')

  if(scheme !== 'Bearer') {
    throw new BadRequestError('Invalid authorization scheme')
  }

  if(!refreshToken) {
    throw new BadRequestError('Missing bearer token')
  }
  
  if(!token.verifyRefreshToken(refreshToken)) {
    throw new BadRequestError('Invalid refresh token')
  }

  const { userId } = token.decode(refreshToken)

  const session = await sessions.find({ userId, refreshToken })

  if(!session) {
    throw new BadRequestError('Invalid refresh token')
  }
  
  const newAccessToken = token.signAccessToken({ userId })
  const newRefreshToken = token.signRefreshToken({ userId })

  await sessions.remove('userId', userId)
  
  await sessions.insert({
    userId: userId,
    refreshToken: newRefreshToken,
  })

  res.send({
    success: true,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  })
}

export async function logout(req, res) {
  const userId = req.auth.userId
  const removed = await sessions.remove('userId', userId)

  res.send({
    success: true,
    removed,
  })
}
