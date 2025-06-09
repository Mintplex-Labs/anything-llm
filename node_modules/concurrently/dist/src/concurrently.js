"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.concurrently = void 0;
const assert_1 = __importDefault(require("assert"));
const lodash_1 = __importDefault(require("lodash"));
const os_1 = require("os");
const tree_kill_1 = __importDefault(require("tree-kill"));
const command_1 = require("./command");
const expand_arguments_1 = require("./command-parser/expand-arguments");
const expand_shortcut_1 = require("./command-parser/expand-shortcut");
const expand_wildcard_1 = require("./command-parser/expand-wildcard");
const strip_quotes_1 = require("./command-parser/strip-quotes");
const completion_listener_1 = require("./completion-listener");
const output_writer_1 = require("./output-writer");
const prefix_color_selector_1 = require("./prefix-color-selector");
const spawn_1 = require("./spawn");
const defaults = {
    spawn: spawn_1.spawn,
    kill: tree_kill_1.default,
    raw: false,
    controllers: [],
    cwd: undefined,
};
/**
 * Core concurrently functionality -- spawns the given commands concurrently and
 * returns the commands themselves + the result according to the specified success condition.
 *
 * @see CompletionListener
 */
function concurrently(baseCommands, baseOptions) {
    assert_1.default.ok(Array.isArray(baseCommands), '[concurrently] commands should be an array');
    assert_1.default.notStrictEqual(baseCommands.length, 0, '[concurrently] no commands provided');
    const options = lodash_1.default.defaults(baseOptions, defaults);
    const prefixColorSelector = new prefix_color_selector_1.PrefixColorSelector(options.prefixColors || []);
    const commandParsers = [
        new strip_quotes_1.StripQuotes(),
        new expand_shortcut_1.ExpandShortcut(),
        new expand_wildcard_1.ExpandWildcard(),
    ];
    if (options.additionalArguments) {
        commandParsers.push(new expand_arguments_1.ExpandArguments(options.additionalArguments));
    }
    const hide = (options.hide || []).map(String);
    let commands = (0, lodash_1.default)(baseCommands)
        .map(mapToCommandInfo)
        .flatMap((command) => parseCommand(command, commandParsers))
        .map((command, index) => {
        const hidden = hide.includes(command.name) || hide.includes(String(index));
        return new command_1.Command({
            index,
            prefixColor: prefixColorSelector.getNextColor(),
            ...command,
        }, (0, spawn_1.getSpawnOpts)({
            ipc: command.ipc,
            stdio: hidden ? 'hidden' : command.raw ?? options.raw ? 'raw' : 'normal',
            env: command.env,
            cwd: command.cwd || options.cwd,
        }), options.spawn, options.kill);
    })
        .value();
    const handleResult = options.controllers.reduce(({ commands: prevCommands, onFinishCallbacks }, controller) => {
        const { commands, onFinish } = controller.handle(prevCommands);
        return {
            commands,
            onFinishCallbacks: lodash_1.default.concat(onFinishCallbacks, onFinish ? [onFinish] : []),
        };
    }, { commands, onFinishCallbacks: [] });
    commands = handleResult.commands;
    if (options.logger && options.outputStream) {
        const outputWriter = new output_writer_1.OutputWriter({
            outputStream: options.outputStream,
            group: !!options.group,
            commands,
        });
        options.logger.output.subscribe(({ command, text }) => outputWriter.write(command, text));
    }
    const commandsLeft = commands.slice();
    const maxProcesses = Math.max(1, (typeof options.maxProcesses === 'string' && options.maxProcesses.endsWith('%')
        ? Math.round(((0, os_1.cpus)().length * Number(options.maxProcesses.slice(0, -1))) / 100)
        : Number(options.maxProcesses)) || commandsLeft.length);
    for (let i = 0; i < maxProcesses; i++) {
        maybeRunMore(commandsLeft, options.abortSignal);
    }
    const result = new completion_listener_1.CompletionListener({ successCondition: options.successCondition })
        .listen(commands, options.abortSignal)
        .finally(() => Promise.all(handleResult.onFinishCallbacks.map((onFinish) => onFinish())));
    return {
        result,
        commands,
    };
}
exports.concurrently = concurrently;
function mapToCommandInfo(command) {
    if (typeof command === 'string') {
        return mapToCommandInfo({ command });
    }
    assert_1.default.ok(command.command, '[concurrently] command cannot be empty');
    return {
        command: command.command,
        name: command.name || '',
        env: command.env || {},
        cwd: command.cwd || '',
        ipc: command.ipc,
        ...(command.prefixColor
            ? {
                prefixColor: command.prefixColor,
            }
            : {}),
        ...(command.raw !== undefined
            ? {
                raw: command.raw,
            }
            : {}),
    };
}
function parseCommand(command, parsers) {
    return parsers.reduce((commands, parser) => lodash_1.default.flatMap(commands, (command) => parser.parse(command)), lodash_1.default.castArray(command));
}
function maybeRunMore(commandsLeft, abortSignal) {
    const command = commandsLeft.shift();
    if (!command || abortSignal?.aborted) {
        return;
    }
    command.start();
    command.close.subscribe(() => {
        maybeRunMore(commandsLeft, abortSignal);
    });
}
