#!/usr/bin/env node

const commander = require('commander')
const download = require('download-git-repo')
const inquirer = require('inquirer')
const ora = require('ora')
const logSymbols = require('log-symbols')
const reCompile = require('./reCompile')
const fs = require('fs')
const shell = require('shelljs')
const chalk = require('chalk')

// 安装依赖包的工具
const install = require('./install')
const askList = require('./askList')

const templates = require('./template')

commander.version('1.0.0')
commander
  .command('init <template> <project>')
  .description('初始化项目模板')
  .action(async (templateName, projectName) => {
    const spinner = ora('正在下载模板...').start()
    // 下载对应的模板到本地
    const { downloadUrl } = templates[templateName]
    // const isSSR = templateName === 'ssr'
    download(downloadUrl, projectName, { clone: true }, err => {
      if (err) {
        spinner.fail()
        console.log(logSymbols.error, '下载模板失败')
        return
      }
      // 下载成功
      spinner.succeed()
      inquirer.prompt(askList({ projectName })).then(answers => {
        // 将用户输入的数据替换到模板中
        const fileList = ['/package.json', '/README.md']
        const pathList = fileList.map(file => `${projectName}${file}`)
        // 重写结果
        const resList = pathList.map(path => reCompile(path, answers))
        // 遍历重写
        resList.forEach(({ path, data }) => {
          fs.writeFileSync(path, data)
        })
        // 开始安装依赖
        shell.cd(`${projectName}`)
        install()
          .then(res => {
            console.log(chalk`👌🏻 {bold 初始化完成 !} ✨\n`)
            console.log(
              chalk`\n🌟  {bold Successfully created project} {cyan ${
                answers.name
              }}\n`
            )
            console.log(chalk`⚡️  {bold 进入项目:}`)
            console.log(chalk`\t{cyan cd ${projectName}}\n`)

            console.log(chalk`🔥  {bold 运行开发环境:}`)
            console.log(chalk`\t{cyan yarn dev or npm run dev}\n`)

            console.log(chalk`🥂  {bold 生产构建:}`)
            console.log(chalk`\t{cyan yarn build or npm run build}\n`)
            // if (isSSR) {
            //   console.log(chalk`🍻  {bold 生产部署:}`)
            //   console.log(chalk`\t{cyan yarn start}\n`)
            // }
          })
          .catch(err => {
            console.log(logSymbols.error, err)
          })
      })
    })
  })

commander
  .command('ls')
  .description('查看模板列表')
  .action(() => {
    for (let key in templates) {
      console.log(`⭐️ ${key} - ${templates[key].description}`)
    }
  })

commander.parse(process.argv)
