import { Plugin } from '@vizality/entities'
import { getModule, React, getModuleByDisplayName } from '@vizality/webpack'
import { patch, unpatch } from '@vizality/patcher'
import { Menu } from '@vizality/components'
const { react: { findInReactTree } } = require('@vizality/util')
const fs = require("fs")
const request = require('request');
const path = require("path")

import Settings from "./components/settings/Settings"

const ChannelTextAreaContainer = getModule(m => m.type?.render?.displayName === "ChannelTextAreaContainer");
const { getChannelId } = getModule('getChannelId', 'getVoiceChannelId')
const { Permissions } = getModule("Permissions")
const UserPermissions = getModule("getHighestRole");
const { getChannel } = getModule("getChannel");
const NativeImageContextMenu = getModule(m => m.default?.displayName === 'NativeImageContextMenu');

const SettingsButton = require("./components/button");

const folderPath = vizality.api.settings._fluxProps(this.addonId).getSetting("folderPath")

module.exports = class QuickImages extends Plugin {
    onStart() {
        this.injectStyles('./styles/index.css');
        this.patchImageButton()
        this.patchDownloadImageInFolderContextMenu()
        vizality.api.settings.registerAddonSettings({
            id: this.addonId,
            heading: 'Quick Images',
            render: Settings
        })
    }

    onStop() {
        unpatch("quick-images-button")
        unpatch("quick-images-download-context-menu")
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
                    <><SettingsButton /></>
                );
            }

            return res;
        });
    }

    patchDownloadImageInFolderContextMenu() {
        console.log("patching context menu")
        patch("quick-images-download-context-menu", NativeImageContextMenu, "default", (args, res) => {
            let fileUrl = args[0].src
            res.props.children.unshift(
                <>
                    <Menu.MenuItem 
                        id="download-to-folder"
                        label="Download image to QuickFolder"
                        action={() => this.downloadImage(fileUrl, folderPath + "/" + path.parse(fileUrl).base)}
                    />
                </>
            );

            return res;
        });
    }

    patchDownloadInFolderContextMenu() {
        console.log("patching context menu")
        patch("quick-images-download-context-menu", NativeImageContextMenu, "default", (args, res) => {
            let fileUrl = args[0].src
            res.props.children.unshift(
                <>
                    <Menu.MenuItem
                        id="download-to-folder"
                        label="Download file to QuickFolder"
                        action={() => this.downloadImage(fileUrl, folderPath + "/" + path.parse(fileUrl).base)}
                    />
                </>
            );

            return res;
        });
    }

    checkUploadPerms(channel) {
        return UserPermissions.can(
            Permissions.ATTACH_FILES,
            channel
        ) ||
            channel.type == 1 || // DM
            channel.type == 3 // Group DM
    }

    async downloadImage(url, dest) {

    /* Create an empty file where we can save data */
    const file = fs.createWriteStream(dest);

    /* Using Promises so that we can use the ASYNC AWAIT syntax */
    await new Promise((resolve, reject) => {
        request({
            /* Here you should specify the exact link to the file you are trying to download */
            uri: url,
            gzip: true,
        })
            .pipe(file)
            .on('finish', async () => {
                console.log(`The file is finished downloading.`);
                resolve();
            })
            .on('error', (error) => {
                reject(error);
            });
    })
        .catch((err) => {
            console.error(err);
        });
}
}