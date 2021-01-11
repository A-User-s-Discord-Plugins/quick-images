//Utils
import path from "path"
import { Plugin } from '@vizality/entities'
import { getModule, React, getModuleByDisplayName, contextMenu } from '@vizality/webpack'
import { patch, unpatch } from '@vizality/patcher'
import { Menu } from '@vizality/components'
import { findInReactTree } from '@vizality/util/react'
import DownloadImage from "./modules/DownloadImage"
import PathManager from "./modules/PathManager"
import * as CommandList from "./commands"
const { updateSetting, getSetting, toggleSetting } = vizality.api.settings._fluxProps(this.addonId)

//Modules
import Settings from "./components/Settings"
import QuickImageButton from "./components/button"
import LazyVideoContextMenu from "./components/context_menus/LazyVideo"
const ChannelTextAreaContainer = getModule(m => m.type?.render?.displayName === "ChannelTextAreaContainer");
const { getChannelId } = getModule('getChannelId', 'getVoiceChannelId')
const { getChannel } = getModule("getChannel");
const { Permissions } = getModule("Permissions")
const UserPermissions = getModule("getHighestRole");
const NativeImageContextMenu = getModule(m => m.default?.displayName === 'NativeImageContextMenu');
const LazyVideo = getModuleByDisplayName("LazyVideo")

module.exports = class QuickImages extends Plugin {
    onStart() {
        //Inject styles
        this.injectStyles('./styles/index.css');
        this.injectStyles('./styles/settings.css');
        this.injectStyles('./styles/embeds.css');
        
        //Inject button
        this.patchImageButton()
        
        //Inject Download Image In Folder context menu item
        this.patchDownloadImageInFolderContextMenu()
        
        //Inject custom context menu for videos
        if (getSetting('contextMenuVideo', true)){
            this.patchDownloadVideoInFolderButton()
        }

        //Register settings
        vizality.api.settings.registerAddonSettings({
            id: this.addonId,
            heading: 'Quick Images',
            render: Settings
        })

        //Inject commands
        CommandList.register()
    }

    onStop() {
        unpatch("quick-images-button")
        unpatch("quick-images-download-context-menu-button")
        unpatch("quick-video-download-context-menu")
        CommandList.unregister()
    }

    patchImageButton() {
        this.log("Patching image button")
        patch("quick-images-button", ChannelTextAreaContainer.type, "render", (args, res) => {
            if (args[0].className !== "channelTextAreaUpload-3t7EIx marginTop8-1DLZ1n" && this.checkUploadPerms(getChannel(getChannelId()))) { // Check if we're not patching in the ChannelTextAreaContainer of the Upload Modal
                const props = findInReactTree(
                    res,
                    (r) =>
                        r && r.className && r.className.indexOf("buttons-") == 0
                );
                props.children.unshift(
                    <QuickImageButton prevText={args[0].textValue}/>
                );
            }
            return res;
        });
    }

    patchDownloadImageInFolderContextMenu() {
        this.log("Patching context menu button")
        patch("quick-images-download-context-menu-button", NativeImageContextMenu, "default", (args, res) => {
            let fileUrl = args[0].src
            res.props.children.unshift(
                <>
                    <Menu.MenuItem 
                        id="download-image-to-folder"
                        label="Save image in QuickFolder"
                        action={() => {
                            DownloadImage(fileUrl, PathManager.getQuickFolderPath() + "/" + path.parse(fileUrl).base,).then(function() {
                                vizality.api.notices.sendToast('qi-downloaded-sucessfully-toast', {
                                    header: "Image downloaded",
                                    content: "The image was downloaded sucessfully",
                                    icon: 'Download',
                                    timeout: 8e3,
                                });
                            })
                        }}
                    />
                </>
            );
            return res;
        });
    }

    patchDownloadVideoInFolderButton() {
        this.log("Patching video context menu")
        patch("quick-video-download-context-menu", LazyVideo.prototype, "render", (args, res) => {
            const video = res.props
            video.onContextMenu = e => {
                e.stopPropagation();
                contextMenu.openContextMenu(e, () => {
                    <LazyVideoContextMenu video={video.src.replace("?format=jpeg", "").replace("https://media.discordapp.net", "https://cdn.discordapp.com")} />
                })
            }
            return res;
        });
    }

    checkUploadPerms(channel) {
        return ( UserPermissions.can(
            Permissions.ATTACH_FILES,
            channel
        ) && UserPermissions.can(
            Permissions.SEND_MESSAGES,
            channel
        )) ||
            channel.type == 1 || // DM
            channel.type == 3 // Group DM
    }
}