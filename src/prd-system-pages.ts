import type { CapabilityPageSpec } from "./capability-page-specs";

export type PrdSystemPage = {
  id: string;
  label: string;
  route: string;
  description: string;
  area: "business" | "admin";
  navHidden?: boolean;
};

export type PrdNavGroup = {
  label: string;
  pages: PrdSystemPage[];
};

const page = (id: string, label: string, route: string, description: string, area: "business" | "admin", navHidden = false): PrdSystemPage => ({ id, label, route, description, area, navHidden });

export const prdNavGroups: PrdNavGroup[] = [
  { label: "工作台", pages: [page("U01", "工作台首页", "/workspace", "快速掌握今日情报、风险与待办", "business")] },
  { label: "情报中心", pages: [
    page("U02", "情报动态", "/intelligence", "浏览、筛选和批量处理情报", "business"),
    page("U03", "情报详情", "/intelligence/:id", "理解变化、来源、趋势和推送原因", "business", true),
    page("U04", "事件时间线", "/subjects/:id/timeline", "查看主体或技术的历史演变", "business"),
    page("U05", "全文检索", "/search", "检索历史情报并高亮命中内容", "business"),
    page("U06", "我的收藏", "/favorites", "管理高价值情报", "business"),
  ] },
  { label: "我的订阅", pages: [
    page("U07", "订阅规则", "/subscriptions", "管理个人与部门订阅", "business"),
    page("U08", "规则编辑器", "/subscriptions/:id/edit", "可视化创建复合规则", "business", true),
    page("U09", "智能推荐", "/subscriptions/recommendations", "发现并采纳推荐规则", "business"),
  ] },
  { label: "批示办理", pages: [page("U10", "批示办理", "/instructions", "完成情报内部流转", "business")] },
  { label: "互动与共建", pages: [
    page("U11", "情报需求提报", "/demands", "提交监控盲区和线索需求", "business"),
    page("U12", "互动与积分", "/engagement", "查看反馈记录和活跃度", "business"),
  ] },
  { label: "个人设置", pages: [page("U13", "通知与偏好", "/settings/notifications", "配置渠道、免打扰和关注方向", "business")] },
  { label: "运营管理", pages: [page("A01", "运营总览", "/admin/overview", "查看全局业务、质量和风险概况", "admin")] },
  { label: "数据接入", pages: [
    page("A02", "接入态势", "/admin/access/topology", "查看八大系统拓扑和健康度", "admin"),
    page("A03", "数据源管理", "/admin/access/sources", "新建、配置、启停数据源", "admin"),
    page("A04", "数据源详情", "/admin/access/sources/:id", "管理连接、字段、同步和变更", "admin", true),
    page("A05", "Schema 与一致性", "/admin/access/schema", "处理 DDL 变更和一致性问题", "admin"),
  ] },
  { label: "数据处理", pages: [
    page("A06", "处理任务与调度", "/admin/processing/jobs", "管理实时流、T+1 和全量任务", "admin"),
    page("A07", "数据质量与死信", "/admin/processing/dead-letter", "定位脏数据并安全重放", "admin"),
    page("A08", "元数据与字典", "/admin/metadata", "管理字段、版本和业务字典", "admin"),
    page("A09", "主键融合", "/admin/id-mapping", "管理跨系统 IDMapping", "admin"),
    page("A10", "数据血缘", "/admin/lineage", "追踪消息全链路和耗时", "admin"),
  ] },
  { label: "AI 与分发", pages: [
    page("A11", "AI 分析策略", "/admin/ai/strategies", "配置模型能力和置信度阈值", "admin"),
    page("A12", "异常基线", "/admin/ai/baselines", "管理指标基线和异常检测", "admin"),
    page("A13", "规则运营", "/admin/ai/rules", "管理公共、冲突和沉睡规则", "admin"),
    page("A14", "聚类与人工标注", "/admin/ai/annotation", "审核 AI 标签、实体、情感和聚类", "admin"),
    page("A15", "用户画像与推荐", "/admin/ai/profiles", "查看画像、热力和推荐效果", "admin"),
    page("A16", "分发路径追踪", "/admin/ai/distribution-trace", "白盒解释一次分发的决策路径", "admin"),
  ] },
  { label: "推送管理", pages: [
    page("A17", "推送概览", "/admin/push/overview", "查看触达、延迟、失败和通道健康", "admin"),
    page("A18", "渠道管理", "/admin/push/channels", "配置站内、短信、邮件和办公应用", "admin"),
    page("A19", "消息模板", "/admin/push/templates", "管理多端内容模板及预览", "admin"),
    page("A20", "推送任务与回执", "/admin/push/tasks", "查询单次投递和回执", "admin"),
    page("A21", "频控与路由", "/admin/push/routing", "配置削峰、免打扰和备用通道", "admin"),
    page("A22", "广播与撤回", "/admin/push/broadcasts", "发布公告、紧急插播和撤回", "admin"),
  ] },
  { label: "安全与开放", pages: [
    page("A23", "安全拦截", "/admin/security/interception", "管理敏感词与被拦截内容", "admin"),
    page("A24", "组织与数据权限", "/admin/security/permissions", "管理组织、角色、密级和隔离", "admin"),
    page("A25", "OpenAPI 管理", "/admin/openapi", "向外部系统开放识别与分发能力", "admin"),
  ] },
  { label: "运维中心", pages: [
    page("A26", "运维监控", "/admin/operations/monitoring", "监控资源、积压、容灾和告警", "admin"),
    page("A27", "审计日志", "/admin/audit", "追溯关键操作和数据访问", "admin"),
  ] },
];

