import { Command } from 'commander';
import { setJsonMode } from './output.js';
import { registerBaseCommand } from './commands/base.js';
import { registerAgentCommands } from './commands/agents.js';
import { registerControlCommands } from './commands/control.js';
import { registerBuildCommand } from './commands/build.js';

const program = new Command();

program
  .name('open-computer')
  .description('Cross-platform CLI for open-computer VM management')
  .version('0.1.0')
  .option('--json', 'Output machine-readable JSON')
  // Parse --json early so subcommands can read it
  .hook('preAction', (thisCommand) => {
    setJsonMode(thisCommand.opts().json === true);
  });

registerBaseCommand(program);
registerAgentCommands(program);
registerControlCommands(program);
registerBuildCommand(program);

program.parse(process.argv);
