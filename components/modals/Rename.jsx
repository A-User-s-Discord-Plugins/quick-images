import fs from "fs"
import path from "path"
import { Modal, Button } from "@vizality/components"
import { React, getModuleByDisplayName } from "@vizality/webpack"
const { close: closeModal } = require('@vizality/modal')

const FormTitle = getModuleByDisplayName('FormTitle')
const TextInput = getModuleByDisplayName("TextInput")

module.exports = class DeleteConfirmationModal extends React.PureComponent {
    constructor(props){
        super(props)
        this.newFileName;
        this.fileName = path.basename(this.props.file.path)
    }

    render(){
        return <>
            <Modal size={Modal.Sizes.MEDIUM} className="qi-modal-rename">
                <Modal.Header>
                    <FormTitle tag={FormTitle.Tags.H3}>Rename file</FormTitle>
                </Modal.Header>
                <Modal.Content>
                    <TextInput
                        autoFocus
                        defaultValue={this.fileName}
                        className="qi-message-textbox"
                        placeholder={this.fileName}
                        onChange={(value) => {
                            this.newFileName = value
                        }}
                    />
                </Modal.Content>
                <Modal.Footer>
                    <Button
                        look={Button.Looks.FILLED}
                        size={Button.Sizes.MEDIUM}
                        color={Button.Colors.BRAND}
                        onClick={(e) => {
                            fs.renameSync(this.props.file.path, this.props.folder + "/" + this.newFileName)
                            closeModal()
                        }}
                    >
                        Rename
                    </Button>
                    <Button
                        look={Button.Looks.LINK}
                        size={Button.Sizes.MEDIUM}
                        color={Button.Colors.WHITE}
                        onClick={(e) => {
                            closeModal()
                        }}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    }
}