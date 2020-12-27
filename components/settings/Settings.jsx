import { TextInput, SwitchItem } from "@vizality/components/settings"
import { React } from "@vizality/react"

const { updateSetting, getSetting } = vizality.api.settings._fluxProps(this.addonId)

module.exports = class Settings extends React.PureComponent {
    render() {
        return <>
            <h2>Folder path</h2>
            <TextInput
                autoFocus
                note={`Here you'll put the folder where you wanna get your images. Example: C:/Users/auser/Pictures`}
                defaultValue={getSetting('folderPath')}
                onChange={(value) => {
                    updateSetting('folderPath', value)
                }}
            />
        </>
    }
}