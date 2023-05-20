const { exec } = require('child_process');
const fs = require('fs');

// 克隆仓库
exec('git clone https://github.com/ant-design/ant-design.git', (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('仓库克隆成功！');
  
  // 读取复制的文件路径
  fs.readFile('./ant-design/README.md', 'utf8', (err, data) => {
    if(err) {
      console.log(err);
      return;
    }
    
    // 将文件内容复制到指定目录下
    fs.writeFile('./README.md', data, (err) => {
      if(err) {
        console.log(err);
        return;
      }
      console.log('README.md 文件复制成功！');
    });
  });
});
