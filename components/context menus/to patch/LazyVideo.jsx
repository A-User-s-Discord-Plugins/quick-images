import { React } from '@vizality/webpack'
import { Menu } from '@vizality/components'
import DownloadImage from "./../../../modules/DownloadImage"
const { contextMenu: { closeContextMenu } } = require('@vizality/webpack')

const folderPath = vizality.api.settings._fluxProps(this.addonId).getSetting("folderPath")

module.exports = class LazyVideoContextMenu extends React.Component{
    render(){
        console.log(this.props)
        return <>
            <Menu.Menu onClose={closeContextMenu}>
                <Menu.MenuItem
                    id="download-video-to-folder"
                    label="Download video to QuickFolder"
                    action={() => { console.log(this.props) /* DownloadImage.downloadImage(this.props.video, folderPath + "/" + path.parse(this.props.video).base) */}}
                />
            </Menu.Menu>
        </>
    }
}