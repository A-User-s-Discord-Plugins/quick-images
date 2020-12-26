const { React } = require("@vizality/react")
const { Button } = require("@vizality/components")

module.exports = class Settings extends React.PureComponent{
    render(){
        return <>
            <Button
                color={Button.Colors.BRAND}
                look={Button.Looks.FILLED}
                size={Button.Sizes.SMALL}
            > yes </Button>
        </>
    }
}