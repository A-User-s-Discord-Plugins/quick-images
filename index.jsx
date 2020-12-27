import { Plugin } from '@vizality/entities'
import { getModule, React } from '@vizality/webpack'
import { patch, unpatch } from '@vizality/patcher'
const { react: { findInReactTree } } = require('@vizality/util');

import Settings from "./components/settings/Settings"

const ChannelTextAreaContainer = getModule(
    (m) =>
        m.type &&
        m.type.render &&
        m.type.render.displayName === "ChannelTextAreaContainer",
    false
);

const SettingsButton = require("./components/button");

module.exports = class QuickImages extends Plugin{
    onStart(){
        this.patchImageButton()
        this.injectStyles('./styles/index.css');
        vizality.api.settings.registerAddonSettings({
            id: this.addonId,
            heading: 'Quick Images',
            render: Settings
        })
    }

    onStop(){
        unpatch("quick-images-button")
    }

    patchImageButton(){
        patch("quick-images-button", ChannelTextAreaContainer.type, "render", (args, res) => {
            // Add to the buttons.
            const props = findInReactTree(
                res,
                (r) =>
                    r && r.className && r.className.indexOf("buttons-") == 0
            );
            props.children.unshift(
                <><SettingsButton /></>
            );

            return res;
        }
        );
    }
}