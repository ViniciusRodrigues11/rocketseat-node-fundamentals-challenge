import { persistTask } from './controllers/tasks/persist.controller.js';
import { Database } from './database.js';
import { Router } from './helpers/Router.js'

const router = new Router()
const db = new Database();

router.addRoute('GET', '/tasks', (req, res) => {
    const { search } = req.query

    const tasks = db.select('tasks', search ? {
        title: search,
        description: search
    } : null)

    return res.end(JSON.stringify(tasks))
});

router.addRoute('POST', '/tasks', (req, res) => {
    const { title, description } = req.body
    try {
        persistTask({ title, description })
        return res.end(JSON.stringify(data))
    } catch(err) {
        return res
            .writeHead(err.statusCode)
            .end(JSON.stringify({ message: err.message }))
    }
    
})

router.addRoute('DELETE', '/tasks/:id', (req, res) => {
    const { id } = req.params
    db.delete('tasks', id)
    return res.writeHead(204).end()
})

router.addRoute('PUT', '/tasks/:id', (req, res) => {
    const { id } = req.params
    const { title, description } = req.body

    try {
        const data = db.update('tasks', id, {
            title,
            description,
            updated_at: new Date().toISOString()
        })

        return res.writeHead(200).end(JSON.stringify(data))
    } catch (err) {
        return res
            .writeHead(err.statusCode)
            .end(JSON.stringify({ message: err.message }))
    }
})

router.addRoute('PATCH', '/tasks/:id/complete', (req, res) => {
    const { id } = req.params
    const data = db.update('tasks', id, {
        completed_at: new Date().toISOString()
    })
    return res.writeHead(200).end(JSON.stringify(data))
})

const routes = router.routes


export {
    routes
}