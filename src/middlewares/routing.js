import { routes } from '../routes.js'
import { extractQueryParams } from '../utils/extract-query-params.js'

 /**
 * Asynchronous function for routing requests.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @return {Promise} returns a Promise
 */
export async function routing(req, res) {

    const { method, url } = req

    const route = routes.find(route => {
        return route.method === method && route.path.test(url)
    })

    if (route) {
        const { query, ...params } = req.url.match(route.path).groups

        req.params = params
        req.query = query ? extractQueryParams(query) : {}

        return route.handler(req, res)
    }

    return res.writeHead(404).end()
}
