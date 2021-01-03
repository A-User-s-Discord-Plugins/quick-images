import fs from "fs"
import { Modal, Button } from "@vizality/components"
import { React, getModuleByDisplayName } from "@vizality/webpack"
const { close: closeModal } = require('@vizality/modal')

const FormTitle = getModuleByDisplayName('FormTitle')

module.exports = class DeleteConfirmationModal extends React.PureComponent {
    constructor(props){
        super(props)
    }

    render(){
        return <>
            <Modal size={Modal.Sizes.SMALL}>
                <Modal.Header>
                    <FormTitle tag={FormTitle.Tags.H3}>Delete file</FormTitle>
                </Modal.Header>
                <Modal.Content>
                    <div className="colorStandard-2KCXvj size16-1P40sf">Are you sure that wanna delete this file? This action can't be reversed</div>
                </Modal.Content>
                <Modal.Footer>
                    <Button
                        look={Button.Looks.FILLED}
                        size={Button.Sizes.MEDIUM}
                        color={Button.Colors.RED}
                        onClick={(e) => {
                            fs.unlinkSync(this.props.file.path)
                            closeModal()
                        }}
                    >
                        Delete
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