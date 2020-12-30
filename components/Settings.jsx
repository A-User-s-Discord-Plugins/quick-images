import { React } from "@vizality/react"
import { Icon } from "@vizality/components"
import TextInputWithButton from "./TextInputWithButton"

const { updateSetting, getSetting } = vizality.api.settings._fluxProps(this.addonId)

module.exports = class Settings extends React.PureComponent {
    render() {
        return (<>
            <TextInputWithButton
                defaultValue={getSetting('folderPath')}
                onChange={(value) => updateSetting('folderPath', value)}
                buttonOnClick={() => DiscordNative.fileManager.showOpenDialog({ properties: ['openDirectory'] }).then(result => updateSetting('folderPath', result[0]))}
                title="QuickFolder"
                buttonText={"Select Folder"}
                buttonIcon="Folder"
            ></TextInputWithButton>
        </>)
    }
}