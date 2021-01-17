
import { shell } from 'electron'
import { React } from '@vizality/webpack'
import { contextMenu } from '@vizality/webpack'
import PathManager from "../../modules/PathManager"

import { ContextMenu } from '@vizality/components'

module.exports = class ButtonContextMneu extends React.Component {
    render() {
        return <>
            <ContextMenu onClose={contextMenu.closeContextMenu}>
                <ContextMenu.Item
                    id="open-quickfolder"
                    label="Open QuickFolder in file manager"
                    action={() => shell.openPath(PathManager.getQuickFolderPath())}
                />
            </ContextMenu>
        </>
    }
}