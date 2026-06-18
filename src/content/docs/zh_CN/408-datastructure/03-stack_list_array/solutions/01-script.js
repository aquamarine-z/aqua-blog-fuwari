/**
 * 中缀表达式转后缀表达式
 * 读取 data 中的字符串数组，并输出转换结果。
 * 
 * 支持的运算数：[a-z]（单字母）
 * 支持的运算符：+, -, *, /, (, )
 */

function getPrecedence(operator) {
  if (operator === '+' || operator === '-') return 1;
  if (operator === '*' || operator === '/') return 2;
  return 0; // '(' 优先级设为最低，确保留在栈中
}

function infixToPostfix(expression) {
  const stack = [];
  let postfix = '';

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    // 忽略空格
    if (char === ' ') continue;

    // 1. 遇到字母（运算数），直接输出
    if (/[a-z]/i.test(char)) {
      postfix += char;
    } 
    // 2. 遇到左括号，入栈
    else if (char === '(') {
      stack.push(char);
    } 
    // 3. 遇到右括号
    else if (char === ')') {
      // 弹出符号直到遇见左括号
      while (stack.length > 0 && stack[stack.length - 1] !== '(') {
        postfix += stack.pop();
      }
      // 弹出左括号（丢弃）
      stack.pop();
    } 
    // 4. 遇到普通运算符
    else {
      // 弹出栈中优先级 >= 当前符号的运算符
      while (
        stack.length > 0 && 
        getPrecedence(stack[stack.length - 1]) >= getPrecedence(char)
      ) {
        postfix += stack.pop();
      }
      // 当前符号入栈
      stack.push(char);
    }
  }

  // 5. 弹出剩余所有运算符
  while (stack.length > 0) {
    postfix += stack.pop();
  }

  return postfix;
}

// 数据校验
if (!data || !Array.isArray(data)) {
  console.error("请在 Data 区域输入一个包含表达式的字符串数组。");
  return;
}

console.log("=== 开始转换 ===\n");

// 遍历测试用例
const results = data.map(expr => {
  const postfix = infixToPostfix(expr);
  console.log(`中缀: ${expr}`);
  console.log(`后缀: ${postfix}\n`);
  return postfix;
});

// 返回最终结果
return results;