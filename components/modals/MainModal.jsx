import fs from "fs"
import path from "path"
import { React, getModule, getModuleByDisplayName } from "@vizality/webpack"
const { openContextMenu } = require("@vizality/webpack").contextMenu
import { Modal, Icon, Button } from "@vizality/components"
const { close: closeModal } = require('@vizality/modal')

import ContextMenu from "../context menus/FileContextMenu"
const { getChannelId } = getModule('getChannelId', 'getVoiceChannelId')
const TextInput = getModuleByDisplayName("TextInput")
const FormTitle = getModuleByDisplayName('FormTitle')

const folderPath = vizality.api.settings._fluxProps(this.addonId).getSetting("folderPath")

module.exports = class QuickImagesModal extends React.PureComponent {
    constructor(props){
        super(props)

        this.allImages = this.outputFiles(folderPath) //Declarates images and get all imgaes in the folder path
        this.startNum = 0; //Declarates startNum
        this.endNum = 10; //Declarates endNum
        this.currentImages = [];

        this.message = {
            content: ""
        };
    }
    render() {
        return <>
            <Modal size={Modal.Sizes.LARGE} className="qi-modal-main">
                <Modal.Header>
                    <div className="qi-navigation-bar">
                        <Button
                            look={Button.Looks.BLANK}
                            size={Button.Sizes.ICON}
                            disabled={this.startNum <= 0}
                            className="qi-button"
                            onClick={(e) => {
                                e.stopPropagation(); this.prevSetOfImages(); this.openImages()
                            }}
                        >
                            <Icon name='ArrowBack' />
                        </Button>
                        <FormTitle tag={FormTitle.Tags.H3}>Select your image</FormTitle>
                        <div className="qi-space" />
                        <Button
                            look={Button.Looks.BLANK}
                            size={Button.Sizes.ICON}
                            disabled={this.endNum > this.allImages.length}
                            className="qi-button"
                            onClick={(e) => {
                                e.stopPropagation(); this.nextSetOfImages(); this.openImages()
                            }}
                        >
                            <Icon name='ArrowRight' />
                        </Button>
                    </div>
                </Modal.Header>
                <Modal.Content>
                    <div className="qi-grid">
                        {
                            this.openImages()
                        }
                    </div>
                    <TextInput
                        autoFocus
                        className="qi-message-textbox"
                        placeholder="Here goes the message that you wanna send"
                        onChange={(value) => {
                            this.message.content = value
                        }}
                    />
                </Modal.Content>
                <Modal.Footer>
                    <div className="qi-space" />
                    <Button
                        look={Button.Looks.LINK}
                        size={Button.Sizes.SMALL}
                        color={Button.Colors.WHITE}
                        onClick={(e) => {
                            closeModal()
                        }}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    }

    openImages(){
        this.clearSetOfImages();
        return this.renderFiles(this.configureFileSet())
    }

    outputFiles = function (dirname) {
        let filenames = fs.readdirSync(dirname) // Get all itens in the folder

        let images = filenames.filter(function (file) { // Filters for a video or file
            let extname = path.extname(file).toLowerCase() // Get the file extension
            if (extname === '.png' || extname === '.jpg' || extname === '.jpeg' || extname === '.gif' || extname === '.mp4') return file // Excludes everything except images and videos. Also sorry for this mess
        });

        return images
    }

    configureFileSet(){
        for (var i = 0; i < this.allImages.length; i++) {
            if (i > this.startNum -1 && i < this.endNum) { // if i is behind this.startNum and this.startNum 
                this.currentImages.push(this.allImages[i])
            }
        }

        console.log(this.currentImages)

        return this.currentImages
    }
    
    renderFiles(imageArray){
        return imageArray.map((img) => {
            let actualFile = folderPath + "/" + img
            return <>
                <div className="qi-item"
                    onContextMenu={e => openContextMenu(e, () => <ContextMenu
                        file={actualFile}
                        folder={folderPath}
                        fileName={img}
                    />
                    )}>
                    <figure className="qi-image-item"
                        onClick={(e) => {
                            e.stopPropagation();
                            this.uploadImage(fs.readFileSync(actualFile), img, this.message)
                            closeModal()
                        }}>
                        {
                            path.extname(actualFile).toLowerCase() == ".mp4"
                            ?
                                <video src={"data:video/mp4;base64, " + fs.readFileSync(actualFile, { encoding: "base64" })}
                                    autoplay="autoplay"
                                    muted
                                    loop
                                    className="qi-image-img"
                                />
                            :
                            <img src={"data:image/png;base64, " + fs.readFileSync(actualFile, { encoding: "base64" })}
                                className="qi-image-img"
                            />
                        }
                    </figure>
                    <span className="qi-item-name markup-2BOw-j">{path.basename(actualFile)}</span>
                </div>
            </>
        })
    }

    nextSetOfImages(){
        if (this.endNum > this.allImages.length) return
        this.clearSetOfImages()
        this.startNum = this.startNum + 10
        this.endNum = this.endNum + 10
        this.forceUpdate()
    }

    prevSetOfImages() {
        if (this.startNum <= 0) return
        this.clearSetOfImages()
        this.startNum = this.startNum - 10
        this.endNum = this.endNum - 10
        this.forceUpdate()
    }

    clearSetOfImages() { this.currentImages = []; }

    async uploadImage(fileContents, fileName, messsage){
        const { upload } = await getModule('cancel', 'upload')

        let fileprop = new File([fileContents], fileName); // Transforms the Buffer from fileContents to a File component
        console.log(fileprop)
        
        upload(getChannelId(), fileprop, messsage) // Uploads
    }
}