import fs from 'fs';
import { getModule } from "@vizality/webpack"
import PathManager from '../modules/PathManager'

const { getChannelId } = getModule('getChannelId', 'getVoiceChannelId')

export default {
    command: 'upload',
    description: 'Send a file via commands.',
    options: [
        { name: 'filename', required: true },
        { name: 'message', required: false }
    ],
    executor: (args) => {
        let fileName = args[0]
        let filePath = PathManager.getQuickFolderPath() + "/" + fileName
        let msg = { content: args[1] }
        const fileExists = fs.existsSync(filePath);
        if (fileExists){
            uploadFile(fs.readFileSync(filePath), fileName, msg)
        } else {
            return {
                send: false,
                result: `${fileName} doesn't exists! `
            };
        }
    },
};

const uploadFile = async function(fileContents, fileName, messsage = "") {
    const { upload } = await getModule('cancel', 'upload')

    let fileprop = new File([fileContents], fileName); // Transforms the Buffer from fileContents to a File component

    upload(getChannelId(), fileprop, messsage) // Uploads
}