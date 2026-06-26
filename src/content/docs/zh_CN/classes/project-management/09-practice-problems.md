---
title: "第九章：考试核心例题详解与演练"
published: 2026-06-26
description: "精选四道极具代表性的期末考试真题级例题（NPV可行性选择、CPM关键路径顺推逆推、EVM挣值分析预测、变更与版本控制对比简答），提供保姆级计算解析过程。"
sidebar_position: 9
---

# ✍️ 第二部分：考试核心例题详解与演练 (Practice Problems)

---

### 📝 例题一：项目财务可行性选择（NPV、ROI 与回收期）

**【题目背景】**
您作为项目分析师，需要评估一个为期 3 年的 IT 系统升级项目。
* 项目在第 0 年年初需要一次性初始投资：**\$150,000**。
* 公司的折现率（Discount Rate）设定为：**10%**。
* 该项目在未来 3 年内的预期年收益、运营成本和给定的折现因子（Discount Factor）如下表所示：

| 年份 (Year) | 预期年收益 (Benefits) | 预期年运营成本 (Operating Costs) | 折现因子 (Discount Factor @ 10%) |
| :---: | :---: | :---: | :---: |
| **0** | \$0 | \$0 | 1.0000 |
| **1** | \$80,000 | \$10,000 | 0.9091 |
| **2** | \$90,000 | \$15,000 | 0.8264 |
| **3** | \$100,000 | \$20,000 | 0.7513 |

**【考题要求】**
1. 计算每年的净现金流现值（Discounted Net Cash Flow）。
2. 计算项目的净现值（NPV）。
3. 根据投资回报率（ROI）计算公式，计算项目的 ROI。
4. 计算该项目的折现回收期（Discounted Payback Period）。

---

**【📌 详细解答过程】**

**第一步：计算每年的净现金流（Net Cash Flow）与折现净现金流（Discounted Net Cash Flow）**
* 净现金流（NCF） $=$ 收益 (Benefits) $-$ 运营成本 (Operating Costs)
* 折现净现金流（DNCF） $=$ 净现金流 (NCF) $\times$ 折现因子 (Discount Factor)

* **Year 0**：
  * 初始投资 $= -150,000$ 元
  * $\text{DNCF}_0 = -150,000 \times 1.0 = -150,000$ 元
* **Year 1**：
  * $\text{NCF}_1 = 80,000 - 10,000 = 70,000$ 元
  * $\text{DNCF}_1 = 70,000 \times 0.9091 = 63,637$ 元
* **Year 2**：
  * $\text{NCF}_2 = 90,000 - 15,000 = 75,000$ 元
  * $\text{DNCF}_2 = 75,000 \times 0.8264 = 61,980$ 元
* **Year 3**：
  * $\text{NCF}_3 = 100,000 - 20,000 = 80,000$ 元
  * $\text{DNCF}_3 = 80,000 \times 0.7513 = 60,104$ 元

**第二步：计算项目净现值 (NPV)**
$$\text{NPV} = \text{DNCF}_0 + \text{DNCF}_1 + \text{DNCF}_2 + \text{DNCF}_3$$
$$\text{NPV} = -150,000 + 63,637 + 61,980 + 60,104$$
$$\text{NPV} = -150,000 + 185,721 = \mathbf{+35,721} \text{ (元)}$$
* *结论*：由于 **NPV > 0**，该项目可以接受。

**第三步：计算项目的投资回报率 (ROI)**
根据课程公式：$\text{ROI} = \frac{\text{NPV}}{\text{总折现成本}}$
* 总折现成本 $=$ 初始投资 $\text{DNCF}_0$ $+$ 各年运营成本折现和
  * Year 1 折现运营成本 $= 10,000 \times 0.9091 = 9,091$ 元
  * Year 2 折现运营成本 $= 15,000 \times 0.8264 = 12,396$ 元
  * Year 3 折现运营成本 $= 20,000 \times 0.7513 = 15,026$ 元
  * **总折现成本** $= 150,000 + 9,091 + 12,396 + 15,026 = \mathbf{186,513}$ 元
* **ROI 计算**：
  $$\text{ROI} = \frac{35,721}{186,513} \times 100\% = \mathbf{19.15\%}$$

**第四步：计算项目的折现回收期 (Discounted Payback Period)**
我们需要看折现收益何时能够弥补初始投资：
* 年初未收回投资：
  * Year 1 年初未收回：**\$150,000**
  * Year 1 结束收回 \$63,637，Year 2 年初未收回 $= 150,000 - 63,637 = \mathbf{86,363}$ 元
  * Year 2 结束收回 \$61,980，Year 3 年初未收回 $= 86,363 - 61,980 = \mathbf{24,383}$ 元
  * Year 3 年内可完全收回投资，因为 Year 3 的折现流入为 **\$60,104**，大于未收回的 \$24,383。
