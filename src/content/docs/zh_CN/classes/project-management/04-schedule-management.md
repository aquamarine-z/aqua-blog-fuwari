---
title: "第四章：项目进度管理"
published: 2026-06-26
description: "阐述里程碑的 SMART 原则、活动间的提前量（Lead）与滞后量（Lag）、依赖关系类型，以及赶工与快速跟进等进度压缩技术。"
sidebar_position: 4
---

# 📚 第四部分：进度管理 (Schedule/Time Management)

### 1. 里程碑与活动关系

* **Milestone (里程碑)**：A significant point or event in a project.
  * 里程碑的**工期为零（Duration = 0）**。
  * 里程碑必须满足 **SMART 原则**（Specific 特定的, Measurable 可衡量的, Assignable 可指派的, Realistic 现实的, Time-framed 有时限的）。
* **Lead (提前量)**：The amount of time a successor activity can be advanced with respect to a predecessor activity.（紧后活动可以提前于紧前活动开始的时间。例如：在编码结束前 3 天（Lead = -3天）即可开始写用户手册。）
* **Lag (滞后量)**：The amount of time a successor activity will be delayed with respect to a predecessor activity.（紧后活动必须在紧前活动结束后等待的强制延时。例如：浇筑混凝土后必须等待 5 天（Lag = 5天）才能开始砌墙。）

---

### 2. 活动依赖关系与进度缩短

* **Dependencies (依赖关系)**：
  * **Mandatory Dependencies (强制性/硬逻辑)**：工作本身的物理性或技术规律决定的顺序（如：没有打好地基就不能建墙）。
  * **Discretionary Dependencies (选择性/软逻辑/首选逻辑)**：项目团队根据行业经验或最佳实践安排的顺序（如：通常先画原型图再写后端代码，但这不是绝对硬性限制）。
  * **External Dependencies (外部依赖关系)**：项目活动与非项目活动（外部不受控因素）之间的顺序关系（如：必须等待政府颁发许可证，施工队才能入场）。

* **进度缩短技术 (Schedule Compression)**：
  * **Crashing (赶工)**：A technique used to shorten the schedule duration for the least incremental cost by adding resources.
    * *代价*：会**直接增加项目成本**，并可能带来人员沟通损耗（“人多手杂”）。
  * **Fast Tracking (快速跟进)**：A schedule compression technique in which activities or phases normally done in sequence are performed in parallel for at least a portion of their duration.
    * *代价*：将串行工作改为并行，会**显著增加项目风险和后期返工（Rework）的概率**。
