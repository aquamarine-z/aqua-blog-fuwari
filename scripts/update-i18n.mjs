import fs from 'fs';
import path from 'path';

const langDir = 'src/i18n/languages';

const translations = {
  el: {
    jsPlayground: "JS Playground",
    jsCode: "Κώδικας JavaScript",
    inputData: "Δεδομένα Εισόδου (JSON)",
    consoleOutput: "Έξοδος Κονσόλας",
    awaitingExecution: "Αναμονή εκτέλεσης...",
    runCode: "Εκτέλεση Κώδικα",
    executing: "Εκτελείται...",
    reset: "Επαναφορά"
  },
  es: {
    jsPlayground: "JS Playground",
    jsCode: "Código JavaScript",
    inputData: "Datos de Entrada (JSON)",
    consoleOutput: "Salida de Consola",
    awaitingExecution: "Esperando ejecución...",
    runCode: "Ejecutar Código",
    executing: "Ejecutando...",
    reset: "Reiniciar"
  },
  fr: {
    jsPlayground: "JS Playground",
    jsCode: "Code JavaScript",
    inputData: "Données d'entrée (JSON)",
    consoleOutput: "Sortie de la Console",
    awaitingExecution: "En attente d'exécution...",
    runCode: "Exécuter le code",
    executing: "Exécution...",
    reset: "Réinitialiser"
  },
  he: {
    jsPlayground: "JS Playground",
    jsCode: "קוד JavaScript",
    inputData: "נתוני קלט (JSON)",
    consoleOutput: "פלט קונסולה",
    awaitingExecution: "ממתין לביצוע...",
    runCode: "הפעל קוד",
    executing: "מבצע...",
    reset: "איפוס"
  },
  id: {
    jsPlayground: "JS Playground",
    jsCode: "Kode JavaScript",
    inputData: "Data Masukan (JSON)",
    consoleOutput: "Output Konsol",
    awaitingExecution: "Menunggu eksekusi...",
    runCode: "Jalankan Kode",
    executing: "Mengeksekusi...",
    reset: "Atur Ulang"
  },
  ja: {
    jsPlayground: "JSプレイグラウンド",
    jsCode: "JavaScript コード",
    inputData: "入力データ (JSON)",
    consoleOutput: "コンソール出力",
    awaitingExecution: "実行待ち...",
    runCode: "コードを実行",
    executing: "実行中...",
    reset: "リセット"
  },
  ko: {
    jsPlayground: "JS 플레이그라운드",
    jsCode: "JavaScript 코드",
    inputData: "입력 데이터 (JSON)",
    consoleOutput: "콘솔 출력",
    awaitingExecution: "실행 대기 중...",
    runCode: "코드 실행",
    executing: "실행 중...",
    reset: "초기화"
  },
  ru: {
    jsPlayground: "JS Playground",
    jsCode: "Код JavaScript",
    inputData: "Входные данные (JSON)",
    consoleOutput: "Вывод консоли",
    awaitingExecution: "Ожидание выполнения...",
    runCode: "Выполнить код",
    executing: "Выполнение...",
    reset: "Сброс"
  },
  th: {
    jsPlayground: "JS Playground",
    jsCode: "โค้ด JavaScript",
    inputData: "ข้อมูลนำเข้า (JSON)",
    consoleOutput: "ผลลัพธ์คอนโซล",
    awaitingExecution: "กำลังรอการทำงาน...",
    runCode: "รันโค้ด",
    executing: "กำลังทำงาน...",
    reset: "รีเซ็ต"
  },
  tr: {
    jsPlayground: "JS Playground",
    jsCode: "JavaScript Kodu",
    inputData: "Giriş Verisi (JSON)",
    consoleOutput: "Konsol Çıktısı",
    awaitingExecution: "Çalıştırılması bekleniyor...",
    runCode: "Kodu Çalıştır",
    executing: "Çalıştırılıyor...",
    reset: "Sıfırla"
  },
  vi: {
    jsPlayground: "JS Playground",
    jsCode: "Mã JavaScript",
    inputData: "Dữ liệu Đầu vào (JSON)",
    consoleOutput: "Đầu ra Bảng điều khiển",
    awaitingExecution: "Đang chờ thực thi...",
    runCode: "Chạy Mã",
    executing: "Đang thực thi...",
    reset: "Đặt lại"
  },
  zh_TW: {
    jsPlayground: "JS 演練場",
    jsCode: "JavaScript 程式碼",
    inputData: "輸入資料 (JSON)",
    consoleOutput: "主控台輸出",
    awaitingExecution: "等待執行...",
    runCode: "執行程式碼",
    executing: "執行中...",
    reset: "重置"
  }
};

for (const [lang, t] of Object.entries(translations)) {
  const p = path.join(langDir, `${lang}.ts`);
  if (!fs.existsSync(p)) continue;
  
  let content = fs.readFileSync(p, 'utf8');
  
  // Replace the previously inserted english/simplified chinese strings
  content = content.replace(/\[Key\.jsPlayground\]: ".*"/g, `[Key.jsPlayground]: "${t.jsPlayground}"`);
  content = content.replace(/\[Key\.jsCode\]: ".*"/g, `[Key.jsCode]: "${t.jsCode}"`);
  content = content.replace(/\[Key\.inputData\]: ".*"/g, `[Key.inputData]: "${t.inputData}"`);
  content = content.replace(/\[Key\.consoleOutput\]: ".*"/g, `[Key.consoleOutput]: "${t.consoleOutput}"`);
  content = content.replace(/\[Key\.awaitingExecution\]: ".*"/g, `[Key.awaitingExecution]: "${t.awaitingExecution}"`);
  content = content.replace(/\[Key\.runCode\]: ".*"/g, `[Key.runCode]: "${t.runCode}"`);
  content = content.replace(/\[Key\.executing\]: ".*"/g, `[Key.executing]: "${t.executing}"`);
  content = content.replace(/\[Key\.reset\]: ".*"/g, `[Key.reset]: "${t.reset}"`);
  
  fs.writeFileSync(p, content);
}

console.log('Successfully updated translations for all languages.');
