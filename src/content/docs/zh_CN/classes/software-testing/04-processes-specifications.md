---
title: "第四章：软件测试流程和规范"
published: 2026-06-26
description: "常见测试缩写、测试左移与测试右移模型、敏捷测试与会话式测试管理（SBTM），以及TMMi、TPI等测试改进模型与国内外测试标准规范。"
sidebar_position: 4
---

# 第四章：软件测试流程和规范

### 4.1 出现的英文缩写

*   **V&V**：Verification and Validation（验证与确认）
*   **TDD**：Test-Driven Development（测试驱动开发）
*   **ATDD**：Acceptance Test-Driven Development（验收测试驱动开发）
*   **ET**：Exploratory Testing（探索式测试）
*   **TA**：Test Automation（测试自动化）
*   **SBTM**：Session-Based Test Management（基于会话的测试管理）
*   **TMMi**：Testing Maturity Model integration（测试成熟度集成模型）
*   **TPI**：Test Process Improvement（测试过程改进）
*   **CTP**：Critical Test Process（关键测试过程）
*   **STEP**：Systematic Test & Evaluation Process（系统化测试和评估过程）

---

### 4.2 软件测试流程与模型

*   **测试左移**：将测试活动向开发早期（“开始”之前）移动。包含：需求文档评审、设计评审、静态代码检查、提早进行单元测试。**越早发现缺陷，修复成本越低**。
*   **测试右移**：在产品上线后，向测试“结束”之后移动。包含：生产环境监控、灰度发布、用户反馈跟踪、A/B测试、混沌工程。

---

### 4.3 敏捷开发与敏捷测试

*   **敏捷开发宣言**：
    *   个体和互动 高于 流程和工具
    *   工作的软件 高于 详尽的文档
    *   客户合作 高于 合同谈判
    *   响应变化 高于 遵循计划
*   **敏捷测试宣言**：
    *   开发协作测试 胜于 测试分工和测试工具
    *   可运行的测试脚本 胜于 写在纸上的测试用例
    *   从客户角度理解需求 胜于 从已定义的需求判定测试结果
    *   基于上下文及时调整测试策略 胜于 遵守测试计划
*   **Scrum敏捷测试流程**：
    *   **基本概念**：迭代开发（Sprint，每次不超过1个月）。
    *   **三个角色**：Product Owner（产品负责人，代表客户利益）、Developers（开发与测试人员）、Scrum Master（敏捷教练，消除障碍）。
    *   **SBTM (基于会话的测试管理)**：用于管理敏捷开发中的探索式测试。
        *   **Session (会话)**：不受打扰的测试时间段（通常为90分钟），是测试管理的最小单元。
        *   **Charter (章程/指导)**：对 Session 目的、测试范围、策略的简要描述（并非详细步骤）。
        *   **Session Sheet**：记录 Session 结果的卡片，包含耗时、发现的缺陷、遇到的问题等。
        *   **Debriefing (任务汇报)**：通过 PROOF（Past 过去、Results 结果、Obstacles 障碍、Outlook 展望、Feelings 感觉）在 Session 结束后进行口头汇报。

---

### 4.4 各种模型（软件测试改进模型）

*   **TMMi (测试成熟度集成模型)**：
    *   借鉴 CMMI，分为 5 个级别：
        1.  *Level 1: Initial*（初始级 - 无正规流程，调试与测试无区别）。
        2.  *Level 2: Managed*（阶段定义级 - 制定测试方针、计划，有基本技术）。
        3.  *Level 3: Defined*（集成级 - 测试与生命周期集成，有标准和文档）。
        4.  *Level 4: Management and Measurement*（管理与度量级 - 测试可量化、可控制）。
        5.  *Level 5: Optimization*（优化级 - 预防缺陷，持续过程改进）。
*   **TPI (测试过程改进)**：
    *   基于连续性表示法，由 16 个关键域（Key areas，如测试策略、指标、环境等）和 4 个级别（A 到 D）组成。
    *   通过**成熟度矩阵**、**检查点 (checkpoints)** 和**改进建议**来度量和改进测试能力。
*   **CTP (关键测试过程)**：
    *   一个内容参考模型，采用上下文相关方法，侧重于评估并改进团队中 12 个关键测试过程的强弱。
*   **STEP (系统化测试和评估过程)**：
    *   一个内容参考模型，不要求像 TMMi/TPI 那样遵循特定顺序，可与 TPI 结合使用。基本前提包括“由测试件设计导出软件设计 (TDD)”、“及早进行缺陷预防”等。

---

### 4.5 软件测试标准与规范

*   **国际标准**：
    *   **ISO 29119 系列标准**：
        *   *Part 1*: Concepts & Vocabulary（概念和定义 / GB/T 38634.1）
        *   *Part 2*: Testing Process（测试过程 / GB/T 38634.2）
        *   *Part 3*: Documentation（测试文档 / GB/T 38634.3）
        *   *Part 4*: Techniques（测试技术 / GB/T 38634.4）
*   **国家标准**：
    *   **GB/T 15532-2008** 《计算机软件测试规范》
    *   **GB/T 9386-2008** 《计算机软件测试文档编制规范》
