import { React, getModule, getModuleByDisplayName } from "@vizality/webpack"
import { Modal } from "@vizality/components"
const { close: closeModal } = require('@vizality/modal')

const fs = require("fs")
const path = require("path")

const { getChannelId } = getModule('getChannelId', 'getVoiceChannelId')

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
                    {
                        this.openImageList()
                    }
                </Modal.Content>
            </Modal>
        </>
    }

    openImageList(){
        let images = this.outputImages("D:vizality/addons/plugins/quick-images/images")
        console.log(images)
        return images.map((img) => {
            let actualImage = "D:vizality/addons/plugins/quick-images/images/" + img
            return <img src={"data:image/png;base64, " + fs.readFileSync(actualImage, { encoding: "base64" })}
            onClick={(e) => {
                e.stopPropagation();
                this.uploadImage(fs.readFileSync(actualImage), img)
            }} />
        })
    }

    async uploadImage(fileContents, fileName){
        const { upload } = await getModule('cancel', 'upload')
        
        // let arraybuffer = Uint8Array.from(fileContents).buffer
        // console.log(arraybuffer)
        let fileprop = new File([fileContents], fileName);
        console.log(fileprop)
        upload(getChannelId(), fileprop, "")
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