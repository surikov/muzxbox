type CommandInfo = {
    sid: string;
    simpleAction: () => void;
};
function createCommandsList(): CommandInfo[] {
    let commandList: CommandInfo[] = [];
    commandList.push({
        sid: 'setThemeSizeSmall', simpleAction: () => {
            console.log();
        }
    });
    return commandList;
};