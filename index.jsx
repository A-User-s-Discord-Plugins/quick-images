const { Plugin } = require('@vizality/entities')
const { getModule } = require('@vizality/webpack')
const { React } = require("@vizality/react")
const { react: { findInReactTree } } = require('@vizality/util');
const { patch, unpatch } = require('@vizality/patcher');

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
        patch("quick-images-button", ChannelTextAreaContainer.type, "render", (args, res) => {
                // Add to the buttons.
                const props = findInReactTree(
                    res,
                    (r) =>
                        r && r.className && r.className.indexOf("buttons-") == 0
                );
                props.children.unshift(
                    React.createElement(SettingsButton)
                );

                return res;
            }
        );
    }
    onStop(){
        unpatch("quick-images-button")
    }
}