import { React } from "@vizality/react"
import { Button, Icon } from "@vizality/components"
const { open: openModal } = require('@vizality/modal')

import QuickImagesModal from "./modals/QuickImagesModal"



module.exports = class QuickImagesButton extends React.PureComponent{
    render(){
        return <>
            <Button
                look={Button.Looks.BLANK}
                size={Button.Sizes.ICON}
                className="qi-button"
                onClick={(e) => {
                    openModal(() => <QuickImagesModal />)
                }}
            >
                <Icon name='ImagePlaceholder'
                    className="buttonWrapper-1ZmCpA"
                />
            </Button>
        </>
    }
}