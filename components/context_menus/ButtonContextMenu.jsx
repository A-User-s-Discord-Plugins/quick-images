
import { shell } from 'electron'
import { React } from '@vizality/webpack'
import { contextMenu } from '@vizality/webpack'
import PathManager from "../../modules/PathManager"

import { Menu } from '@vizality/components'

module.exports = class ButtonContextMneu extends React.Component {
    render() {
        return <>
            <Menu.Menu onClose={contextMenu.closeContextMenu}>
                <Menu.MenuItem
                    id="open-quickfolder"
                    label="Open QuickFolder in your file managwe"
                    action={() => shell.openPath(PathManager.getQuickFolderPath())}
                />
            </Menu.Menu>
        </>
    }
}