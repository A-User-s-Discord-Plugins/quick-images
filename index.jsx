//Utils
import path from "path"
import { Plugin } from '@vizality/entities'
import { getModule, React, getModuleByDisplayName, contextMenu } from '@vizality/webpack'
import { patch, unpatch } from '@vizality/patcher'
import { Menu } from '@vizality/components'
import { findInReactTree } from '@vizality/util/react'
import DownloadImage from "./modules/DownloadImage"
import PathManager from "./modules/PathManager"
import api from "@vizality/api"

//Modules
import Settings from "./components/Settings"
import QuickImageButton from "./components/button"
import LazyVideoContextMenu from "./components/context_menus/LazyVideo"
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
        this.injectStyles('./styles/settings.css');
        this.patchImageButton()
        this.patchDownloadImageInFolderContextMenu()
        this.patchDownloadVideoInFolderButton()
        api.settings.registerAddonSettings({
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
        this.log("Patching image button")
        patch("quick-images-button", ChannelTextAreaContainer.type, "render", (args, res) => {
            if (args[0].className !== "channelTextAreaUpload-3t7EIx marginTop8-1DLZ1n" && this.checkUploadPerms(getChannel(getChannelId()))) { // Check if we're not patching in the ChannelTextAreaContainer of the Upload Modal
                // Add to the buttons.
                const props = findInReactTree(
                    res,
                    (r) =>
                        r && r.className && r.className.indexOf("buttons-") == 0
                );

                props.children.unshift(
                    <QuickImageButton />
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
                        label="Download image to QuickFolder"
                        action={() => {
                            DownloadImage(fileUrl, PathManager.getQuickFolderPath() + "/" + path.parse(fileUrl).base,).then(function() {
                                api.notices.sendToast('qi-downloaded-sucessfully-toast', {
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
        console.log("patching videos")
        patch("quick-video-download-context-menu", LazyVideo.prototype, "render", (args, res) => {
            console.log(args, res, res.props, "\n" + res.props.onContextMenu)
            // Add to the buttons.
            const video = res.props

            video.onContextMenu = e => contextMenu.openContextMenu(e, () => <LazyVideoContextMenu video={video.src.replace("?format=jpeg", "")} />)
            // console.log(props)

            // props.children.unshift(
            //     <span>yes</span>
            // );

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