import { Button, Icon } from "@vizality/components"
import { React, contextMenu } from '@vizality/webpack'
const { open: openModal } = require('@vizality/modal')

import QuickImagesModal from "./modals/MainModal"
import ContextMenu from "./context_menus/ButtonContextMenu"

module.exports = class QuickImagesButton extends React.PureComponent{
    render(){
        return <>
            <Button
                look={Button.Looks.BLANK}
                size={Button.Sizes.ICON}
                className="qi-button"
                onClick={() => openModal(() => <QuickImagesModal prevText={this.props.prevText} />)}
                onContextMenu={e => contextMenu.openContextMenu(e, () => <ContextMenu />)}
            >
                <Icon name='ImagePlaceholder'
                    className="buttonWrapper-1ZmCpA"
                />
            </Button>
        </>
    }
}