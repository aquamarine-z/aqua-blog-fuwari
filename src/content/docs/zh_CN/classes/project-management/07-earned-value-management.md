---
title: "第七章：重点计算：挣值管理"
published: 2026-06-26
description: "详解挣值管理（EVM）的核心物理量（PV、AC、EV）以及各项偏差与绩效指数公式（CV、SV、CPI、SPI、EAC）。"
sidebar_position: 7
---

# 🧮 重点计算：挣值管理 (EVM, Earned Value Management)

**挣值管理**是衡量项目范围、进度、成本三大绩效的核心工具。考试中会给出具体的数值，要求您计算偏差、指数并预测完工成本。

### 1. 三个基本物理量 (Three Key Dimensions)

1. **PV (Planned Value, 计划值)**：截至当前时间点，**计划完成**工作的预算成本。
2. **AC (Actual Cost, 实际成本)**：到当前时间点，**实际花掉**的全部成本。
3. **EV (Earned Value, 挣值)**：到当前时间为止，**实际已经完成工作**的原始计划预算价值。
   * $$\text{EV} = \text{BAC} \times \text{实际完工百分比}$$

---

### 2. 偏差与指数公式 (Variance & Index)

* **CV (Cost Variance, 成本偏差)**：
  $$\text{CV} = \text{EV} - \text{AC}$$
  * *注：正数表示节省，负数表示超支。*
* **SV (Schedule Variance, 进度偏差)**：
  $$\text{SV} = \text{EV} - \text{PV}$$
  * *注：正数表示进度超前，负数表示进度落后。*
* **CPI (Cost Performance Index, 成本绩效指数)**：
  $$\text{CPI} = \frac{\text{EV}}{\text{AC}}$$
  * *注：大于 1 表示成本效率好（省钱），小于 1 表示超支。*
* **SPI (Schedule Performance Index, 进度绩效指数)**：
  $$\text{SPI} = \frac{\text{EV}}{\text{PV}}$$
  * *注：大于 1 表示进度效率好（超前），小于 1 表示落后。*

---

### 3. 预测公式 (Forecasts)

* **BAC (Budget at Completion, 完工预算)**：项目的总预算（不含管理储备）。
* **EAC (Estimate at Completion, 完工估算)**：预测项目最终全部完工时的总成本。根据考试题目中对未来绩效的假设，选用以下公式之一：

1. **假设未来工作按预算速率（典型非典型/计划速率）进行**：
   $$\text{EAC} = \text{AC} + \text{BAC} - \text{EV}$$
2. **假设当前成本偏差 CPI 具有代表性，将持续到项目结束（最常见默认公式）**：
   $$\text{EAC} = \frac{\text{BAC}}{\text{CPI}}$$
3. **假设成本和进度偏差均会持续影响未来工作（CPI 和 SPI 双重影响）**：
   $$\text{EAC} = \text{AC} + \frac{\text{BAC} - \text{EV}}{\text{CPI} \times \text{SPI}}$$
