---
name: program-render
description: "用于渲染代码实现，适用于查找 GLSL/Shadertoy 参考、将 GLSL 转为 Unity HLSL，以及实现 URP RenderFeature、RenderPass、后处理与材质参数绑定。"
---

# Program Render Skill

## 目的

该 skill 用于整理和实现渲染相关代码，重点覆盖 GLSL 算法来源、Shadertoy 参考、GLSL 到 HLSL 的转换，以及 URP RenderFeature / RenderPass / 后处理 / 材质参数绑定集成。

目标是产出结构清晰、可直接落地的渲染代码方案，而不是只停留在零散 Shader 片段或单个 Pass 改动。

## 适用场景

- 需要新建或重构 Shader、HLSL 片段或 ShaderLab 结构
- 需要将 GLSL / Shadertoy 算法转换为 Unity HLSL
- 需要实现 URP RenderFeature、RenderPass、后处理效果或全屏 Blit 管线
- 需要整理材质参数绑定、RTHandle 管理和渲染生命周期

在以下情况不要使用本 skill：

- 只创建 animation、animator 或 prefab 资源
- 只处理运行期游戏逻辑代码
- 只修改 UI prefab / meta 或项目初始化文件

## 接收的 Input

- 目标渲染效果的视觉需求和运行场景
- 可参考的 GLSL 或 Shadertoy 算法来源
- 目标 Unity 渲染管线、Shader 输出范围和 RenderFeature 集成要求
- 性能约束、采样次数、参数绑定和输入输出纹理需求

若未提供效果目标、GLSL 来源或渲染管线范围，则不能可靠输出渲染方案。

## 处理的事项

1. 搜索并确认可用的 GLSL 或 Shadertoy 参考实现。
2. 抽取 GLSL 算法核心步骤与关键变量。
3. 将 GLSL 转换为 Unity 可用的 HLSL / Shader 片段。
4. 设计 URP RenderFeature / RenderPass / 后处理集成方式与参数绑定。
5. 输出 Shader、RenderFeature、RenderPass 与关键转换说明。

## 输出的 Output

program-render.skill 的 Output 应包含：

- GLSL 来源与算法说明
- 转换后的 Unity HLSL / Shader 结果
- RenderFeature / RenderPass / 后处理集成方案
- 参数绑定、性能约束和风险提示

## 任务编排

program-render.skill 的任务编排是先确认 GLSL 来源，再进行算法转换和渲染集成，最后输出 Shader 与 RenderFeature 结果。

伪代码如下：

```text
programRenderSkill(input) {
    if (isMissingRenderSpec(input) || isMissingGlslSource(input)) {
        return buildBlockedResult(input)
    }

    var glslPlan = analyzeGlslSource(input)
    var hlslPlan = convertGlslToUnityHlsl(glslPlan)
    var renderFeaturePlan = buildRenderFeatureIntegration(hlslPlan, input)
    validatePipelineCompatibility(renderFeaturePlan)

    return summarizeRenderResult(glslPlan, hlslPlan, renderFeaturePlan)
}
```

## 强制约束

- 必须明确包含 Input、处理事项、Output 三块核心内容。
- 任务编排必须包含伪代码。
- 渲染算法必须从 GLSL 来源派生，不能直接从零独立写 HLSL 原始算法。
- 输出必须同时覆盖 Shader 计算与 RenderFeature / RenderPass 集成。
- 若缺少核心渲染目标或 GLSL 来源，应先返回阻塞项。

## 成功标准

- 能整理渲染算法与管线集成的职责边界
- 能给出 GLSL 到 HLSL 的清晰转换结果
- 能覆盖 RenderFeature、RenderPass、后处理与参数绑定流程
- 能输出可直接落地的渲染代码结构建议
