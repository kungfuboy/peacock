const dayjs = require('dayjs')

const askList = args => {
  const { projectName } = args
  return [
    {
      type: 'input',
      name: 'name',
      message: '项目名称',
      default: () => projectName
    },
    {
      type: 'input',
      name: 'author',
      message: '请输入项目负责人名称'
    },
    {
      type: 'input',
      name: 'repository',
      message: '请输入Git地址'
    },
    {
      type: 'input',
      name: 'createDate',
      message: '该项目的创建日期',
      default: () => dayjs(Date.now()).format('YYYY-MM-DD hh:mm')
    }
  ]
}

module.exports = askList
