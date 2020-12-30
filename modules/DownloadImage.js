import fs from "fs"
import { http } from "@vizality"

module.exports.downloadImage = async function (url, dest, callbackOnDone) {
    try{
        let buffer = await http.get(url)
        fs.writeFile(dest, buffer.body, () => callbackOnDone());
    } catch (e) {
        console.error(e)
    }
}