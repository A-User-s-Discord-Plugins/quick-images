import { shell, clipboard } from 'electron'
import path from "path"
import { React, contextMenu } from '@vizality/webpack'
import DownloadImage from "../../modules/DownloadImage"
import PathManager from "../../modules/PathManager"

import { ContextMenu, Icon } from '@vizality/components'

module.exports = class LazyVideoContextMenu extends React.Component {
    constructor(props){
        super(props)

        this.fileurl = this.props.video
        this.filename = path.parse(this.fileurl).base
    }
    
    render() {
        return <>
            <ContextMenu onClose={contextMenu.closeContextMenu}>
                <ContextMenu.Group
                    className="qi-lazyvideo-context-menu"
                    label={<>
                        <Icon name='CallVideoCamera' />
                        <div className="qi-lazyvideo-context-menu-file-name">
                            {this.filename}
                        </div>
                    </>}
                >
                    <ContextMenu.Item
                        id="download-video"
                        label="Save video in QuickFolder"
                        action={() => {
                            DownloadImage(this.fileurl, PathManager.getQuickFolderPath() + "/" + this.filename).then(function () {
                                vizality.api.notices.sendToast('qi-downloaded-sucessfully-toast', {
                                    header: "Video downloaded",
                                    content: "The video was downloaded sucessfully",
                                    icon: 'Download',
                                    timeout: 8e3,
                                });
                            })
                        }}
                    />
                    <ContextMenu.Item
                        id="copy-video-url"
                        label="Copy video URL"
                        action={() => {
                            clipboard.writeText(this.fileurl)
                        }}
                    />
                    <ContextMenu.Item
                        id="open-video-in-external-browser"
                        label="Open video"
                        action={() => {
                            shell.openExternal(this.fileurl)
                        }}
                    />
                </ContextMenu.Group>
            </ContextMenu>
        </>
    }
}