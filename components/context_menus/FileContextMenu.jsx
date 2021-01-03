import { React } from '@vizality/webpack'
import { contextMenu } from '@vizality/webpack'
const { open: openModal } = require('@vizality/modal')

import { Menu } from '@vizality/components'
import DeleteConfirmationModal from "../modals/deleteConfirmation"
import RenameModal from "../modals/Rename"
import PreviewImageModal from "../modals/preview/Image"

module.exports = class FileContextMenu extends React.Component {
    render() {
        return <>
            <Menu.Menu onClose={contextMenu.closeContextMenu}>
                <Menu.MenuItem
                    id="previre-file"
                    label="Preview"
                    action={() => openModal(() => <PreviewImageModal file={this.props.file} fileContents={this.props.fileContents} />)}
                />
                <Menu.MenuItem
                    id="rename-file"
                    label="Rename"
                    action={() => openModal(() => <RenameModal file={this.props.file} folder={this.props.folder} fileName={this.props.fileName}/>)}
                />
                <Menu.MenuItem
                    id="delete-file"
                    label="Delete"
                    color="colorDanger"
                    action={() => openModal(() => <DeleteConfirmationModal file={this.props.file} />)}
                />
            </Menu.Menu>
        </>
    }
}