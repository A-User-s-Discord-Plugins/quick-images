import { React, getModule, getModuleByDisplayName } from "@vizality/webpack"
import { file } from '@vizality/util'

const { renderVideoComponent } = getModule('renderVideoComponent')
const LazyVideo = getModuleByDisplayName("LazyVideo")

module.exports = class PreviewVideo extends React.PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            videoInformations: {}
        }
    }

    render() {
        const file = this.props.file
        this.getVideoInfo(file.url).then(vidinfo => {
            this.setState({ videoInformations: vidinfo })
        })
        return <>
            <div class="wrapper-2K4Z3k">
                <div class="imageWrapper-2p5ogY image-1tIMwV">
                    {
                        renderVideoComponent({
                            className: "embedWrapper-lXpS3L",
                            fileName: file.name,
                            fileSize: 0,
                            naturalHeight: this.state.videoInformations.height,
                            naturalWidth: this.state.videoInformations.width,
                            poster: "https://media.discordapp.net/attachments/539180316447997974/797882219833982986/f.mp4?format=jpeg",
                            src: file.url,
                            // width: this.state.videoInformations.width
                        })
                    }
                    {/* <LazyVideo
                        autoPlay={true}
                        className="embedWrapper-lXpS3L"
                        fileName={file.name}
                        fileSize={0}
                        height={this.state.videoInformations.height}
                        naturalHeight={this.state.videoInformations.height}
                        width={this.state.videoInformations.width}
                        naturalWidth={this.state.videoInformations.width}
                        poster="https://media.discordapp.net/attachments/539180316447997974/797882219833982986/f.mp4?format=jpeg"
                        playable={true}
                        src={file.url}
                    /> */}
                </div>
            </div>
        </>
    }

    getVideoInfo(url) {
        return new Promise((resolve) => {
            // create the video element
            let video = document.createElement('video');
            video.src = url;

            // place a listener on it
            video.addEventListener("loadedmetadata", function () {
                // retrieve dimensions
                let height = this.videoHeight;
                let width = this.videoWidth;
                // send back result
                resolve({
                    duration: video.duration,
                    height: height,
                    width: width
                });
            }, false);
        });
    }
}