//@ts-check
import { Command } from 'commander';
import pk from './package.json';
import chalk from 'chalk';
import runCreate from './tasks/create';
// imp
export async function cli(args) {
  //
  const program = new Command();
  program.version(pk.version);

  program
    .command('create [type]')
    .description('Create a new ')
    // .option('-c, --only-create', 'Create projet and omit install dependencies')
    .action(async (args, options) => {
      // console.log(args, options);
      await runCreate(args);

      // await createProject(options);
    });
  // program
  //   .command('fixed')
  //   .description('Fixed a file')
  //   // .option('-c, --only-create', 'Create projet and omit install dependencies')
  //   .action(async (args, options) => {
  //     // console.log(args, options);
  //     const line =
  //       '(referencesConstraintComment ? `${tableName}_fk_${columnName}`';
  //     const newLine =
  //       '(referencesConstraintComment ? `${typeof tableName==="string"?tableName:tableName.name}_fk_${columnName}`';
  //     // fstat.rea

  //     await runCreate(args);

  //     // await createProject(options);
  //   });

  program.on('--help', () => {
    console.log();
    console.log(
      `  Run ${chalk.cyan(
        `mg <command> --help`,
      )} for detailed usage of given command.`,
    );
    console.log();
  });

  program.parse(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
}
