import fs from "fs"
import path from "path"

var quickfolder = vizality.api.settings._fluxProps(this.addonId).getSetting("folderPath")

module.exports.getQuickFolderPath = function(pure = false){
    if (!fs.existsSync(quickfolder)) {console.error("PathManager: QuickFolder doesn't exist!"); return}
    if(pure){
        return quickfolder
    } else {
        return path.normalize(quickfolder)
    }
}

module.exports.quickFolderExists = fs.existsSync(quickfolder)

module.exports.checkFileType = function(filePath, shouldErrorOnUnkownType = false){
    let fileExt = path.extname(filePath.toLowerCase())
    if (fileExt.toLowerCase() == ".mp4" || fileExt.toLowerCase() == ".mov"){
        return "Video"
    } else if (fileExt === '.png' || fileExt === '.jpg' || fileExt === '.jpeg' || fileExt === '.gif'){
        return "Image"
    } else {
        if (shouldErrorOnUnkownType){
            console.error("Unkown type of image, Check some of the file informations:", {
                fileExtension: fileExt,
                filePaht: filePath
            })
        } else {
            return "Not a video, neither a image"
        }
    }
}