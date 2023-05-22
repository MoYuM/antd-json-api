const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const marked = require('marked')

const ANTD_GIT_URL = 'https://github.com/ant-design/ant-design.git';

// 克隆仓库
exec(`git clone ${ANTD_GIT_URL}`, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('仓库克隆成功！');
});

  // 读取组件文件夹下的文档
  fs.readdir('./ant-design/components', { withFileTypes: true }, (err, files) => {
    if (err)  {
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

          // 解析 Markdown
          console.log(file.name);
          console.log(marked.Lexer(data.replace(/---[\s\S]*---/, '')));
        });
      }
    });
  });