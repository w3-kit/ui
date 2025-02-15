#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { copyComponent } from './utils';

const program = new Command();

program
  .name('create-w3-kit')
  .description('CLI to add Web3 components to your project')
  .version('0.1.0');

program
  .command('add <component>')
  .description('Add a Web3 component to your project')
  .action(async (component) => {
    const components = [
      'bridge',
      'connect-wallet',
      'contract-interaction',
      'ens-resolver',
      'gas-calculator',
      'liquidity-pool-stats',
      'multisig-wallet',
      'network-switcher',
      'nft-card',
      'price-ticker',
      'token-list',
      'token-swap'
    ];

    if (!components.includes(component)) {
      console.error(
        chalk.red(`Error: ${component} is not a valid component.\n`) +
        chalk.yellow(`Available components:\n${components.join('\n')}`)
      );
      process.exit(1);
    }

    try {
      await copyComponent(component);
      console.log(
        chalk.green(`✓ Successfully added ${component} component!\n`) +
        chalk.blue(`Import it like this:\n`) +
        chalk.white(`import { ${component} } from '@/components/${component}';`)
      );
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program.parse(); 