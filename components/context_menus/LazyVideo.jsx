import path from "path"
import { React } from '@vizality/webpack'
import { contextMenu } from '@vizality/webpack'

import { Menu } from '@vizality/components'
import DownloadImage from "../../modules/DownloadImage"
import PathManager from "../../modules/PathManager"

module.exports = class LazyVideoContextMenu extends React.Component {
    render() {
        return <>
            <Menu.Menu onClose={contextMenu.closeContextMenu}>
                <Menu.MenuItem
                    id="download-video"
                    label="Download video to QuickFolder"
                    action={() => {
                        let fileurl = this.props.video
                        let filename = path.parse(fileurl).base
                        DownloadImage(fileurl, PathManager.getQuickFolderPath() + "/" + filename).then(function () {
                            api.notices.sendToast('qi-downloaded-sucessfully-toast', {
                                header: "Video downloaded",
                                content: "The video was downloaded sucessfully",
                                icon: 'Download',
                                timeout: 8e3,
                            });
                        })
                    }}
                />
            </Menu.Menu>
        </>
    }
}