import { React } from "@vizality/react"
import { Button, Icon } from "@vizality/components"

module.exports = class Settings extends React.PureComponent{
    render(){
        return <>
            <Button
                look={Button.Looks.BLANK}
                size={Button.Sizes.ICON}
            >
                <Icon name='ImagePlaceholder' />
            </Button>
        </>
    }
}