* Year 3 年内回收所需时间（按比例计算）：
  $$\text{Year 3 比例} = \frac{\text{年初未收回部分}}{\text{Year 3 的折现流入}} = \frac{24,383}{60,104} \approx 0.41 \text{ 年}$$
* **折现回收期** $= 2 + 0.41 = \mathbf{2.41 \text{ 年}}$

---

### 📝 例题二：项目进度与关键路径法（CPM，画图、算时差）

**【题目背景】**
您负责一个IT系统的关键开发，项目包含以下活动、工期（Duration）及活动之间的逻辑依赖关系：

| 活动 (Activity) | 工期 (Duration/天) | 紧前依赖关系与关系类型 (Predecessor & Dependency Type) | 滞后量 (Lag/天) |
| :---: | :---: | :--- | :---: |
| **A** | 4 | 无紧前活动 (Starts project) | - |
| **B** | 6 | A (FS) | - |
| **C** | 5 | A (FS) | - |
| **D** | 3 | B (FS) | - |
| **E** | 2 | C (FS) | - |
| **F** | 7 | D, E (FS) | - |
| **G** | 3 | F (FS) | - |
| **H** | 4 | F (FF) | 2 |

**【考题要求】**
1. 根据表格信息，顺推（Forward Pass） and 逆推（Backward Pass）计算各活动的 ES, EF, LS, LF。
2. 计算每个活动的总时差（Total Slack）。
3. 确定项目的最早完工工期（Project Duration）以及项目的关键路径（Critical Path）。
4. **情境分析**：如果在项目执行过程中，由于技术团队问题，**活动 C 延误了 5 天才完成**，会对项目的整体完工工期产生什么影响？请详细写出原因。

---

**【📌 详细解答过程】**

**第一步：正向推导 (Forward Pass) —— 计算 ES 和 EF**
* 设定项目开始时间 $\text{ES}_A = 0$
* **Activity A**：$\text{EF}_A = \text{ES}_A + \text{Dur}_A = 0 + 4 = \mathbf{4}$
* **Activity B**：$\text{ES}_B = \text{EF}_A = \mathbf{4}$；$\text{EF}_B = 4 + 6 = \mathbf{10}$
* **Activity C**：$\text{ES}_C = \text{EF}_A = \mathbf{4}$；$\text{EF}_C = 4 + 5 = \mathbf{9}$
* **Activity D**：$\text{ES}_D = \text{EF}_B = \mathbf{10}$；$\text{EF}_D = 10 + 3 = \mathbf{13}$
* **Activity E**：$\text{ES}_E = \text{EF}_C = \mathbf{9}$；$\text{EF}_E = 9 + 2 = \mathbf{11}$
* **Activity F**：有两个紧前活动 D（$\text{EF}=13$）和 E（$\text{EF}=11$）。
  * 顺推取最大值：$\text{ES}_F = \max(13, 11) = \mathbf{13}$；$\text{EF}_F = 13 + 7 = \mathbf{20}$
* **Activity G**：$\text{ES}_G = \text{EF}_F = \mathbf{20}$；$\text{EF}_G = 20 + 3 = \mathbf{23}$
* **Activity H**：依赖关系是 F (FF)，且 Lag = 2。
  * 意味着：H 的完工时间最早为 F 完工时间延后 2 天：$\text{EF}_H = \text{EF}_F + 2 = 20 + 2 = \mathbf{22}$。
  * 倒算其最早开始时间：$\text{ES}_H = \text{EF}_H - \text{Dur}_H = 22 - 4 = \mathbf{18}$。

* **项目总工期**（项目完成终点为 G 完工（第23天）与 H 完工（第22天）的最大值）：
  $$\text{项目工期} = \max(\text{EF}_G, \text{EF}_H) = \max(23, 22) = \mathbf{23 \text{ 天}}$$

---

**第二步：逆向推导 (Backward Pass) —— 计算 LS 和 LF**
* 设定项目总终点时间为 23 天。所以终点活动 G 和 H 的最大完工限期均为 23：$\text{LF}_G = 23$，$\text{LF}_H = 23$。
* **Activity G**：$\text{LF}_G = \mathbf{23}$；$\text{LS}_G = \text{LF}_G - \text{Dur}_G = 23 - 3 = \mathbf{20}$
* **Activity H**：
  * 因为 H 的依赖关系是 F (FF) + 2，从逆推角度看，F 的最迟完工时间受 H 的限制：F 完工最迟不能超过 H 完工前 2 天。
  * $\text{LF}_H = \mathbf{23}$；$\text{LS}_H = \text{LF}_H - \text{Dur}_H = 23 - 4 = \mathbf{19}$。
