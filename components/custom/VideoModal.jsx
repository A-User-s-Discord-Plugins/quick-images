import { React, getModuleByDisplayName } from "@vizality/webpack"
import { file } from '@vizality/util'

const LazyVideo = getModuleByDisplayName("LazyVideo")

module.exports = class PreviewVideo extends React.PureComponent {
    constructor(props) {
        super(props)

        // this.state = {
        //     imageDimensions: {}
        // }
    }

    render() {
        return <>
            <div class="wrapper-2K4Z3k">
                <div class="imageWrapper-2p5ogY image-1tIMwV" style="width: 275px; height: 155px;">
                    <LazyVideo
                        className="embedWrapper-lXpS3L"
                        fileName="tomar_awa.mp4"
                        fileSize={137717}
                        height={360}
                        naturalHeight={360}
                        naturalWidth={360}
                        width={360}
                        playable={true}
                        poster="https://media.discordapp.net/attachments/539180316447997974/797285486615592990/cocacola.mp4?format=jpeg"
                        src="https://cdn.discordapp.com/attachments/539180316447997974/797285486615592990/cocacola.mp4"
                    />
                </div>
            </div>
        </>
    }
}