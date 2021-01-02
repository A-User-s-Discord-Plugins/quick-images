import { React } from "@vizality/react"
import { SwitchItem, ButtonItem } from "@vizality/components/settings"
import TextInputWithButton from "./TextInputWithButton"

const { updateSetting, getSetting, toggleSetting } = vizality.api.settings._fluxProps(this.addonId)

module.exports = class Settings extends React.PureComponent {
    constructor(props){
        super(props)

        this.shouldRestart = false
    }
    render() {
        return <>
            {this.shouldRestart ? 
                <ButtonItem
                    note="Please restart to take effect your changes"
                    button="Restart"
                    onClick={() => {}}
                >
                    "Please Restart"
                </ButtonItem>
            :
                <></>
            }
            <TextInputWithButton
                defaultValue={getSetting('folderPath')}
                onChange={(value) => {
                    updateSetting('folderPath', value)
                    this.shouldRestart = true
                }}
                buttonOnClick={() => DiscordNative.fileManager.showOpenDialog({ properties: ['openDirectory'] }).then(result => updateSetting('folderPath', result[0]))}
                title="QuickFolder"
                buttonText={"Select Folder"}
                buttonIcon="Folder"
            />
            <SwitchItem
                children="Add contexts menus to Videos"
                note="Add a context menu that adds more functionality to Videos, like opening in external browser, downloading directly in your QuickFolder..."
                value={getSetting('contextMenuVideo', true)}
                onChange={() => {
                    toggleSetting('contextMenuVideo')
                    this.shouldRestart = true
                }}
            />
        </>
    }
}