* **Activity F**：后续活动为 G（$\text{LS}=20$）和 H（F的完工限制H的完工，即 $\text{LF}_F \le \text{LF}_H - 2 = 23 - 2 = 21$）。
  * 逆推取最小值：$\text{LF}_F = \min(\text{LS}_G, \text{LF}_H - 2) = \min(20, 21) = \mathbf{20}$；$\text{LS}_F = 20 - 7 = \mathbf{13}$
* **Activity D**：$\text{LF}_D = \text{LS}_F = \mathbf{13}$；$\text{LS}_D = 13 - 3 = \mathbf{10}$
* **Activity E**：$\text{LF}_E = \text{LS}_F = \mathbf{13}$；$\text{LS}_E = 13 - 2 = \mathbf{11}$
* **Activity B**：$\text{LF}_B = \text{LS}_D = \mathbf{10}$；$\text{LS}_B = 10 - 6 = \mathbf{4}$
* **Activity C**：$\text{LF}_C = \text{LS}_E = \mathbf{11}$；$\text{LS}_C = 11 - 5 = \mathbf{6}$
* **Activity A**：后续活动为 B（$\text{LS}=4$）和 C（$\text{LS}=6$）。
  * 逆推取最小值：$\text{LF}_A = \min(\text{LS}_B, \text{LS}_C) = \min(4, 6) = \mathbf{4}$；$\text{LS}_A = 4 - 4 = \mathbf{0}$

---

**第三步：计算总时差（Total Slack = LS - ES）并确定关键路径**

* **A**: $0 - 0 = \mathbf{0}$
* **B**: $4 - 4 = \mathbf{0}$
* **C**: $6 - 4 = \mathbf{2}$
* **D**: $10 - 10 = \mathbf{0}$
* **E**: $11 - 9 = \mathbf{2}$
* **F**: $13 - 13 = \mathbf{0}$
* **G**: $20 - 20 = \mathbf{0}$
* **H**: $19 - 18 = \mathbf{1}$

* **关键路径 (Critical Path)**：时差全部为 0 的路径：
  $$\mathbf{A \rightarrow B \rightarrow D \rightarrow F \rightarrow G}$$
* **总工期**：$\mathbf{23 \text{ 天}}$。

---

**第四步：情境分析（C 延误 5 天的影响）**
* 目前活动 C 的**总时差 (Total Slack) 为 2 天**。这意味着在不影响整个项目最早完工（23天）的前提下，C 活动最多可以延误 2 天。
* 现活动 C 延误了 5 天完成，超出了其拥有的 2 天时差。
* **对总工期的影响**：
  $$\text{项目工期延误天数} = \text{实际延误天数} - \text{可动用总时差} = 5 - 2 = \mathbf{3 \text{ 天}}$$
  项目总工期将从原计划的 23 天**延长至 26 天**（$23 + 3 = 26$）。
  * *关键路径变化*：延误后，路径 $A \rightarrow C \rightarrow E \rightarrow F$ 上的时间消耗增加，此时 $A \rightarrow C \rightarrow E$ 会变成新的关键路径之一。

---

### 📝 例题三：项目绩效监控与挣值管理（EVM，大题必考）

**【题目背景】**
您是一个大型数据平台项目的项目经理。该项目计划工期为 **12 个月**，完工总预算（BAC）为 **\$600,000**。
项目在第一季度的预算支出计划是非线性的，但前 6 个月（项目中期）的整体计划支出预算应占项目总预算的 70%，即计划值（PV）为 **\$420,000**。
现在是第 6 个月月末，您收集到了项目的以下绩效监控数据：
* 项目实际已付出的账单和成本总额：**\$360,000**。
* 经工程总监核对，团队实际完成工作量折合成计划预算的价值：**\$330,000**。

**【考题要求】**
1. 计算项目截至第 6 个月月末的**成本偏差（CV）**和**进度偏差（SV）**。
2. 计算项目的**成本绩效指数（CPI）**和**进度绩效指数（SPI）**，并详细用中文说明项目当前所处的成本与进度状态。
3. 如果当前项目的偏差属于典型偏差（即当前的成本执行效率将一直持续下去），预测项目完工时的最终成本，即**完工估算（EAC）**。
4. **情境分析**：团队在第 6 个月发现，前期对一项核心云存储组件的成本估算过低。经评估，**剩余未完成的工作由于材料和人工价格上涨，实际消耗将比最初原计划高出 10%**（即后续未完成工作的执行成本为计划预算成本的 1.1 倍）。请计算在此特定情境下的完工估算（EAC）。

---

**【📌 详细解答过程】**

**第一步：分析已知量**
* $\text{BAC} = 600,000$ 元
* $\text{PV} = 420,000$ 元
* $\text{AC} = 360,000$ 元
* $\text{EV} = 330,000$ 元

