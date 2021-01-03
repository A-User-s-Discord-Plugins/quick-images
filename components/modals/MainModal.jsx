import fs from "fs"
import path from "path"
import { React, getModule, getModuleByDisplayName, contextMenu } from "@vizality/webpack"
import { file } from '@vizality/util'
import { Modal, Icon, Button, SearchBar, Anchor } from "@vizality/components"
const { close: closeModal } = require('@vizality/modal')

import ContextMenu from "../context_menus/FileContextMenu"
const { getChannelId } = getModule('getChannelId', 'getVoiceChannelId')
const TextInput = getModuleByDisplayName("TextInput")
const FormTitle = getModuleByDisplayName('FormTitle')

import PathManager from "../../modules/PathManager"

const folderPath = PathManager.getQuickFolderPath()

module.exports = class QuickImagesModal extends React.PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            allFiles: [],
            epicRendering: <></>
        }

        this.images = {
            selected: null
        }

        this.set = {
            start: 0, //Declarates start
            end: 10, //Declarates end
            current: []
        }

        this.search = ""

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
                            //disabled={PathManager.quickFolderExists ? this.set.start <= 0 : true}
                            className="qi-button"
                            onClick={(e) => {
                                e.stopPropagation(); this.prevSetOfImages(); this.openImages()
                            }}
                        >
                            <Icon name='ArrowBack' />
                        </Button>

                        <FormTitle tag={FormTitle.Tags.H3}>Choose File(s)</FormTitle>
                        <div className="qi-space" />

                        <SearchBar
                            className="qi-search-bar"
                            placeholder="Search"
                            query={this.search}
                            onChange={(val) => {
                                this.search = val
                                this.forceUpdate()
                                // this.openImages()
                            }}
                        />

                        <Button
                            look={Button.Looks.BLANK}
                            size={Button.Sizes.ICON}
                            //disabled={PathManager.quickFolderExists ? this.set.end > this.images.all.length : true}
                            className="qi-button"
                            onClick={(e) => {
                                e.stopPropagation(); this.nextSetOfImages(); //this.openImages()
                            }}
                        >
                            <Icon name='ArrowRight' />
                        </Button>
                    </div>
                </Modal.Header>
                <Modal.Content>
                    {
                        this.state.epicRendering
                    }
                </Modal.Content>
                <Modal.Footer>
                    <Button
                        look={Button.Looks.FILLED}
                        size={Button.Sizes.MEDIUM}
                        color={Button.Colors.BRAND}
                        disabled={this.images.selected === null}
                        onClick={(e) => {
                            this.uploadImage(fs.readFileSync(folderPath + "/" + path.basename(this.images.selected.path)), path.basename(this.images.selected.path), this.message)
                            closeModal()
                        }}
                    >
                        Upload
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

    async componentDidMount(){
        let post;
        if (PathManager.quickFolderExists) {
            this.setState({ //react is wild with async/await functions
                allFiles: await file.getObjectURL(folderPath, ['.png', '.jpg', '.jpeg', '.gif', '.mp4', '.mov'])
            })
            this.clearSetOfImages();
            let set = this.configureFileSet();
            if (Array.isArray(set) && set.length) {
                post = <><div className="qi-grid">
                    {this.renderFiles(set)}
                </div>
                    <TextInput
                        className="qi-message-textbox"
                        value={this.props.prevText}
                        placeholder="Message"
                        onChange={(value) => {
                            this.message.content = value
                        }}
                    />
                </>
            }
            else {
                post = this.errorInProcess("Looks like that your QuickFolder is empty. Start adding images and videos!")
            }
        } else {
            post = this.errorInProcess(<><span>Looks like that you didn't set a QuickFolder. </span> <Anchor type='plugin' addonId='quick-images'>Setup one right now.</Anchor></>)
        }
        const epicRendering = post
        this.setState({ epicRendering })
    }

    outputFiles = function (dirname) {
        let filenames = fs.readdirSync(dirname) // Get all itens in the folder

        let images = filenames.filter(function (file) { // Filters for a video or file
            let extname = path.extname(file).toLowerCase() // Get the file extension
            if (extname === '.png' || extname === '.jpg' || extname === '.jpeg' || extname === '.gif' || extname === '.mp4' || extname === '.mov') return file // Excludes everything except images and videos. Also sorry for this mess
        });

        return images
    }

    configureFileSet() {
        for (var i = 0; i < this.state.allFiles.length; i++) {
            let currentFile = this.state.allFiles[i]
            if (i > this.set.start - 1 && i < this.set.end) { // if i is behind this.start and this.start 
                if (currentFile.name.toUpperCase().indexOf(this.search.toUpperCase()) > -1) {
                    this.set.current.push(currentFile)
                }

            }
        }
        return this.set.current
    }

    renderFiles(imageArray) {
        console.log(imageArray)
        return imageArray.map((file) => {
            let filePath = file.path
            let filename = path.basename(filePath)
            let fileext = path.extname(filename)
            console.log(file)
            return <>
                <div className="qi-item"
                    onContextMenu={e => contextMenu.openContextMenu(e, () => <ContextMenu
                        file={filePath}
                        fileContents={file.url}
                        folder={folderPath}
                        fileName={filename}
                    />
                    )}>
                    <figure className="qi-image-item"
                        onClick={(e) => {
                            e.stopPropagation();
                            this.selectImage(file)
                            this.forceUpdate()
                        }}>
                        {
                            fileext.toLowerCase() == ".mp4" || fileext.toLowerCase() == ".mov"
                                ?
                                <video src={file.url}
                                    autoplay="autoplay"
                                    muted
                                    loop
                                    className="qi-image-img"
                                />
                                :
                                <img src={file.url}
                                    className="qi-image-img"
                                />
                        }
                        {
                            this.images.selected == file ?
                                <div className="qi-image-item-select-indicator"><Icon name='CheckmarkCircle' /></div>
                                :
                                <></>
                        }
                    </figure>
                    <span className="qi-item-name markup-2BOw-j">{path.basename(filePath)}</span>
                </div>
            </>
        })
    }

    nextSetOfImages() {
        if (this.set.end > this.state.allFiles.length) return
        this.clearSetOfImages()
        this.set.start = this.set.start + 10
        this.set.end = this.set.end + 10
        this.forceUpdate()
    }

    prevSetOfImages() {
        if (this.set.start <= 0) return
        this.clearSetOfImages()
        this.set.start = this.set.start - 10
        this.set.end = this.set.end - 10
        this.forceUpdate()
    }

    clearSetOfImages() {
        this.set.current = [];
    }

    selectImage(image) {
        this.images.selected = image
    }

    async uploadImage(fileContents, fileName, messsage) {
        const { upload } = await getModule('cancel', 'upload')

        let fileprop = new File([fileContents], fileName); // Transforms the Buffer from fileContents to a File component
        console.log(fileprop)

        upload(getChannelId(), fileprop, messsage) // Uploads
    }

    errorInProcess(text) {
        return <><div className="qi-unexpected-act">
            <div className="image-1GzsFd marginBottom40-2vIwTv qi-unexpected-act-quickfolder" />
            <div className="text-GwUZgS marginTop8-1DLZ1n">{text}</div>
        </div></>
    }
}