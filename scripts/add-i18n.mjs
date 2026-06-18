import fs from 'fs';
import path from 'path';

const keyFile = 'src/i18n/i18nKey.ts';
let keyContent = fs.readFileSync(keyFile, 'utf8');
if (!keyContent.includes('jsPlayground')) {
  keyContent = keyContent.replace('}', `    jsPlayground = 'jsPlayground',\n    jsCode = 'jsCode',\n    inputData = 'inputData',\n    consoleOutput = 'consoleOutput',\n    awaitingExecution = 'awaitingExecution',\n    runCode = 'runCode',\n    executing = 'executing',\n    reset = 'reset',\n}`);
  fs.writeFileSync(keyFile, keyContent);
}

const langDir = 'src/i18n/languages';
const files = fs.readdirSync(langDir);

for (const file of files) {
  if (file.endsWith('.ts')) {
    const p = path.join(langDir, file);
    let content = fs.readFileSync(p, 'utf8');
    if (!content.includes('jsPlayground')) {
      const isCN = file.includes('zh_CN') || file.includes('zh_TW');
      const ext = `
    [Key.jsPlayground]: "${isCN ? 'JS 演练场' : 'JS Playground'}",
    [Key.jsCode]: "${isCN ? 'JavaScript 代码' : 'JavaScript Code'}",
    [Key.inputData]: "${isCN ? '输入数据 (JSON)' : 'Input Data (JSON)'}",
    [Key.consoleOutput]: "${isCN ? '控制台输出' : 'Console Output'}",
    [Key.awaitingExecution]: "${isCN ? '等待执行...' : 'Awaiting execution...'}",
    [Key.runCode]: "${isCN ? '运行代码' : 'Run Code'}",
    [Key.executing]: "${isCN ? '执行中...' : 'Executing...'}",
    [Key.reset]: "${isCN ? '重置' : 'Reset'}",
};`;
      content = content.replace('};', ext);
      fs.writeFileSync(p, content);
    }
  }
}
console.log('Added i18n keys successfully.');
