import { React, getModule, getModuleByDisplayName } from "@vizality/webpack"
import { Modal } from "@vizality/components"
const { close: closeModal } = require('@vizality/modal')

const fs = require("fs")
const path = require("path")

const { getChannelId } = getModule('getChannelId', 'getVoiceChannelId')

const FormTitle = getModuleByDisplayName('FormTitle', false)

const folderPath = vizality.api.settings._fluxProps(this.addonId).getSetting("folderPath")

module.exports = class QuickImagesModal extends React.PureComponent {
    render() {
        return <>
            <Modal size={Modal.Sizes.LARGE}>
                <Modal.Header>
                    <FormTitle tag={FormTitle.Tags.H3}>Your images</FormTitle>
                    <Modal.CloseButton onClick={closeModal} />
                </Modal.Header>
                <Modal.Content>
                    {
                        this.openImageList()
                    }
                </Modal.Content>
            </Modal>
        </>
    }

    openImageList(){
        console.log(folderPath)
        let images = this.outputImages(folderPath)
        console.log(images)
        return images.map((img) => {
            let actualImage = folderPath + "/" + img
            return <img src={"data:image/png;base64, " + fs.readFileSync(actualImage, { encoding: "base64" })}
            onClick={(e) => {
                e.stopPropagation();
                this.uploadImage(fs.readFileSync(actualImage), img)
                closeModal()
            }} />
        })
    }

    async uploadImage(fileContents, fileName){
        const { upload } = await getModule('cancel', 'upload')

        let fileprop = new File([fileContents], fileName); // Transforms the Buffer from fileContents to a File component
        console.log(fileprop)
        
        upload(getChannelId(), fileprop, "") // Uploads
    }
    
    outputImages(dirname) {
        let filenames = fs.readdirSync(dirname)
        let images = filenames.filter(function (e) {
            let extname = path.extname(e).toLowerCase()
            if (extname === '.png' || extname === '.jpg') return e
        });
        return images
    }
}