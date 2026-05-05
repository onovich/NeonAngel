---
name: program-gameplay-3dfps
description: "用于 3D FPS 玩法实现与结构整理，适用于第一人称移动、视角控制、武器开火、命中判定、敌我交战和战斗回合逻辑设计。"
---

# Program Gameplay 3D FPS Skill

## 目的

该 skill 用于整理和实现 3D FPS 玩法结构，重点覆盖第一人称移动、视角控制、武器系统、射击命中判定、敌我交战和战斗流程。

目标是产出结构清晰、可直接落地的 FPS 玩法代码方案，而不是停留在零散射击函数片段。

## 适用场景

- 需要新建或重构 3D FPS 玩法
- 需要设计第一人称移动、镜头控制、瞄准、开火和换弹
- 需要补充命中判定、伤害计算、敌人交战和死亡反馈
- 需要整理关卡目标、波次推进、失败条件和复活流程

在以下情况不要使用本 skill：

- 只处理 UI、菜单或 HUD 逻辑
- 只处理纯美术资源、枪械模型或特效 prefab
- 只处理 2D 平台跳跃逻辑
- 只处理通用基础设施，而不涉及 FPS 玩法本身

## 接收的 Input

- 玩法类的目标路径、类名、命名空间和运行期目录
- 角色移动方式、镜头控制方式、武器类型和开火模式
- 命中判定方式、伤害规则、敌人行为范围和战斗节奏
- 目标条件、失败条件、复活点和波次推进规则
- 输入方式、更新循环和网络或单机约束

若缺少武器规则、命中判定方式、目标条件或失败条件，则不能可靠给出 FPS 实现方案。

## 处理的事项

1. 识别目标是否属于 3D FPS 玩法。
2. 整理第一人称移动、视角控制、武器开火和命中判定逻辑。
3. 设计敌人交战、伤害反馈、击杀判定和战斗推进流程。
4. 设计玩法状态字段、更新循环和复活或结算规则。
5. 输出可直接实现的 FPS 玩法结构、方法骨架和注意事项。

## 输出的 Output

program-gameplay-3dfps.skill 的 Output 应包含：

- 玩法职责拆分摘要
- 移动、视角、武器和命中逻辑建议
- 战斗推进、失败和复活流程规则
- 更新循环与状态切换要求
- 若信息不足，返回阻塞项与下一步建议

## 任务编排

program-gameplay-3dfps.skill 的任务编排是先确认武器与战斗目标，再整理移动与命中判定，最后输出战斗循环与失败恢复规则。

伪代码如下：

```text
programGameplay3DFps(input) {
    if (isMissing3DFpsSpec(input)) {
        return buildBlockedResult(input)
    }

    var gameplayPlan = analyze3DFpsScope(input)
    var movementPlan = buildFpsMovement(gameplayPlan)
    var weaponPlan = buildFpsWeaponFlow(gameplayPlan)
    var hitPlan = buildFpsHitDetection(gameplayPlan)
    var combatPlan = buildFpsCombatLoop(gameplayPlan)

    return summarize3DFpsResult(gameplayPlan, movementPlan, weaponPlan, hitPlan, combatPlan)
}
```

## 强制约束

- 必须明确包含 Input、处理事项、Output 三块核心内容。
- 任务编排必须包含伪代码。
- 必须同时设计移动、视角、武器、命中判定和战斗推进。
- 不得把 UI 或纯美术资源职责混入 FPS skill。
- 若缺少核心玩法规则，应先返回阻塞项。

## 成功标准

- 能整理 3D FPS 玩法的职责边界
- 能给出移动、视角和武器系统的完整结构
- 能覆盖命中、战斗推进和失败恢复流程
- 能输出可直接落地的玩法结构建议