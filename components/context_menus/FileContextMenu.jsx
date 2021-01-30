import fs from "fs"
import { React } from '@vizality/webpack'
import { getModuleByDisplayName, contextMenu } from '@vizality/webpack'
import { file } from '@vizality/util'
import PathManager from "../../modules/PathManager"
const { open: openModal } = require('@vizality/modal')

import { ContextMenu, ImageModal } from '@vizality/components'
import DeleteConfirmationModal from "../modals/deleteConfirmation"
import RenameModal from "../modals/Rename"
import VideoModal from "../custom/VideoModal"

module.exports = class FileContextMenu extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            imageDimensions: {},
            file: {},
            fileUrl: "",
            fileType: ""
        }

        this.closeMenu = this.closeMenu.bind(this)

        this.shouldRevoke = true
    }

    componentDidMount(){
        this.isolateFile()
    }

    render() {
        if (this.state.fileType === "Image") this.setImageDimensions(this.fileUrl)
        return <>
            <ContextMenu onClose={this.closeMenu}>
                <ContextMenu.Item
                    id="previre-file"
                    label="Preview"
                    // disabled={fileType === "Video"}
                    action={() => {
                        if (this.fileType === "Image"){
                            this.shouldRevoke = false
                            openModal(() => <ImageModal
                                className="image-1tIMwV"
                                src={this.state.fileUrl}
                                width={this.state.imageDimensions.width}
                                height={this.state.imageDimensions.height}
                            >
                            </ImageModal>)
                        } else {
                            this.shouldRevoke = false
                            let stats = fs.statSync(this.state.file.path)
                            openModal(() => <VideoModal file={this.state.file} fileSize={stats.size} />)
                        }
                    }}
                />
                <ContextMenu.Item
                    id="rename-file"
                    label="Rename"
                    action={() => openModal(() => <RenameModal file={this.state.file} folder={this.props.folder}/>)}
                />
                <ContextMenu.Item
                    id="delete-file"
                    label="Delete"
                    color="colorDanger"
                    action={() => openModal(() => <DeleteConfirmationModal file={this.state.file} />)}
                />
            </ContextMenu>
        </>
    }

    async setImageDimensions(img) {
        this.setState({ imageDimensions: await file.getImageDimensions(img) })
    }

    closeMenu(){
        //URL.revokeObjectURL(this.state.file.url)
        contextMenu.closeContextMenu()
    }

    async isolateFile(){
        let fileRead = await file.getObjectURL(this.props.file.path)
        this.setState({ file: fileRead[0] })
        console.log("file:", this.state.file)
        this.setState({ fileUrl: this.state.file.url})
        console.log("fileUrl:", this.state.fileUrl)
        this.setState({ fileType: PathManager.checkFileType(this.state.file.path, true) })
        console.log("fileType:", this.state.fileType)
    }
}