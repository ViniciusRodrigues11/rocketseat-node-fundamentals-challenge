import { CustomError } from '../../helpers/errors.js'

import {Database}  from '../../database.js'

const db = new Database()

export const persistTask = ({ title, description }) => {

    if (!title) {
        throw new CustomError('Title is required', 400)
    }

    if (!description) {
        throw new CustomError('Description is required', 400)
    }

    const task = {
        title,
        description,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }

    return db.insert('tasks', task)
}