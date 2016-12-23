/* eslint import/no-extraneous-dependencies: off */
/* global someFunction ls:true, exec: true */
require('shelljs/global');
const difference = require('lodash/difference');
const packager = require('electron-packager');
const packageInfo = require('./package.json');

const requireFiles = [
  'public',
  'index.html',
  'main.js',
  'node_modules',
  'package.json',
];

const installedNodeModules = ls('node_modules').map(e => e);
const productionInfo = JSON.parse(
  exec('npm list --production --depth=1000 --json', { silent: true }).stdout
);

function extractDependencies(info) {
  if (!info.dependencies) { return []; }
  return Object.keys(info.dependencies).reduce((pkgs, name) => {
    const childDeps = extractDependencies(info.dependencies[name]);
    return pkgs.concat(name, childDeps);
  }, []);
}

const productionDependencies = extractDependencies(productionInfo);
const devDependencies = difference(installedNodeModules, productionDependencies);

const ignoreFiles = difference(ls('./').map(e => e), requireFiles)
  .concat(devDependencies.map(name => `/node_modules/${name}(/|$)`));

packager({
  name: packageInfo.productName,
  ignore: ignoreFiles,
  dir: './',
  out: './build/Release',
  icon: './source/icon.ico',
  platform: process.argv[2],
  arch: 'ia32,x64',
  version: packageInfo.devDependencies['electron-prebuilt'],
  overwrite: true,
  asar: true,
  prune: true,
  'app-version': packageInfo.version,
  'app-copyright': `Copyright (C) 2016 ${packageInfo.author}.`,
  'build-version': packageInfo.version,
  'version-string': {
    CompanyName: '@gin0606',
    FileDescription: packageInfo.productName,
    OriginalFilename: `${packageInfo.productName}.exe`,
    ProductName: packageInfo.productName,
    InternalName: packageInfo.productName,
  },
}, (err, appPaths) => {
  if (err) console.log(err);
  console.log(`Done: ${appPaths}`);
});
