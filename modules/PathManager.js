import path from "path"

var quickfolder = vizality.api.settings._fluxProps(this.addonId).getSetting("folderPath")

module.exports.getQuickFolderPath = function(pure = false){
    if(pure){
        return quickfolder
    } else {
        return path.normalize(quickfolder)
    }
}