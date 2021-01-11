import fs from "fs"
import { React } from '@vizality/webpack'
import { file } from '@vizality/util'
import PathManager from '../modules/PathManager'
const { open: openModal } = require('@vizality/modal')

import { Anchor, ImageModal } from "@vizality/components"
import VideoModal from "../components/custom/VideoModal"

export default {
    command: 'list',
    description: 'List all images.',
    executor: async() => {
        let fileList = await file.getObjectURL(PathManager.getQuickFolderPath(), ['.png', '.jpg', '.jpeg', '.gif', '.mp4', '.mov'])
        return {
            send: false,
            result: {
                type: 'rich',
                provider: {
                    name: "File list"
                },
                color: parseInt("ffffff", 16),
                footer: {
                    text: <List files={fileList}/>
                }
            }
        };
    }
};

const List = React.memo(({files}) => {
    return <div className="qi-vertical-list">
        {files.map((currentFile) => {
            return <>
                <div className="qi-file-column">
                    <div className="qi-name">{currentFile.name}</div>
                    <Anchor onClick={ async () => {
                        let fileType = PathManager.checkFileType(currentFile.path, true)
                        if (fileType === "Image") {
                            let imgDimensions = await file.getImageDimensions(currentFile.url)
                            openModal(() => <ImageModal
                                className="image-1tIMwV"
                                src={currentFile.url}
                                width={imgDimensions.width}
                                height={imgDimensions.height}
                            />)
                        } else {
                            let stats = fs.statSync(files.path)
                            openModal(() => <VideoModal file={currentFile} fileSize={stats.size} />)
                        }
                    }}>
                        Preview
                    </Anchor>
                </div>
            </>
        })}
    </div>
})