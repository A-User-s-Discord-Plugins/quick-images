import fs from "fs"
import * as http from '@vizality/http';

module.exports = async function (url, dest) {
    try {
        let buffer = await http.get(url)
        return fs.promises.writeFile(dest, buffer.body);
    } catch (e) {
        console.error(e)
    }
}