import { React } from "@vizality/react"
import { Button, Icon } from "@vizality/components"

module.exports = class Settings extends React.PureComponent{
    render(){
        return <>
            <Button
                look={Button.Looks.BLANK}
                size={Button.Sizes.ICON}
                className="qi-window-button"
            >
                <Icon name='ImagePlaceholder'
                    className="buttonWrapper-1ZmCpA"
                />
            </Button>
        </>
    }
}