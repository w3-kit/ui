#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { copyComponent } from "./utils.js";

const program = new Command();

program.name("w3-kit").description("CLI to add Web3 components to your project").version("0.1.0");

program
  .command("add <component>")
  .description("Add a Web3 component to your project")
  .action(async (component) => {
    const components = [
      "address-book",
      "asset-portfolio",
      "bridge",
      "connect-wallet",
      "contract-interaction",
      "defi-position-manager",
      "ens-resolver",
      "flash-loan-executor",
      "gas-calculator",
      "limit-order-manager",
      "liquidity-pool-stats",
      "multisig-wallet",
      "network-switcher",
      "nft-card",
      "nft-collection-grid",
      "nft-marketplace-aggregator",
      "price-ticker",
      "smart-contract-scanner",
      "staking-interface",
      "subscription-payments",
      "token-airdrop",
      "token-card",
      "token-list",
      "token-swap",
      "token-vesting",
      "transaction-history",
      "wallet-balance",
    ];

    if (!components.includes(component)) {
      console.error(
        chalk.red(`Error: ${component} is not a valid component.\n`) +
          chalk.yellow(`Available components:\n${components.join("\n")}`),
      );
      process.exit(1);
    }

    try {
      await copyComponent(component);
      console.log(
        chalk.green(`✓ Successfully added ${component} component!\n`) +
          chalk.blue(`Import it like this:\n`) +
          chalk.white(`import { ${component} } from '@/components/ui/${component}';`),
      );
    } catch (error: any) {
      console.error(chalk.red(`Error: ${error?.message || "Unknown error occurred"}`));
      process.exit(1);
    }
  });

program.parse(process.argv);
