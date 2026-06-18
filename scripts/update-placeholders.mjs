import fs from 'fs';
import path from 'path';

const keyFile = 'src/i18n/i18nKey.ts';
let keyContent = fs.readFileSync(keyFile, 'utf8');
if (!keyContent.includes('jsCodePlaceholder')) {
  keyContent = keyContent.replace('}', `    jsCodePlaceholder = 'jsCodePlaceholder',\n    inputDataPlaceholder = 'inputDataPlaceholder',\n}`);
  fs.writeFileSync(keyFile, keyContent);
}

const langDir = 'src/i18n/languages';

const translations = {
  en: { code: "Enter JavaScript code here...\\ne.g. return data.map(x => x * 2);", data: "Enter JSON data here...\\ne.g. [1, 2, 3]" },
  zh_CN: { code: "在此输入 JavaScript 代码...\\n例如：return data.map(x => x * 2);", data: "在此输入 JSON 数据...\\n例如：[1, 2, 3]" },
  zh_TW: { code: "在此輸入 JavaScript 程式碼...\\n例如：return data.map(x => x * 2);", data: "在此輸入 JSON 資料...\\n例如：[1, 2, 3]" },
  ja: { code: "ここにJavaScriptコードを入力してください...\\n例：return data.map(x => x * 2);", data: "ここにJSONデータを入力してください...\\n例：[1, 2, 3]" },
  ko: { code: "여기에 JavaScript 코드를 입력하세요...\\n예: return data.map(x => x * 2);", data: "여기에 JSON 데이터를 입력하세요...\\n예: [1, 2, 3]" },
  es: { code: "Ingrese el código JavaScript aquí...\\nej. return data.map(x => x * 2);", data: "Ingrese los datos JSON aquí...\\nej. [1, 2, 3]" },
  fr: { code: "Entrez le code JavaScript ici...\\nex. return data.map(x => x * 2);", data: "Entrez les données JSON ici...\\nex. [1, 2, 3]" },
  ru: { code: "Введите код JavaScript здесь...\\nнапр. return data.map(x => x * 2);", data: "Введите данные JSON здесь...\\nнапр. [1, 2, 3]" },
  th: { code: "ป้อนรหัส JavaScript ที่นี่...\\nเช่น return data.map(x => x * 2);", data: "ป้อนข้อมูล JSON ที่นี่...\\nเช่น [1, 2, 3]" },
  tr: { code: "JavaScript kodunu buraya girin...\\nörn. return data.map(x => x * 2);", data: "JSON verilerini buraya girin...\\nörn. [1, 2, 3]" },
  vi: { code: "Nhập mã JavaScript vào đây...\\nvd. return data.map(x => x * 2);", data: "Nhập dữ liệu JSON vào đây...\\nvd. [1, 2, 3]" },
  el: { code: "Εισαγάγετε τον κώδικα JavaScript εδώ...\\nπ.χ. return data.map(x => x * 2);", data: "Εισαγάγετε τα δεδομένα JSON εδώ...\\nπ.χ. [1, 2, 3]" },
  he: { code: "הזן קוד JavaScript כאן...\\nלמשל return data.map(x => x * 2);", data: "הזן נתוני JSON כאן...\\nלמשל [1, 2, 3]" },
  id: { code: "Masukkan kode JavaScript di sini...\\ncth. return data.map(x => x * 2);", data: "Masukkan data JSON di sini...\\ncth. [1, 2, 3]" },
};

for (const [lang, t] of Object.entries(translations)) {
  const p = path.join(langDir, `${lang}.ts`);
  if (!fs.existsSync(p)) continue;
  
  let content = fs.readFileSync(p, 'utf8');
  if (!content.includes('jsCodePlaceholder')) {
    const ext = `
    [Key.jsCodePlaceholder]: "${t.code}",
    [Key.inputDataPlaceholder]: "${t.data}",
};`;
    content = content.replace('};', ext);
    fs.writeFileSync(p, content);
  }
}

console.log('Successfully updated placeholders for all languages.');
