import fs from "fs"
import { React } from '@vizality/webpack'
import { getModuleByDisplayName, contextMenu } from '@vizality/webpack'
import { file } from '@vizality/util'
import PathManager from "../../modules/PathManager"
const { open: openModal } = require('@vizality/modal')

import { Menu, ImageModal } from '@vizality/components'
import DeleteConfirmationModal from "../modals/deleteConfirmation"
import RenameModal from "../modals/Rename"
import VideoModal from "../custom/VideoModal"

module.exports = class FileContextMenu extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            imageDimensions: {}
        }
    }

    render() {
        let fileType = PathManager.checkFileType(this.props.file.path, true)
        let file = this.props.file
        let fileUrl = file.url
        if (fileType === "Image") this.setImageDimensions(fileUrl)
        return <>
            <Menu.Menu onClose={contextMenu.closeContextMenu}>
                <Menu.MenuItem
                    id="previre-file"
                    label="Preview"
                    // disabled={fileType === "Video"}
                    action={() => {
                        if (fileType === "Image"){
                            openModal(() => <ImageModal
                                className="image-1tIMwV"
                                src={fileUrl}
                                width={this.state.imageDimensions.width}
                                height={this.state.imageDimensions.height}
                            >
                            </ImageModal>)
                        } else {
                            let stats = fs.statSync(file.path)
                            openModal(() => <VideoModal file={file} fileSize={stats.size} />)
                        }
                    }}
                />
                <Menu.MenuItem
                    id="rename-file"
                    label="Rename"
                    action={() => openModal(() => <RenameModal file={file} folder={this.props.folder}/>)}
                />
                <Menu.MenuItem
                    id="delete-file"
                    label="Delete"
                    color="colorDanger"
                    action={() => openModal(() => <DeleteConfirmationModal file={file} />)}
                />
            </Menu.Menu>
        </>
    }

    async setImageDimensions(img) {
        this.setState({ imageDimensions: await file.getImageDimensions(img) })
    }
}