export const prdPages = prdNavGroups.flatMap((group) => group.pages);

const specs: Record<string, CapabilityPageSpec> = {
  U01: { mode: "dashboard", primaryAction: "刷新数据", panelTitle: "今日重点情报", metrics: ["今日命中", "未读情报", "S/A 级预警", "待办批示", "收藏数"], columns: ["等级", "情报标题", "涉及主体", "发生时间", "推送原因", "阅读状态"], samples: ["低空经济重点企业发生核心股权变更", "新型储能政策新增专项申报条款", "合成生物专利申请连续高于基线"], actions: ["确认已阅", "进入详情"] },
  U02: { mode: "workbench", primaryAction: "批量标为已读", panelTitle: "情报动态", filters: ["关键词", "时间", "等级", "阅读状态", "行业", "主体", "事件类型", "来源系统", "情感", "命中方式"], columns: ["阅读状态", "等级", "标题与摘要", "主题标签", "数据来源", "异动信息", "情感/风险", "命中原因", "发生时间"], samples: ["低空经济重点企业发生核心股权变更", "新型储能政策新增专项申报条款", "量子信息机构合作出现聚集"], actions: ["已读", "收藏", "分享", "反馈"] },
  U03: { mode: "workbench", primaryAction: "发起批示", panelTitle: "情报事实与分析", filters: [], columns: ["信息分区", "内容", "数据来源", "更新时间", "状态"], samples: ["关键信息摘要", "异动对比", "AI 解读", "为什么推给我", "来源与证据", "事件演变", "反馈与批示"], actions: ["查看证据", "进入时间线"] },
  U04: { mode: "flow", primaryAction: "对比节点", panelTitle: "事件演变时间线", filters: ["时间范围", "事件类型", "等级", "来源"], steps: ["首次出现", "技术进展", "产业影响", "政策响应", "当前状态"], columns: ["节点时间", "事件标题", "事件类型", "等级", "来源", "关键指标", "变化摘要", "关联情报数"], samples: ["主体首次进入监测范围", "关键技术指标发生变化", "相关政策正式发布"], actions: ["展开节点", "跳转原情报"] },
  U05: { mode: "search", primaryAction: "执行检索", panelTitle: "历史情报检索", filters: ["关键词", "时间范围", "情报等级", "来源", "行业", "主体", "情感", "密级", "是否已读"], columns: ["标题", "命中片段", "来源", "等级", "时间", "标签", "相关度"], samples: ["低空经济企业变更", "新型储能政策扶持", "量子信息技术合作"], actions: ["打开情报", "保存为订阅"] },
  U06: { mode: "list", primaryAction: "新建收藏夹", panelTitle: "我的收藏", filters: ["收藏夹", "情报等级", "更新状态"], columns: ["情报标题", "所属收藏夹", "等级", "收藏时间", "更新状态", "撤回状态", "个人备注"], samples: ["重点企业风险情报", "前沿技术趋势情报", "政策申报机会情报"], actions: ["移动", "编辑备注", "取消收藏"] },
  U07: { mode: "list", primaryAction: "新建订阅规则", panelTitle: "个人与部门订阅", filters: ["作用范围", "规则状态", "创建人"], metrics: ["启用规则", "冲突规则", "沉睡规则", "系统优化建议"], columns: ["规则名称", "作用范围", "监控对象", "条件摘要", "状态", "今日命中", "近 30 天命中", "打开率", "最后命中时间", "创建人", "更新时间"], samples: ["低空经济重点企业重大变更", "新型储能政策申报机会", "量子信息技术合作监控"], actions: ["编辑", "查看命中", "查看版本", "停用"] },
  U08: { mode: "config", primaryAction: "校验并启用", panelTitle: "复合订阅规则编辑器", fields: ["规则名称", "规则说明", "作用范围", "有效期", "AND/OR 条件组", "监控对象", "情报等级", "推送渠道", "推送频率", "单日上限", "免打扰策略"], steps: ["基础信息", "条件配置", "推送策略", "预览校验"] },
  U09: { mode: "list", primaryAction: "刷新推荐", panelTitle: "智能推荐规则", filters: ["适用行业", "推荐置信度", "采纳状态"], columns: ["规则名称", "推荐理由", "同行采用数", "预计命中量", "适用行业", "包含条件", "推荐置信度"], samples: ["关注企业核心人员变更", "关注政策资金申报机会", "关注关键技术合作事件"], actions: ["一键采用", "编辑后采用", "不感兴趣"] },
  U10: { mode: "flow", primaryAction: "发起批示", panelTitle: "批示办理", filters: ["待我办理", "我发起的", "我参与的", "已办结"], steps: ["发起批示", "负责人批示", "办理人处理", "结果反馈", "办结归档"], columns: ["标题", "关联情报", "紧急程度", "发起人", "当前环节", "办理人", "截止时间", "状态"], samples: ["低空经济重点企业风险研判", "新型储能政策机会跟进", "量子信息合作事项办理"], actions: ["办理", "转办", "加签", "催办"] },
  U11: { mode: "config", primaryAction: "提交需求", panelTitle: "情报需求提报", fields: ["需求标题", "需求类型", "背景", "关注主体", "行业/技术", "期望频率", "紧急度", "期望完成时间", "附件", "可见范围"] },
  U12: { mode: "dashboard", primaryAction: "查看积分规则", panelTitle: "互动与积分", metrics: ["累计有效反馈", "点赞数量", "点踩数量", "报错数量", "采纳数", "当前积分"], columns: ["积分来源", "增减值", "发生时间", "规则说明", "关联情报", "采纳状态"], samples: ["情报实体纠错被采纳", "有效线索补充", "模型结果确认正确"], actions: ["查看反馈", "查看明细"] },
  U13: { mode: "config", primaryAction: "保存个人设置", panelTitle: "通知、免打扰与关注偏好", fields: ["S 级允许渠道", "A 级允许渠道", "B/C 级允许渠道", "即时/汇总方式", "每日上限", "短信接收地址", "邮件接收地址", "免打扰星期", "免打扰开始时间", "免打扰结束时间", "节假日静默", "关注行业", "关注企业", "关注技术", "关注地域", "个性化推荐开关"] },

  A01: { mode: "dashboard", primaryAction: "刷新数据", panelTitle: "全局运营概况", metrics: ["今日接入事件数", "有效情报数", "S/A 级数", "规则命中数", "推送成功率", "平均延迟", "未处理死信", "活跃用户"], columns: ["待办类型", "影响对象", "问题摘要", "发生时间", "负责人", "优先级", "状态"], samples: ["Schema 变更待处理", "敏感内容拦截待复核", "推送失败待重试"], actions: ["下钻明细", "立即处理"] },
  A02: { mode: "topology", primaryAction: "刷新拓扑", panelTitle: "源系统—接入网关—处理平台拓扑", metrics: ["在线系统", "告警节点", "总吞吐", "平均延迟"], nodes: ["处理平台", "企业系统", "专利系统", "论文系统", "科研项目系统", "政策系统", "竞品系统", "宏观指标系统", "接入网关"] },
  A03: { mode: "list", primaryAction: "新建数据源", panelTitle: "数据源管理", filters: ["名称", "来源类型", "接入方式", "状态", "负责人", "环境"], columns: ["名称", "业务类型", "接入方式", "环境", "负责人", "状态", "同步模式", "最后心跳", "当前延迟", "异常数", "更新时间"], samples: ["企业信息数据源", "专利数据库", "政策文本流"], actions: ["查看详情", "测试连接", "暂停/恢复", "复制配置"] },
  A04: { mode: "config", primaryAction: "测试并发布", panelTitle: "数据源详情与版本", fields: ["数据源名称", "连接配置", "采集对象", "字段映射", "增量游标", "同步任务", "Schema 版本", "监控告警", "最近稳定版本"], steps: ["保存草稿", "连接测试", "数据预览", "字段校验", "发布版本"] },
  A05: { mode: "workbench", primaryAction: "发起补偿同步", panelTitle: "Schema 变更与一致性巡检", filters: ["数据源", "变更类型", "风险等级", "处理状态"], metrics: ["今日 DDL 变更", "受影响任务", "平均一致率", "待处理差异"], columns: ["数据源", "对象", "变更类型", "变更字段", "发现时间", "影响任务", "风险等级", "状态", "处理人"], samples: ["project_info.project_level 类型变化", "enterprise_base 新增字段", "policy_text 字段删除"], actions: ["调整映射", "暂停任务", "查看差异样本"] },
  A06: { mode: "flow", primaryAction: "新建处理任务", panelTitle: "处理任务与调度", filters: ["实时任务", "T+1 批任务", "历史全量任务", "UDF 管理"], steps: ["读取源数据", "执行处理", "质量校验", "写入目标", "生成检查点"], columns: ["名称", "类型", "来源", "目标", "负责人", "状态", "当前速率", "延迟/进度", "检查点", "最后运行", "下次运行"], samples: ["企业变更实时处理", "论文指标 T+1 日批", "专利历史全量同步"], actions: ["发布", "暂停/恢复", "检查点重启", "重跑"] },
  A07: { mode: "workbench", primaryAction: "批量重放", panelTitle: "数据质量与死信", filters: ["失败环节", "错误类型", "当前状态", "负责人"], metrics: ["完整性", "唯一性", "有效性", "一致性", "及时性"], columns: ["事件 ID", "来源", "发生时间", "失败环节", "错误类型", "错误摘要", "重试次数", "当前状态", "负责人"], samples: ["EVT-DLQ-20261009-027", "EVT-DLQ-20261009-026", "EVT-DLQ-20261009-025"], actions: ["对比原始/标准数据", "单条重放", "忽略"] },
  A08: { mode: "list", primaryAction: "新增元数据对象", panelTitle: "元数据目录与数据字典", filters: ["业务域", "对象类型", "来源", "状态"], columns: ["业务域", "对象名称", "对象编码", "来源", "版本", "负责人", "字段数", "更新时间", "状态"], samples: ["企业主体元数据", "专利成果元数据", "政策文本元数据"], actions: ["查看字段", "字典管理", "发布版本"] },
  A09: { mode: "workbench", primaryAction: "新建匹配策略", panelTitle: "主键融合与冲突审核", filters: ["待匹配队列", "已融合实体", "冲突记录", "匹配策略"], columns: ["实体类型", "源系统 ID", "标准主体 ID", "名称", "辅助标识", "匹配分", "匹配依据", "状态", "审核人"], samples: ["企业主体待匹配记录", "科研机构一对多冲突", "产业专家已融合记录"], actions: ["确认融合", "拆分实体", "查看影响"] },
  A10: { mode: "topology", primaryAction: "追踪链路", panelTitle: "数据血缘链路", metrics: ["链路节点", "总耗时", "异常节点", "任务版本"], nodes: ["源系统", "采集", "协议解析", "清洗", "AI 分析", "规则匹配", "推送", "接收终端"] },
  A11: { mode: "list", primaryAction: "新建分析策略", panelTitle: "AI 分析策略", filters: ["能力类型", "业务域", "状态"], columns: ["能力类型", "策略名称", "模型版本", "适用业务域", "置信度阈值", "低分处理方式", "状态", "更新时间"], samples: ["情报实体识别策略", "产业情感判定策略", "事件聚类去重策略"], actions: ["样本试跑", "编辑", "发布"] },
  A12: { mode: "config", primaryAction: "历史回放并发布", panelTitle: "异常基线配置", fields: ["指标", "对象范围", "时间粒度", "学习窗口", "季节性", "正常区间", "突刺阈值", "连续异动阈值", "等级映射", "模型版本"], steps: ["加载历史数据", "回放当前阈值", "预览命中差异", "发布新基线"] },
  A13: { mode: "list", primaryAction: "新建公共规则", panelTitle: "规则运营", filters: ["公共规则", "全量规则", "冲突规则", "沉睡规则", "规则推荐"], columns: ["名称", "所有者", "范围", "复杂度", "状态", "命中量", "触达率", "最后命中", "冲突数", "更新时间"], samples: ["低空经济公共监控规则", "沉睡规则优化建议", "规则条件冲突记录"], actions: ["查看依赖图", "查看命中样本", "发送优化建议"] },
  A14: { mode: "workbench", primaryAction: "领取标注任务", panelTitle: "聚类与人工标注", filters: ["待审核", "审核中", "已完成", "已退回"], columns: ["任务类型", "样本数", "模型结果", "置信度", "优先级", "截止时间", "领取人"], samples: ["NER 实体标注任务", "产业情感复核任务", "事件聚类审核任务"], actions: ["进入标注台", "批量应用", "退回"] },
  A15: { mode: "dashboard", primaryAction: "配置推荐场景", panelTitle: "用户画像与推荐", metrics: ["画像用户数", "推荐曝光", "推荐采纳", "不感兴趣", "采纳后打开率"], columns: ["组织", "职级", "显式关注", "行为推断偏好", "历史阅读/反馈", "活跃度", "推荐开关"], samples: ["产业研究一部用户群", "政策研究组用户群", "企业创新负责人群体"], actions: ["查看画像", "查看热力", "配置排除条件"] },
  A16: { mode: "flow", primaryAction: "查询分发路径", panelTitle: "分发决策路径", filters: ["情报 ID", "用户", "推送任务 ID", "时间范围"], steps: ["情报分析结果", "候选接收者", "规则与画像命中", "排除用户", "安全校验", "渠道路由与回执"], columns: ["决策步骤", "输入", "判定依据", "结果", "耗时", "模型/规则版本", "状态"], samples: ["候选接收者生成", "无权限用户排除", "S 级短路判定"], actions: ["查看决策日志", "生成一句话解释"] },
  A17: { mode: "dashboard", primaryAction: "刷新数据", panelTitle: "推送运营概览", metrics: ["待发送", "发送中", "推送成功率", "送达率", "阅读率", "平均延迟", "P95 延迟", "失败数"], columns: ["发送渠道", "在线状态", "当前配额", "当前 QPS", "消息积压", "成功率", "最近告警"], samples: ["站内信", "政务短信", "企业邮箱", "政务微信", "钉钉"], actions: ["查看趋势", "通道诊断"] },
  A18: { mode: "list", primaryAction: "新增渠道", panelTitle: "消息渠道管理", filters: ["渠道类型", "环境", "状态", "负责人"], columns: ["渠道名称", "类型", "服务商", "环境", "状态", "优先级", "适用等级", "适用密级", "当前配额", "限速", "负责人"], samples: ["站内消息通道", "政务短信通道", "企业邮箱 SMTP", "政务微信应用", "钉钉工作台"], actions: ["发送测试", "编辑配置", "重置密钥"] },
  A19: { mode: "config", primaryAction: "校验并发布模板", panelTitle: "多端消息模板编辑器", fields: ["模板名称", "渠道", "业务场景", "适用等级", "语言", "模板版本", "标题", "正文", "模板变量", "条件块", "附件/图表", "按钮链接", "敏感词校验", "密级"], steps: ["编辑内容", "多端预览", "变量校验", "安全校验", "发布新版本"] },
  A20: { mode: "list", primaryAction: "刷新回执", panelTitle: "推送任务与回执", filters: ["任务 ID", "等级", "渠道", "推送状态", "时间范围"], columns: ["任务 ID", "情报", "接收对象", "等级", "渠道", "创建时间", "发送时间", "送达时间", "已读时间", "状态", "重试次数", "失败原因"], samples: ["DEL-20261009-018", "DEL-20261009-017", "DEL-20261009-016"], actions: ["查看路径", "手动重试", "切换备用通道", "取消待发送"] },
  A21: { mode: "config", primaryAction: "校验并发布策略", panelTitle: "频控与路由策略", fields: ["策略名称", "对象范围", "渠道", "等级", "每分钟上限", "每小时上限", "每日上限", "突发容量", "超限动作", "路由优先级", "首选通道", "备用通道", "用户在线条件", "免打扰处理", "失败切换条件", "有效期"], steps: ["编辑策略", "检查冲突与覆盖", "模拟路由", "发布策略"] },
  A22: { mode: "flow", primaryAction: "新建广播", panelTitle: "广播发布与撤回", filters: ["广播状态", "等级", "接收范围", "发布时间"], steps: ["编辑广播", "安全校验", "预估人数与费用", "复核", "发布", "回执统计"], columns: ["广播标题", "等级", "接收组织/角色", "渠道", "发布时间", "有效期", "预计人数", "触达状态"], samples: ["系统维护紧急公告", "S 级情报全员广播", "通道恢复更正通知"], actions: ["查看触达", "发起撤回", "发送更正"] },
  A23: { mode: "workbench", primaryAction: "新增敏感词", panelTitle: "敏感内容拦截", filters: ["词条分类", "级别", "适用渠道", "处置状态"], columns: ["拦截内容", "命中词", "来源情报", "目标渠道", "处置动作", "时间", "状态", "处理人"], samples: ["BLOCK-20261009-018", "BLOCK-20261009-017", "BLOCK-20261009-016"], actions: ["误报申诉", "人工放行", "脱敏后重发"] },
  A24: { mode: "config", primaryAction: "保存权限策略", panelTitle: "组织、角色与数据权限", fields: ["组织树", "用户", "角色", "权限策略", "密级策略", "主体", "资源", "操作", "组织范围", "数据密级", "渠道约束", "生效时间"], steps: ["选择用户与情报", "模拟查看权限", "模拟推送权限", "展示判定链路"] },
  A25: { mode: "list", primaryAction: "新建 API 应用", panelTitle: "OpenAPI 管理", filters: ["授权能力", "负责人", "状态"], columns: ["应用名称", "AppKey", "负责人", "授权能力", "数据范围", "IP 白名单", "QPS", "有效期", "状态"], samples: ["产业研究应用", "外部情报识别服务", "部门规则匹配应用"], actions: ["查看接口文档", "在线调试", "调用统计", "轮换密钥"] },
  A26: { mode: "dashboard", primaryAction: "刷新监控", panelTitle: "平台运维监控", metrics: ["CPU", "内存", "磁盘", "网络", "实例数", "队列积压", "消费速率", "任务延迟"], columns: ["监控对象", "当前主节点", "备用节点", "心跳", "队列积压", "检查点耗时", "最近切换原因", "状态"], samples: ["接入网关集群", "流计算集群", "规则匹配服务", "推送路由网关"], actions: ["查看资源", "确认告警", "指派", "限时静默"] },
  A27: { mode: "search", primaryAction: "查询审计日志", panelTitle: "审计日志", filters: ["用户", "资源", "动作", "时间", "结果"], columns: ["时间", "操作人", "组织", "模块", "动作", "资源", "结果", "IP/终端", "变更前后摘要", "追踪 ID"], samples: ["AUDIT-20261009-018", "AUDIT-20261009-017", "AUDIT-20261009-016"], actions: ["查看配置差异", "查看追踪链路"] },
};

export const prdPageSpecs: Record<string, CapabilityPageSpec> = specs;
