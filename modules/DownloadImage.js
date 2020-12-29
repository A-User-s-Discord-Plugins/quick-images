import fs from "fs"
import request from 'request'

module.exports.downloadImage = async function (url, dest, callbackOnDone) {
    const file = fs.createWriteStream(dest);
    await new Promise((resolve, reject) => {
        request({
            /* Here you should specify the exact link to the file you are trying to download */
            uri: url,
            gzip: true,
        })
            .pipe(file)
            .on('finish', async () => {
                callbackOnDone()
                resolve()
            })
            .on('error', (error) => {
                reject(error)
            });
    })
        .catch((err) => {
            console.error(err)
        });
}