import fs from 'node:fs';
import { parse } from 'csv-parse'
import { persistTask } from '../controllers/tasks/persist.controller.js'

const csvPath = new URL('tasks.csv', import.meta.url)
const stream = fs.createReadStream(csvPath)

const csvParser = parse({
    delimiter: ',',
    skipEmptyLines: true,
    fromLine: 2
})

const importFile = async () => {
    const linesParse = stream.pipe(csvParser);

    let sucessImports = 0;
    let failedImports = 0;
    let index = 1;


    for await (const line of linesParse) {
        const [title, description] = line;

        try {
            persistTask({ title, description })
            sucessImports++;
        } catch (err) {
            failedImports++;
            console.error({ error: err.message, line: index })
        } finally {
            index++;
        }
    }

    console.log(`
    ----------------------------
    !!!Importação concluida!!!

    ✅ Sucesso: ${sucessImports}. 
    ❌ Falha: ${failedImports}.
    ----------------------------
    `)
}


importFile()