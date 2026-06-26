---
title: "第三章：项目范围管理"
published: 2026-06-26
description: "详述范围管理的六大过程、范围蔓延与需求跟踪矩阵（RTM）的概念，以及工作分解结构（WBS）的创建法则。"
sidebar_position: 3
---

# 📚 第三部分：范围管理 (Scope Management)

### 1. 范围管理六大过程 (Scope Management Processes)

1. **Plan Scope Management (规划范围管理)**：制定如何定义、验证和控制项目范围的计划 [产出：**Scope Management Plan (范围管理计划)**]。
2. **Collect Requirements (收集需求)**：确定、记录并管理干系人的需求以实现项目目标 [产出：**Requirements Documentation (需求文件)**、**Requirements Traceability Matrix (RTM, 需求跟踪矩阵)**]。
3. **Define Scope (定义范围)**：制定项目和产品的详细描述 [产出：**Project Scope Statement (项目范围说明书)**]。
4. **Create WBS (创建工作分解结构)**：将项目可交付成果和项目工作分解为较小的、更易于管理的组件 [产出：**Scope Baseline (范围基准)**]。
5. **Validate Scope (确认范围)**：正式验收已完成的项目可交付成果 [产出：**Accepted Deliverables (验收的可交付成果)**]。
6. **Control Scope (控制范围)**：监督项目和产品的范围状态，管理范围基准的变更 [产出：**Change Requests (变更请求)**]。

---

### 2. 核心术语与工具

* **Scope Creep (范围蔓延)**：The uncontrolled expansion to product or project scope without adjustments to time, cost, and resources.（在未批准、未调整进度预算和资源的情况下，由于客户口头要求、团队主动讨好等原因导致的范围无序扩张。）
* **Requirements Traceability Matrix (RTM, 需求跟踪矩阵)**：A grid that links product requirements from their origin to the deliverables that satisfy them.（将业务需求、系统设计、代码开发和测试用例串联起来的跟踪表格，确保“不漏做任何需求，也不多做不必要的工作”。）
* **Work Breakdown Structure (WBS, 工作分解结构)**：A deliverable-oriented hierarchical decomposition of the total scope of work to be executed by the project team.
  * **100% Rule (100% 原则)**：WBS 必须包含且仅包含项目要完成的 100% 工作，下一层级工作的总和必须 100% 等于其上一层级的工作。
* **Work Package (工作包)**：The work defined at the lowest level of the WBS for which cost and duration can be estimated and managed.（WBS 的**最底层组件**，通常遵循 8/80 原则，即工作量在 8 到 80 小时之间，便于项目经理进行成本和进度的精准控制。）
* **WBS Dictionary (WBS 词典)**：A document that provides detailed deliverable, activity, and scheduling information about each component in the WBS.（防止工作包因字面简短而产生歧义的辅助说明文件，详细记录了每个工作包的负责人、验收标准、技术要求等。）
* **Scope Baseline (范围基准)**：The approved version of a **Scope Statement**, **WBS**, and its associated **WBS Dictionary**, which can be changed only through formal change control procedures.（项目进行过程中的“范围铁律”，包含已批准的范围说明书、WBS 和 WBS 词典。）
