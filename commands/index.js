//yeah i stolen it from spotify-in-discord, pls check it out in https://github.com/vizality-community/spotify-in-discord
import file from "./file"
import QuickImagesModal from "../components/modals/MainModal"
const { open: openModal } = require('@vizality/modal')

export const commandList = { file };

export function register() {
    vizality.api.commands.registerCommand({
        command: 'quickimages',
        aliases: ["qi"],
        description: 'Do actions quickly with QuickImages',
        usage: '{c} [file]',
        executor: args => {
            const subcommand = commandList[args[0]];
            if (!subcommand) {
                openModal(() => <QuickImagesModal prevText="" />)
            }

            return subcommand.executor(args.slice(1));
        },
        autocomplete: args => {
            if (args[0] !== void 0 && args.length === 1) {
                return {
                    commands: Object.values(commandList).filter(({ command }) => command.includes(args[0].toLowerCase())),
                    header: 'QuickImage subcommands'
                };
            }

            const subcommand = commandList[args[0]];
            if (!subcommand || !subcommand.autocomplete) {
                return false;
            }

            return subcommand.autocomplete(args.slice(1), this.getSettings());
        }
    });
}

export function unregister() {
    for (const subcommand of this.getSettings().getKeys()) {
        this.unregisterCommand(subcommand);
    }
    vizality.api.commands.unregisterCommand('quickimages');
}