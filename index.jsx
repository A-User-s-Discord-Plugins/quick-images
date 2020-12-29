//Utils
import path from "path"
import { Plugin } from '@vizality/entities'
import { getModule, React, getModuleByDisplayName} from '@vizality/webpack'
import { patch, unpatch } from '@vizality/patcher'
import { Menu } from '@vizality/components'
import { findInReactTree } from '@vizality/util/react'
import DownloadImage from "./modules/DownloadImage"
import PathManager from "./modules/PathManager"
const { contextMenu: { openContextMenu } } = require('@vizality/webpack')
 
//Modules
import Settings from "./components/Settings"
import QuickImageButton from "./components/button"
// import LazyVideoContextMenu from "./components/context menus/to patch/LazyVideo"
const ChannelTextAreaContainer = getModule(m => m.type?.render?.displayName === "ChannelTextAreaContainer");
const { getChannelId } = getModule('getChannelId', 'getVoiceChannelId')
const { Permissions } = getModule("Permissions")
const UserPermissions = getModule("getHighestRole");
const { getChannel } = getModule("getChannel");
const NativeImageContextMenu = getModule(m => m.default?.displayName === 'NativeImageContextMenu');
const LazyVideo = getModuleByDisplayName("LazyVideo")

module.exports = class QuickImages extends Plugin {
    onStart() {
        this.injectStyles('./styles/index.css');
        this.patchImageButton()
        this.patchDownloadImageInFolderContextMenu()
        // this.patchDownloadVideoInFolderButton()
        vizality.api.settings.registerAddonSettings({
            id: this.addonId,
            heading: 'Quick Images',
            render: Settings
        })
    }

    onStop() {
        unpatch("quick-images-button")
        unpatch("quick-images-download-context-menu-button")
        unpatch("quick-video-download-context-menu")
    }

    patchImageButton() {
        console.log("patching image button")
        patch("quick-images-button", ChannelTextAreaContainer.type, "render", (args, res) => {
            // Add to the buttons.
            const props = findInReactTree(
                res,
                (r) =>
                    r && r.className && r.className.indexOf("buttons-") == 0
            );

            if (this.checkUploadPerms(getChannel(getChannelId()))) {
                props.children.unshift(
                    <><QuickImageButton /></>
                );
            }

            return res;
        });
    }

    patchDownloadImageInFolderContextMenu() {
        console.log("patching context menu button")
        patch("quick-images-download-context-menu-button", NativeImageContextMenu, "default", (args, res) => {
            let fileUrl = args[0].src
            res.props.children.unshift(
                <>
                    <Menu.MenuItem 
                        id="download-image-to-folder"
                        label="Download image to QuickFolder"
                        action={() => {
                            DownloadImage.downloadImage(fileUrl, PathManager.getQuickFolderPath() + "/" + path.parse(fileUrl).base, function() {
                            console.log(`yes`);
                        })}}
                    />
                </>
            );

            return res;
        });
    }

    // patchDownloadVideoInFolderButton() {
    //     console.log("patching context menu")
    //     patch("quick-video-download-context-menu", LazyVideo, "default", (args, res) => {
    //         console.log(res)
    //         let downloadbutton = findInReactTree(res, 
    //             e => e && typeof e.className === 'string' && e.className === "metadataDownload-1fk90V" !== -1
    //         )
    //         console.log(downloadbutton)
    //         downloadbutton.onClick = console.log("yes")

    //         return res;
    //     });
    // }

    checkUploadPerms(channel) {
        return UserPermissions.can(
            Permissions.ATTACH_FILES,
            channel
        ) ||
            channel.type == 1 || // DM
            channel.type == 3 // Group DM
    }
     

    // async downloadImage(url, dest) {
    //     const file = fs.createWriteStream(dest);
    //     await new Promise((resolve, reject) => {
    //         request({
    //             /* Here you should specify the exact link to the file you are trying to download */
    //             uri: url,
    //             gzip: true,
    //         })
    //             .pipe(file)
    //             .on('finish', async () => {
    //                 console.log(`The file is finished downloading.`);
    //                 resolve();
    //             })
    //             .on('error', (error) => {
    //                 reject(error);
    //             });
    //     })
    //     .catch((err) => {
    //         console.error(err);
    //     });
    // }
}