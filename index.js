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
    console.log('error', error);
  };

  // 遍历文件夹
  files.forEach((file) => {
    if (file.isDirectory()) {
      const filePath = path.join('./ant-design/components', file.name, 'index.zh-CN.md');

      // 读取文档内容
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          return;
        };

        // TODO 
        // if (file.name !== 'button') return;

        const api = [];

        // 解析 Markdown
        const ast = lexer.lex(data)
        ast.filter(i => i.type === 'table').forEach(i => {
          i.rows.forEach(row => {
            api.push({
              "name": row[0]?.text,
              "desc": row[1]?.text,
              "type": row[2]?.text,
              "default": row[3]?.text || '-'
            })
          })
        })

        obj.componentList.push({
          component: file.name,
          api,
        })

        writeFile(JSON.stringify(obj));
      });
    }
  });
});


function writeFile(string) {
  fs.writeFile(OUT_PUT, string, 'utf-8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('File successfully written!');
    }
  });
}