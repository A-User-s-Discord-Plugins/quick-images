import { React, getModule, getModuleByDisplayName } from "@vizality/webpack"
import { Modal } from "@vizality/components"
const { close: closeModal } = require('@vizality/modal')

const fs = require("fs")
const path = require("path")

const { getChannelId } = getModule('getChannelId', 'getVoiceChannelId')

const FormTitle = getModuleByDisplayName('FormTitle', false)

const folderPath = vizality.api.settings._fluxProps(this.addonId).getSetting("folderPath")


module.exports = class QuickImagesModal extends React.PureComponent {
    constructor(props){
        super(props)

        this.images = this.outputImages(folderPath) //Declarates images and get all imgaes in the folder path
        this.rest; //Declarates res
        this.listQueue; //Declarates listQueue
    }
    render() {
        return <>
            <Modal size={Modal.Sizes.LARGE} className="qi-custom-size">
                <Modal.Header>
                    <FormTitle tag={FormTitle.Tags.H3}>Your images</FormTitle>
                    <Modal.CloseButton onClick={closeModal} />
                </Modal.Header>
                <Modal.Content>
                    <div className="qi-grid">
                        {
                            this.openImages()
                        }
                    </div>
                    <span onClick={() => {this.configImageQueue()}}> load more </span>
                </Modal.Content>
            </Modal>
        </>
    }

    openImages(){
        return this.renderImages(this.configImageQueue())
    }

    configImageQueue(){
        console.log(folderPath) // Logs the folder path
        console.log(this.images) // Logs all images
        console.log(this.rest)
        
        if (this.rest == null) {
            console.log(this.images);
            this.listQueue = this.images;
            console.log("rest is undefined, setting listQueue to images")
        } else {
            console.log(this.rest);
            this.listQueue = this.rest;
            console.log("rest has value, setting listQueue to rest")
        }

        console.log(this.listQueue)

        this.rest = this.listQueue.splice(20, Number.MAX_VALUE)

        console.log(this.rest)
        console.log(this.listQueue)
        return this.listQueue
    }

    renderImages(imageArray){
        return imageArray.map((img) => {
            let actualImage = folderPath + "/" + img
            return <>
                <figure class="qi-image-item">
                    <img src={"data:image/png;base64, " + fs.readFileSync(actualImage, { encoding: "base64" })}
                        className="qi-image-img"
                        onClick={(e) => {
                            e.stopPropagation();
                            this.uploadImage(fs.readFileSync(actualImage), img)
                            closeModal()
                        }}
                    />
                </figure>
            </>
        })
    }

    async uploadImage(fileContents, fileName){
        const { upload } = await getModule('cancel', 'upload')

        let fileprop = new File([fileContents], fileName); // Transforms the Buffer from fileContents to a File component
        console.log(fileprop)
        
        upload(getChannelId(), fileprop, "") // Uploads
    }

    outputImages = function (dirname) {
        let filenames = fs.readdirSync(dirname)
        let images = filenames.filter(function (e) {
            let extname = path.extname(e).toLowerCase()
            if (extname === '.png' || extname === '.jpg') return e
        });
        return images
    }
}