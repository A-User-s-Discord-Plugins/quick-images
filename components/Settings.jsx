import { React } from "@vizality/react"
import { getModule, getModuleByDisplayName } from '@vizality/webpack';
import { Button } from "@vizality/components"
import { SwitchItem, } from "@vizality/components/settings"
import TextInputWithButton from "./TextInputWithButton"
const TransitionGroup = getModuleByDisplayName("TransitionGroup")
const { SlideIn } = getModule("SlideIn")

const { updateSetting, getSetting, toggleSetting } = vizality.api.settings._fluxProps(this.addonId)

module.exports = class Settings extends React.PureComponent {
    constructor(props){
        super(props)
    }
    render() {
        return <>
            <TextInputWithButton
                defaultValue={getSetting('folderPath')}
                onChange={(value) => {
                    updateSetting('folderPath', value)
                    this.reloadPlugin()
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
                    this.reloadPlugin()
                }}
            />
            {/* {this.shouldRestart ? 
                <TransitionGroup>
                    <SlideIn>
                        <div className="qi-restart-notice container-2VW0UT elevationHigh-1PneE4">
                            <div className="flex-1xMQg5 flex-1O1GKY horizontal-1ae9ci horizontal-2EEEnY flex-1O1GKY directionRow-3v3tfG justifyStart-2NDFzi alignCenter-1dQNNs noWrap-3jynv6" style={{ flex: "1 1 auto" }} >
                                <div>Please restart to take effect your changes</div>
                                <div className="qi-space" />
                                <Button
                                    look={Button.Looks.FILLED}
                                    size={Button.Sizes.SMALL}
                                    color={Button.Colors.BRAND}
                                    onClick={(e) => {
                                        vizality.manager.plugins.remount("quick-images")
                                    }}
                                >
                                    Reload
                                </Button>
                            </div>
                        </div>
                    </SlideIn>
                </TransitionGroup>
            :
                <></>
            } */}
        </>
    }
    
    reloadPlugin(){
        vizality.manager.plugins.remount("quick-images")
    }
}