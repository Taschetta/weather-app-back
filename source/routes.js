import express from 'express'

import * as alerts from './alerts/alert-routes.js'
import * as favorites from './favourites/favourite-routes.js'
import * as locations from './locations/location-routes.js'
import * as sessions from './sessions/session-routes.js'
import * as users from './users/user-routes.js'

const routes = express.Router()

routes.route('/alerts/:id')
  .delete(handle(alerts.remove))

routes.route('/alerts')
  .get(handle(alerts.filter))
  .post(handle(alerts.insert))

routes.route('/locations')
  .get(handle(locations.filter))

routes.route('/favorites')
  .get(handle(favorites.filter))
  .post(handle(favorites.insert))
  .delete(handle(favorites.remove))

routes.route('/sessions')
  .post(handle(sessions.login))
  .patch(handle(sessions.refresh))
  .delete(sessions.authed, handle(sessions.logout))

routes.route('/users')
  .post(handle(users.insert))

function handle(callback) {
  return async function (req, res, next) {
    try {
      await callback(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
  
export default routes