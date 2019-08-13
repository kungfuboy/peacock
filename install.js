const execSync = require('child_process').execSync
const spawn = require('cross-spawn')
const chalk = require('chalk')

const _shouldUseYarn = () => {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
}

const install = () => {
  console.log(chalk.white.bold('开始安装依赖包...'))
  return new Promise((resolve, reject) => {
    let command = _shouldUseYarn() ? 'yarn' : 'npm'
    let args = ['install']
    const child = spawn(command, args, { stdio: 'inherit' })
    child.on('close', code => {
      if (code) {
        reject({
          command: `${command} ${args.join(' ')}`
        })
        return
      }
      resolve()
    })
  })
}

module.exports = install
