---
title: "第六章：系统功能测试"
published: 2026-06-26
description: "系统功能测试的考察范畴、接口自动化与UI测试工具链（Selenium、Cypress、Appium等）、回归测试的策略，以及精准测试的技术内涵。"
sidebar_position: 6
---

# 第六章：系统功能测试

### 1. 系统功能测试内容

针对整个集成的系统，基于产品功能说明书，从用户视角验证功能（Function）、界面（UI）、数据（Data）、逻辑（Logic）及接口（API）。

---

### 2. 接口测试与自动化工具

*   **常用接口协议**：HTTP、Web Service (SOAP/WSDL)、RESTful 接口。
*   **API 自动化工具**：Postman（API 测试与调试平台）。
*   **Web UI 自动化工具**：
    *   **Selenium**：Web 端 UI 自动化经典框架。包含 WebDriver 驱动、Selenium IDE 录制、Selenium Grid 分布式并发运行。
    *   **Cypress**：下一代前端端到端（E2E）测试工具，基于 JavaScript 直接在浏览器渲染进程中运行。
*   **移动端 UI 自动化工具**：
    *   **Appium**：跨平台（iOS/Android）UI 自动化测试框架，基于 WebDriver 协议。
    *   **UIAutomator**：谷歌原生的 Android UI 自动化框架。
    *   **Espresso**：谷歌推荐的 Android 白盒/插桩（Instrumentation）测试框架，运行速度极快。
    *   **MonkeyRunner**：提供 API 编写 Python 脚本来控制 Android 设备和模拟器。

---

### 3. 回归测试与精准测试

*   **回归测试**：在代码修改（修复 Bug、系统增强、配置改变）之后进行测试，以确保旧有功能未受到隐式影响而退化。
*   **精准测试**：通过建立测试用例与代码源文件/行数之间的“双向追溯图”，在回归测试中通过分析版本间差异代码（Diff），精准计算并自动挑选出受影响的测试用例进行最小化集执行，极大地提升回归效率。