**第二步：计算偏差 (CV, SV)**
* **Cost Variance (CV)**:
  $$\text{CV} = \text{EV} - \text{AC} = 330,000 - 360,000 = \mathbf{-30,000} \text{ (元)}$$
* **Schedule Variance (SV)**:
  $$\text{SV} = \text{EV} - \text{PV} = 330,000 - 420,000 = \mathbf{-90,000} \text{ (元)}$$

**第三步：计算绩效指数并解释状态**
* **Cost Performance Index (CPI)**:
  $$\text{CPI} = \frac{\text{EV}}{\text{AC}} = \frac{330,000}{360,000} \approx \mathbf{0.917} \quad (\text{or } 91.7\%)$$
* **Schedule Performance Index (SPI)**:
  $$\text{SPI} = \frac{\text{EV}}{\text{PV}} = \frac{330,000}{420,000} \approx \mathbf{0.786} \quad (\text{or } 78.6\%)$$
* **项目当前状态中文解释**：
  * **成本超支 (Over budget)**：由于 **$\text{CV} < 0$ 且 $\text{CPI} < 1$**，说明项目当前已经超支了 \$30,000。每花 1 元钱，仅能挣回 0.917 元的价值。
  * **进度落后 (Behind schedule)**：由于 **$\text{SV} < 0$ 且 $\text{SPI} < 1$**，说明项目进度严重落后于原始计划。实际完成的工作仅为原计划应完成工作量的 78.6%。

**第四步：典型偏差下的完工估算 (EAC)**
假设当前的成本绩效（$\text{CPI} = 0.917$）会一直持续，套用典型偏差完工估算公式：
$$\text{EAC} = \frac{\text{BAC}}{\text{CPI}} = \frac{600,000}{0.9167} \approx \mathbf{654,545} \text{ (元)}$$
* *结论*：按此趋势，项目完工将超支大半。

**第五步：情境分析计算（未完成工作成本上涨 10% 时的 EAC）**
* 项目总预算 $\text{BAC} = 600,000$ 元，当前已完成工作的预算价值 $\text{EV} = 330,000$ 元。
* 项目**未完成（剩余）工作**的原始预算（ETC, Estimate to Complete at budgeted rate）：
  $$\text{剩余工作计划成本} = \text{BAC} - \text{EV} = 600,000 - 330,000 = 270,000 \text{ (元)}$$
* 题目指出：由于组件低估，剩余工作实际消耗将**比原计划高出 10%**（即实际执行成本需要计划成本的 1.1 倍）。
  $$\text{预测剩余工作的实际实际成本} (\text{ETC}_{\text{actual}}) = 270,000 \times 1.1 = \mathbf{297,000} \text{ (元)}$$
* **最终预测的完工总估算 (EAC)**：
  $$\text{EAC} = \text{当前实际已支出成本 (AC)} + \text{预测剩余工作实际成本} (\text{ETC}_{\text{actual}})$$
  $$\text{EAC} = 360,000 + 297,000 = \mathbf{657,000} \text{ (元)}$$

---

### 📝 例题四：简答对比题（Change Control vs. Version Control）

**【考题要求（简答题，4分）】**
请用英文或中英文对照的方式，说明项目集成管理中的 **Change Control (变更控制)** 与软件开发中的 **Version Control (版本控制)** 的主要区别，并分别指出其常用工具或步骤。

---

**【📌 详细解答示例】**

* **Change Control (变更控制)**:
  * **Focus (核心关注)**: It focus on **governance and decision-making** of project changes. It decides **whether** a change should happen.（关注项目层面的管理决策与治理。它解决**“是否应该做出改变”**这一决策性问题。）
  * **Steps/Process (主要步骤)**:
    1. Submit a formal change request (提交书面变更请求)；
    2. Conduct impact analysis on scope, cost, and schedule (进行范围、进度、成本影响分析)；
    3. Approved or rejected by PM/CCB (由项目经理或变更控制委员会批准或驳回)；
    4. Implement and update project plan documents (执行变更并更新计划文档)。
  * **Core Group (决策主体)**: **CCB (Change Control Board, 变更控制委员会)**.

* **Version Control (版本控制)**:
  * **Focus (核心关注)**: It focus on **technical management** of code and artifact changes. It records and manages **how** the change is implemented.（关注产品代码和技术成果物的技术管理。它记录并管理**“如何实现这个改变”**，保存所有的历史足迹。）
  * **Steps/Functions (主要功能)**:
    1. Track who changed what and when (记录修改人和时间)；
    2. Maintain version history and backup (维护完整的版本控制链，防止丢失)；
    3. Use branch and merge for parallel development (利用分支和合并支持团队并行开发)；
    4. Rollback to previous versions if needed (提供版本快速回滚功能)。
  * **Common Tool (常用工具)**: **Git** (GitHub, GitLab)。
