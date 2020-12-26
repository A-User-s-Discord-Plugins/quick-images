import { React, getModuleByDisplayName } from "@vizality/webpack"
import { Modal } from "@vizality/components"
const { close: closeModal } = require('@vizality/modal')

const FormTitle = getModuleByDisplayName('FormTitle', false)

module.exports = class QuickImagesModal extends React.PureComponent {
    render() {
        return <>
            <Modal size={Modal.Sizes.LARGE}>
                <Modal.Header>
                    <FormTitle tag={FormTitle.Tags.H3}>Your images</FormTitle>
                    <Modal.CloseButton onClick={closeModal} />
                </Modal.Header>
                <Modal.Content>
                    <span>yis</span>
                </Modal.Content>
            </Modal>
        </>
    }
}