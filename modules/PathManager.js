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