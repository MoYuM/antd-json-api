const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked')

const ANTD_GIT_URL = 'https://github.com/ant-design/ant-design.git';
const OUT_PUT = 'api.json';

const lexer = new marked.Lexer()

// 克隆仓库
// exec(`git clone ${ANTD_GIT_URL}`, (err) => {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log('仓库克隆成功！');

// });
const obj = {
  componentList: []
}


// 读取组件文件夹下的文档
fs.readdir('./ant-design/components', { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log('error', err);
  };

  const promise = []

  // 遍历文件夹
  for (const file of files) {
    if (!file.isDirectory()) continue;

    const filePath = path.join('./ant-design/components', file.name, 'index.zh-CN.md');

    promise.push(new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err)
          return;
        };
        const {api, children} = readFile(data)
        obj.componentList.push({
          component: file.name,
          children,
          api,
        })
        resolve()
      })
    }))
  };

  Promise.allSettled(promise).then(() => {
    writeFile(JSON.stringify(obj))
  }).catch(err => {
    console.log('err ======>', err)
  })
});


function readFile(data) {
  const tokens = lexer.lex(data)
  const children = [];
  const api = [];
  let isAPI = false;

  // console.log('tokens', tokens);
  tokens.forEach(i => {
    if (i.type === 'heading' && (i.text === 'API')) {
      isAPI = true;
      return;
    }

    if (isAPI && i.type === 'heading' && (i.depth === 3)) {
      children.push({
        name: i.text,
        api: []
      })
    }

    if (isAPI && i.type === 'table') {
      const apiList = i.rows.map(row => ({
        "name": row[0]?.text,
        "desc": row[1]?.text,
        "type": row[2]?.text,
        "default": row[3]?.text || '-'
      }))
      if (children.length) {
        children[children.length - 1].api = apiList;
      } else {
        api.push(...apiList);
      }
      return;
    }

    if (isAPI && (i.type === 'heading') && (i.depth === 2) && (i.text !== 'API')) {
      isAPI = false;
      return;
    }
  })
  return {
    api,
    children
  }
}

function writeFile(string) {
  fs.writeFile(OUT_PUT, string, 'utf-8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('File successfully written!');
    }
  });
}
