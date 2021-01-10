export default {
    command: 'file',
    description: 'Send a file via commands.',
    usage: '{c} <file name (with or without extensions)>',
    category: 'quickimages',
    executor: async () => {
        return {
            send: false,
            result: `yes`
        };
    }
};
