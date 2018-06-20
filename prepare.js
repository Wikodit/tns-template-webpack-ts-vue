const fs = require('fs-extra');
const { resolve } = require('path');
const { execSync } = require('child_process');
const winston = require('winston-color');

const distPath = resolve(__dirname, './dist')

const appDistPath = resolve(distPath, 'app');
const resourcesDistPath = resolve(appDistPath, 'App_Resources');
const resourcesPath = resolve(__dirname, './resources');

const pkg = require(resolve(__dirname, 'package.json'));

function copyNativeScriptPlugins() {
  winston.info('Copying NativeScript plugins to template dependencies...')
    ;
  pkg.dependencies = {
    ...Object.keys(pkg.dependencies)
      .filter(key => key.indexOf('nativescript-') !== -1)
      .reduce((obj, key) => {
        obj[key] = pkg.dependencies[key];
        return obj;
      }, {}),
    ...pkg.nativescriptDependencies,
  }

  const buildConfig = (pkg.nativescript || {}).build

  pkg.nativescript && delete pkg.nativescript.build;
  delete pkg.scripts;
  delete pkg.devDependencies;
  delete pkg.nativescriptDependencies;

  fs.writeFileSync(resolve(distPath, 'package.json'), JSON.stringify(pkg, null, 2));

  fs.ensureDirSync(appDistPath);
  fs.writeFileSync(resolve(appDistPath, 'package.json'), JSON.stringify({
    ...buildConfig
  }, null, 2));
}

function updateDistFromTemplate() {
  winston.info('Preparing NativeScript application from template...');
  fs.ensureDirSync(resourcesDistPath);
  fs.copySync(resourcesPath, resourcesDistPath, { overwrite: false });
  execSync('npm i --production', { cwd: distPath });
}

module.exports = () => {
  fs.ensureDirSync(distPath);
  copyNativeScriptPlugins();
  updateDistFromTemplate();
};
