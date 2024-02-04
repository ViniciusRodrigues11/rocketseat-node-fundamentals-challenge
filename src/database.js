import fs from 'node:fs/promises';
import { randomUUID } from 'node:crypto'
import { CustomError } from './helpers/errors.js'

const databasePath = new URL('../db.json', import.meta.url)

/**
 * Represents an in-memory database with methods to interact with the data.
 */
export class Database {
    database = {}

    constructor() {
        fs.readFile(databasePath, 'utf8')
            .then(data => {
                this.database = JSON.parse(data)
            })
            .catch(() => {
                this.#persist()
            })
    }

    #persist() {
        return fs.writeFile(
            databasePath,
            JSON.stringify(this.database)
        )
    }

    /**
     * Selects and returns rows from the specified table based on the search criteria.
     *
     * @param {string} table - The name of the table from which to select rows.
     * @param {Object} search - The search criteria used to filter the rows.
     * @return {Array} The selected rows based on the search criteria, or an empty array if no match is found.
     */
    select(table, search) {
        let data = this.database[table] ?? []

        if (search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        }

        return data
    }

    /**
     * Inserts data into a table in the database and persists the changes.
     *
     * @param {string} table - The name of the table in the database.
     * @param {any} data - The data to be inserted into the table.
     * @return {any} The inserted data.
     */
    insert(table, data) {

        const dataWithId = { id: randomUUID(), ...data }

        if (Array.isArray(this.database[table])) {
            this.database[table].push(dataWithId)
        } else {
            this.database[table] = [dataWithId]
        }

        this.#persist()

        return dataWithId
    }

    /**
     * Deletes a row from the specified table based on the given id.
     *
     * @param {string} table - The name of the table from which to delete the row.
     * @param {number} id - The id of the row to be deleted.
     * @return {void} 
     */
    delete(table, id) {
        const rowIndex = this.database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
            this.database[table].splice(rowIndex, 1)
            this.#persist()
        }
    }

    /**
     * Updates a row in the specified table with the given id and data.
     *
     * @param {string} table - the name of the table to update
     * @param {number} id - the id of the row to update
     * @param {object} data - the data to update the row with
     * @return {object} the updated row
     */
    update(table, id, data) {
        const rowIndex = this.database[table].findIndex(row => row.id === id)


        if (rowIndex > -1) {
            const row = { id, ...this.database[table][rowIndex], ...data }
            this.database[table][rowIndex] = row
            this.#persist()
            return row
        }

        throw new CustomError('Task not found', 404)
    }
}