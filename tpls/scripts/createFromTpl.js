const fs = require('fs');
const path = require('path');
const template = require('art-template');

const [, , table] = process.argv
const Table = toUpperCaseFirst(table)

const config = {
  template: {
    model:path.join(__dirname, '../model.art'),
    api: path.join(__dirname, '../api.art'),
  },
  target: path.join(__dirname, `../../src/routes/${table}`)
}

const data = {
  table,
  Table
}

try {
  const isTargetDirExists = fs.existsSync(config.target)
  if (isTargetDirExists) {
    console.log(`${config.target}已经存在，请更换table名字或删除后重试！`);
  } else {
    fs.mkdirSync(config.target)
    const modelContent = template(config.template.model, data);
    fs.writeFileSync(`${config.target}/${Table}.js`, modelContent)
    const apiContent = template(config.template.api, data);
    fs.writeFileSync(`${config.target}/index.js`, apiContent)
    
    console.log(`表${table}的Model创建成功`)
    console.log(`表${table}增删改查api创建成功`)
  }
} catch (err) {
  console.log(err);
}

function toUpperCaseFirst(str) { return `${str[0].toUpperCase()}${str.slice(1)}` }
