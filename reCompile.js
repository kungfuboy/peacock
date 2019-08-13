const fs = require('fs')
const handlebars = require('handlebars')

const reCompile = (path, data) => {
  const content = fs.readFileSync(path, 'utf8')
  return {
    path,
    data: handlebars.compile(content)(data)
  }
}
module.exports = reCompile
