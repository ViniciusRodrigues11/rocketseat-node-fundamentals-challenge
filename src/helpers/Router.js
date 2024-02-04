
import { buildRoutePath } from '../utils/build-route-path.js'

export class Router {
    constructor() {
        this.routes = [];
    }

    /**
     * Adds a new route to the routes array.
     *
     * @param {type} method - the HTTP method for the route
     * @param {type} path - the URL path for the route
     * @param {type} handler - the handler function for the route
     * @return {type} undefined
     */
    addRoute(method, path, handler) {

        this.routes.push({
            method,
            path: buildRoutePath(path),
            handler,
        });
    }
    
}
