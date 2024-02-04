/**
 * Asynchronously parses the request body as JSON and sets the response header to 'application/json'.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export async function json(req, res) {
    const buffers = []

    for await (const chunk of req) {
        buffers.push(chunk)
    }

    try {
        req.body = JSON.parse(Buffer.concat(buffers).toString('utf8'))
    } catch {
        req.body = null
    }

    res.setHeader('Content-Type', 'application/json')
}