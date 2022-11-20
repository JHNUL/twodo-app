import { $, chalk, cd, within } from 'zx';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';

const packageFilePath = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'package.json'
);
const uiPackagePath = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'twodo-ui',
  'package.json'
);

const projectLocationError = `
Building the project requires twodo-ui repository
to be located at the same level as twodo-server:
parent
  ├── twodo-server
  └── twodo-ui
`;

if (!existsSync(uiPackagePath)) {
  console.log(chalk.redBright(`${uiPackagePath} not found!`));
  console.log(chalk.yellowBright(projectLocationError));
  process.exit(1);
}

const packageJson = JSON.parse(readFileSync(packageFilePath));

await within(async () => {
  cd('../twodo-ui');
  await $`yarn install --frozen-lockfile`;
  await $`yarn build`.quiet();
  console.log(chalk.greenBright('--- UI build successful'));
});

await $`yarn install --frozen-lockfile`;
await $`yarn build`;
console.log(chalk.greenBright('--- Server build successful'));

await $`rm -rf ./html`;
await $`mkdir ./html`;
await $`cp -r ../twodo-ui/build/* ./html`;
await $`docker build -t twodo-server:${packageJson.version} .`;
console.log(chalk.greenBright('--- Container image build successful'));
