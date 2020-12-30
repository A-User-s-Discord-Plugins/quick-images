import fs from "fs"
import { http } from "@vizality"

module.exports = async function (url, dest) {
    try {
        let buffer = await http.get(url)
        return fs.promises.writeFile(dest, buffer.body);
    } catch (e) {
        console.error(e)
    }
}