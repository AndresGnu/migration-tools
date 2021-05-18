import { Command } from 'commander';

export async function cli(args) {
  //
  const program = new Command();
  program.version(pk.version);

  program
    .command('create')
    .description('Create a new flow project')
    .option('-c, --only-create', 'Create projet and omit install dependencies')
    .action(async (options) => {
      await createProject(options);
    });
}
