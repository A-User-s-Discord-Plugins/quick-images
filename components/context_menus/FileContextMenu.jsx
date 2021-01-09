import { React } from '@vizality/webpack'
import { getModuleByDisplayName, contextMenu } from '@vizality/webpack'
import { file } from '@vizality/util'
import PathManager from "../../modules/PathManager"
const { open: openModal } = require('@vizality/modal')

import { Menu } from '@vizality/components'
import DeleteConfirmationModal from "../modals/deleteConfirmation"
import RenameModal from "../modals/Rename"
import VideoModal from "../custom/VideoModal"
const ImageModal = getModuleByDisplayName('ImageModal')

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
                    disabled={fileType === "Video"}
                    action={() => {
                        if (fileType === "Image"){
                            console.log(this.state.imageDimensions)
                            openModal(() => <ImageModal
                                animated={false}
                                className="image-1tIMwV"
                                isTrusted={true}
                                shouldAnimate={true}
                                src={fileUrl}
                                width={this.state.imageDimensions.width}
                                height={this.state.imageDimensions.height}
                            >
                            </ImageModal>)
                        } else {
                            openModal(() => <VideoModal file={file} />)
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