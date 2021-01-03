import { React, getModuleByDisplayName } from "@vizality/webpack"
import { file } from '@vizality/util'

const ImageModal = getModuleByDisplayName('ImageModal')

module.exports = class PreviewImage extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        return <>
            <ImageModal
                animated={false}
                className="image-1tIMwV"
                isTrusted={true}
                original={this.props.fileContents}
                placeholder={this.props.fileContents}
                shouldAnimate={true}
                src={this.props.fileContents}
                width={600}
                height={600}
            >
            </ImageModal>
        </>
    }

    async getFileAsURLBlob(){
        let files = await file.getObjectURL("C:/Users/auser/Pictures/shitpost")
        let theFile;

        for (var i = 0; i < files.length; i++) {
            let currentFile = files[i]
            if (currentFile === this.props.fileName) {
                theFile = currentFile.url
            }
        }

        console.log(theFile)

        return theFile
    }
}