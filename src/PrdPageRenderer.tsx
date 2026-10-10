import {
  AlertTriangle,
  ArrowRight,
  BellRing,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Clock3,
  Database,
  FileText,
  GitBranch,
  Heart,
  MessageSquare,
  Network,
  Plus,
  Send,
  Settings,
  ShieldCheck,
  Star,
  ThumbsDown,
  ThumbsUp,
  Users,
  Workflow,
} from "lucide-react";
import { useState } from "react";
import SpecificCapabilityPage, { type SpecificCapabilityItem } from "./SpecificCapabilityPage";
import TemporalControl, { temporalKindForField } from "./TemporalControl";
import { prdPageSpecs } from "./prd-system-pages";

type Notify = (message: string, tone?: "success" | "warning" | "info") => void;

function Panel({ title, note, children, action }: { title: string; note?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return <section className="prd-panel"><header><div><h2>{title}</h2>{note && <p>{note}</p>}</div>{action}</header><div className="prd-panel-body">{children}</div></section>;
}

function Metrics({ labels }: { labels: string[] }) {
  const values = ["47", "12", "3", "5", "18", "98.7%", "1.8 s", "126"];
  return <div className="prd-metrics">{labels.slice(0,8).map((label,index)=><div key={label}><span>{label}</span><strong>{values[index]}</strong><small>今日更新</small></div>)}</div>;
}

const intel = [
  ["S", "低空经济重点企业发生核心股权变更", "企业信息系统", "10:32"],
  ["A", "新型储能政策新增专项申报条款", "政策采集系统", "10:18"],
  ["A", "合成生物专利申请连续高于基线", "专利数据库", "09:46"],
];

function FilterSelect({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  return <div className="prd-filter-select"><button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)}>{value || label}<ChevronDown /></button>{open && <div className="prd-filter-menu" role="listbox" aria-label={label}>{["全部", ...options].map((option) => <button className={(value || "全部") === option ? "is-selected" : ""} type="button" role="option" aria-selected={(value || "全部") === option} onClick={() => { onChange(option === "全部" ? "" : option); setOpen(false); }} key={option}>{option}</button>)}</div>}</div>;
}

function Dashboard({ item }: { item: SpecificCapabilityItem }) {
  const labels = prdPageSpecs[item.id].metrics ?? [];
  return <div className="prd-page prd-dashboard"><Metrics labels={labels}/><div className="prd-grid-2"><Panel title={item.id === "U01" ? "高危预警" : item.id === "A17" ? "渠道触达趋势" : item.id === "A26" ? "平台健康" : "运营趋势"} note="最近 24 小时"><div className="prd-bars">{[42,68,55,82,64,91,76,88,70,94,81,89].map((v,i)=><i style={{height:`${v}%`}} key={i}/>)}</div></Panel><Panel title={item.id === "U01" ? "待办事项" : "异常与待办"} note="按优先级排序"><div className="prd-todo"><button><AlertTriangle/><span><strong>高危情报待确认</strong><small>S 级情报 · 2 项</small></span><em>立即处理</em></button><button><CircleAlert/><span><strong>规则冲突待处理</strong><small>订阅规则 · 3 项</small></span><em>查看</em></button><button><Clock3/><span><strong>推送失败待重试</strong><small>消息任务 · 7 项</small></span><em>查看</em></button></div></Panel></div><Panel title={item.id === "U01" ? "今日重点情报" : "关键明细"} note={item.description}><div className="prd-alert-cards">{intel.map((r)=><article key={r[1]}><em className={`is-${r[0].toLowerCase()}`}>{r[0]}</em><div><strong>{r[1]}</strong><small>{r[2]} · {r[3]}</small></div><ArrowRight/></article>)}</div></Panel></div>;
}

function IntelligenceFeed({ item, favorites=false }: { item: SpecificCapabilityItem; favorites?: boolean }) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("");
  const [industry, setIndustry] = useState("");
  const [readState, setReadState] = useState("");
  const records = intel.concat([["B","量子信息机构合作出现聚集","论文数据库","09:21"]]).map((row, index) => ({ row, industry: ["低空经济", "新型储能", "合成生物", "量子信息"][index], read: index ? "已读" : "未读" }));
  const visible = records.filter(({ row, industry: itemIndustry, read }) => (!query || row[1].includes(query)) && (!level || row[0] === level) && (!industry || itemIndustry === industry) && (!readState || read === readState));
  return <div className="prd-page"><div className="prd-toolbar"><label><input aria-label="搜索情报" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索情报标题、主体或关键词"/></label><FilterSelect label="等级" value={level} onChange={setLevel} options={["S", "A", "B", "C"]}/><FilterSelect label="行业" value={industry} onChange={setIndustry} options={["低空经济", "新型储能", "合成生物", "量子信息"]}/><FilterSelect label="阅读状态" value={readState} onChange={setReadState} options={["未读", "已读"]}/><TemporalControl label="时间范围" kind="date-range" compact/><button className="kds-button kds-button-primary">查询</button><button className="kds-button kds-button-secondary" onClick={() => { setQuery(""); setLevel(""); setIndustry(""); setReadState(""); }}>重置</button><span/><button className="kds-button kds-button-primary">{favorites?"新建收藏夹":"批量标为已读"}</button></div><div className="prd-feed">{visible.map(({ row:r, industry:itemIndustry, read })=><article key={r[1]}><div className="prd-feed-head"><em className={`is-${r[0].toLowerCase()}`}>{r[0]} 级</em><span>{read}</span><time>{r[3]}</time></div><h2>{r[1]}</h2><p>监测到关键数据发生变化，系统已完成来源核对、规则匹配和影响范围识别。</p><div className="prd-feed-meta"><span>{itemIndustry}</span><span>企业动态</span><span>{r[2]}</span></div><footer><button><Star/>收藏</button><button><MessageSquare/>反馈</button><button>查看详情<ArrowRight/></button></footer></article>)}{visible.length === 0 && <div className="prd-filter-empty"><strong>没有匹配的情报</strong><p>请调整关键词或筛选条件后重试。</p></div>}</div></div>;
}

function IntelligenceDetail({ item }: { item: SpecificCapabilityItem }) {
  return <div className="prd-page prd-detail"><header className="prd-detail-hero"><div><span className="prd-level-s">S 级</span><span>可分发</span></div><h1>低空经济重点企业发生核心股权变更</h1><p>事件发生于 2026-10-09 10:31，涉及重点企业及核心机构股东变化。</p><footer><button><Star/>收藏</button><button>分享</button><button className="kds-button kds-button-primary">发起批示</button></footer></header><div className="prd-detail-grid"><main><Panel title="事实摘要"><dl className="prd-facts"><div><dt>涉及主体</dt><dd>某低空经济重点企业</dd></div><div><dt>事件类型</dt><dd>企业股权变更</dd></div><div><dt>发生时间</dt><dd>2026-10-09 10:31:48</dd></div><div><dt>情感/风险</dt><dd>风险 · 置信度 96%</dd></div></dl></Panel><Panel title="异动对比" note="原始指标与历史基线"><div className="prd-change"><span><small>变化前</small><strong>18.6%</strong></span><ArrowRight/><span><small>变化后</small><strong>31.2%</strong></span><em>+12.6%</em></div></Panel><Panel title="AI 解读" note="AI 生成内容，与事实分区展示"><p className="prd-copy">本次股权变化可能影响企业治理结构与后续融资安排，建议结合工商原文和关联主体历史动态进一步研判。</p></Panel><Panel title="来源与证据"><div className="prd-source"><FileText/><span><strong>企业信息系统原始记录</strong><small>采集时间 10:31:52 · 数据版本 v18</small></span><button>查看原文</button></div></Panel></main><aside><Panel title="为什么推给我"><ul className="prd-reasons"><li>命中“低空经济重点企业重大变更”规则</li><li>画像标签：低空经济、企业风险</li><li>S 级短路分发已触发</li></ul></Panel><Panel title="反馈"><div className="prd-feedback"><button><ThumbsUp/>准确</button><button><ThumbsDown/>有误</button><button><MessageSquare/>补充线索</button></div></Panel></aside></div></div>;
}

function Timeline({ item }: { item: SpecificCapabilityItem }) {
  const nodes=["主体首次进入监测范围","核心技术获得专利授权","重点企业完成融资","相关扶持政策发布","当前风险状态更新"];
  return <div className="prd-page prd-timeline-layout"><aside><h2>筛选</h2>{["时间范围","事件类型","情报等级","数据来源"].map(x=><label key={x}><span>{x}</span>{x === "时间范围" ? <TemporalControl label={x} kind="date-range" /> : <button>{x}<ChevronDown/></button>}</label>)}</aside><main><Panel title="事件演变时间线" note={item.description}><ol className="prd-timeline">{nodes.map((n,i)=><li key={n}><time>{`202${2+i}-0${i+2}-18`}</time><span/><article><header><strong>{n}</strong><em>{i<2?"B 级":"A 级"}</em></header><p>来自多个业务系统的关键变化，保留原始来源和关联情报。</p><footer>关联情报 {i+1} 条 <button>查看原情报</button></footer></article></li>)}</ol></Panel></main><aside><Panel title="主体摘要"><dl className="prd-facts"><div><dt>主体名称</dt><dd>某重点企业</dd></div><div><dt>所属行业</dt><dd>低空经济</dd></div><div><dt>事件总数</dt><dd>18</dd></div></dl></Panel></aside></div>;
}

function SearchResults({ item }: { item: SpecificCapabilityItem }) {
  return <div className="prd-page"><div className="prd-search-box"><input aria-label="全文检索关键词" defaultValue="低空经济"/><button>搜索</button></div><div className="prd-search-layout"><aside>{["时间范围","情报等级","来源系统","行业","情感","密级","阅读状态"].map(x=><label key={x}><span>{x}</span>{x === "时间范围" ? <TemporalControl label={x} kind="date-range" /> : <button>全部<ChevronDown/></button>}</label>)}</aside><main><header><strong>找到 128 条结果</strong><button>保存搜索为订阅规则</button></header>{intel.map(r=><article className="prd-search-result" key={r[1]}><h2>{r[1]}</h2><p>……监测到<mark>低空经济</mark>相关企业发生关键变化，命中历史情报及来源证据……</p><footer><span>{r[2]}</span><span>{r[0]} 级</span><time>{r[3]}</time></footer></article>)}</main></div></div>;
}

function RuleEditor({ item }: { item: SpecificCapabilityItem }) {
  return <div className="prd-page prd-editor"><div className="prd-editor-steps">{["基础信息","条件配置","推送策略","预览校验"].map((x,i)=><div className={i===1?"is-current":i<1?"is-done":""} key={x}><span>{i+1}</span><strong>{x}</strong></div>)}</div><div className="prd-editor-grid"><main><Panel title="条件配置" note="支持 AND/OR，最多嵌套两层"><div className="prd-rule-group"><header>满足以下 <button>全部条件<ChevronDown/></button></header>{[["行业","等于","低空经济"],["企业等级","等于","重点企业"],["风险等级","大于等于","A 级"]].map((r,i)=><div key={r[0]}><em>{i?"且":"当"}</em>{r.map(x=><button key={x}>{x}<ChevronDown/></button>)}<button>删除</button></div>)}<button className="prd-add-condition"><Plus/>添加条件</button></div></Panel><footer className="prd-editor-actions kds-page-action-bar"><button>保存草稿</button><button className="kds-button kds-button-primary">下一步</button></footer></main><aside><Panel title="自然语言摘要"><p className="prd-copy">当行业为低空经济，且企业等级为重点企业，且风险等级大于等于 A 级时触发。</p></Panel><Panel title="最近 7 天试跑"><Metrics labels={["预计日均命中","S/A 级占比","潜在打扰用户"]}/></Panel></aside></div></div>;
}

function Recommendations({ item }: { item: SpecificCapabilityItem }) {
  return <div className="prd-page"><div className="prd-toolbar"><button>适用行业<ChevronDown/></button><button>推荐置信度<ChevronDown/></button><span/></div><div className="prd-recommend-grid">{["关注企业核心人员变更","关注政策资金申报机会","关注关键技术合作事件","关注行业趋势连续异动"].map((x,i)=><article key={x}><header><BrainCircuit/><span>推荐置信度 {92-i*4}%</span></header><h2>{x}</h2><p>因为你关注低空经济与重点企业动态，同行用户也在使用相似监控规则。</p><dl><div><dt>预计命中</dt><dd>{8+i*3} 条/周</dd></div><div><dt>同行采用</dt><dd>{24+i*7} 人</dd></div></dl><footer><button>不感兴趣</button><button>编辑后采用</button><button className="kds-button kds-button-primary">一键采用</button></footer></article>)}</div></div>;
}

function FormPage({ item }: { item: SpecificCapabilityItem }) {
  const fields=prdPageSpecs[item.id].fields??[];
  return <div className="prd-page"><Panel title={prdPageSpecs[item.id].panelTitle} note={item.description}><form className="prd-form">{fields.map((f,i)=>{const temporalKind=temporalKindForField(f);return <label className={/(背景|说明|正文)/.test(f)?"is-wide":""} key={f}><span>{f}{i<3&&<em>*</em>}</span>{temporalKind?<TemporalControl label={f} kind={temporalKind}/>:/(背景|说明|正文)/.test(f)?<textarea placeholder={`请输入${f}`}/>:/(类型|范围|频率|等级|渠道|行业|技术|星期|开关)/.test(f)?<button type="button">请选择{f}<ChevronDown/></button>:<input placeholder={`请输入${f}`}/>}</label>})}<footer className="kds-page-action-bar"><button type="button">保存草稿</button><button className="kds-button kds-button-primary" type="button">{prdPageSpecs[item.id].primaryAction}</button></footer></form></Panel></div>;
}

function Annotation({ item }: { item: SpecificCapabilityItem }) {
  return <div className="prd-page prd-annotation"><aside><header><h2>样本列表</h2><span>待审核 27</span></header>{intel.map((r,i)=><button className={i===0?"is-current":""} key={r[1]}><strong>{r[1]}</strong><small>置信度 {96-i*6}%</small></button>)}</aside><main><header><h2>原文与证据</h2><span>任务 ANN-20261009-018</span></header><article><h1>低空经济重点企业发生核心股权变更</h1><p>企业工商数据更新显示，新增机构股东并调整核心股东持股比例。该变化可能影响企业后续融资与治理结构。</p><blockquote>原始来源片段：股东及出资信息于 2026-10-09 完成变更登记。</blockquote></article></main><aside><header><h2>人工标注</h2></header><div className="prd-annotation-form"><label>行业标签<button>低空经济<ChevronDown/></button></label><label>核心实体<input value="某重点企业" readOnly/></label><label>情感判定<button>风险<ChevronDown/></button></label><label>审核结论<textarea defaultValue="模型结果基本正确，补充企业主体标签。"/></label><footer className="kds-page-action-bar"><button>退回</button><button className="kds-button kds-button-primary">提交审核</button></footer></div></aside></div>;
}

function TemplateEditor({ item }: { item: SpecificCapabilityItem }) {
  return <div className="prd-page prd-template-editor"><aside><h2>模板结构</h2>{["标题","摘要","核心指标","来源信息","查看详情按钮"].map(x=><button key={x}>{x}</button>)}</aside><main><Panel title="模板内容"><div className="prd-template-form"><label>模板名称<input value="S 级情报即时通知" readOnly/></label><label>标题<input value="{{level}}｜{{intelligence.title}}" readOnly/></label><label>正文<textarea value="{{summary}}\n发生时间：{{occurredAt}}\n来源：{{source}}" readOnly/></label><label>变量<button>插入变量<ChevronDown/></button></label></div></Panel></main><aside><h2>多端预览</h2><div className="prd-phone-preview"><BellRing/><strong>S 级｜重点企业发生关键变更</strong><p>监测到核心股权结构变化，请及时查看详情。</p><button>查看详情</button></div><footer className="kds-page-action-bar"><button>校验模板</button><button className="kds-button kds-button-primary">发布新版本</button></footer></aside></div>;
}

function Permission({ item }: { item: SpecificCapabilityItem }) {
  return <div className="prd-page prd-permission"><aside><h2>组织树</h2>{["深圳国际科技信息中心","产业研究一部","政策研究组","技术战略组","平台运营组"].map((x,i)=><button className={i===1?"is-current":""} key={x}>{i?"　":""}{x}</button>)}</aside><main><div className="prd-tabs"><button className="is-active">用户</button><button>角色</button><button>权限策略</button><button>密级策略</button></div><Panel title="用户与数据范围"><div className="prd-permission-list">{["张明｜部门负责人｜部门及下级｜内部","李宁｜情报专家｜本部门｜内部","王欣｜普通用户｜本人｜公开"].map(x=><div key={x}><span>{x}</span><button>配置权限</button></div>)}</div></Panel><Panel title="权限模拟" note="选择用户和情报，查看完整判定链路"><div className="prd-permission-sim"><button>张明<ChevronDown/></button><button>S 级企业变更情报<ChevronDown/></button><button className="kds-button kds-button-primary">开始模拟</button><span><ShieldCheck/>允许查看，禁止外部渠道推送</span></div></Panel></main></div>;
}

function PathView({ item }: { item: SpecificCapabilityItem }) {
  const nodes=prdPageSpecs[item.id].steps??["源系统","采集","解析","清洗","AI 分析","规则匹配","推送"];
  return <div className="prd-page"><div className="prd-toolbar"><label><input placeholder="输入情报 ID、事件 ID 或推送任务 ID"/></label><button className="kds-button kds-button-primary">查询链路</button></div><Panel title={prdPageSpecs[item.id].panelTitle} note={item.description}><div className="prd-path">{nodes.map((x,i)=><div key={x}><span>{i+1}</span><strong>{x}</strong><small>{180+i*46} ms · 正常</small>{i<nodes.length-1&&<ArrowRight/>}</div>)}</div><div className="prd-explanation"><BrainCircuit/><span><strong>一句话解释</strong><p>该情报因命中部门规则和用户画像标签，经安全校验后选择站内信与短信通道触达。</p></span></div></Panel></div>;
}

function SubscriptionHub({ item }: { item: SpecificCapabilityItem }) {
  return <div className="prd-page"><Metrics labels={["启用规则", "今日命中", "冲突规则", "沉睡规则"]}/><div className="prd-grid-2"><Panel title="规则冲突与死循环检测" note="保存规则时自动校验"><div className="ref-issue-list"><article><AlertTriangle/><span><strong>先进制造紧急情报</strong><small>与“制造业免打扰”互斥</small></span><em>已拦截</em><button>处理</button></article><article><GitBranch/><span><strong>企业风险再分发</strong><small>A → B → A 循环路径</small></span><em>已阻断</em><button>查看路径</button></article></div></Panel><Panel title="沉睡规则治理" note="长期未命中或未查看"><div className="ref-sleep-list">{[["生物医药海外融资","128 天未命中"],["去年度光伏补贴政策","96 天未点击"],["国外旧版专利分类","182 天未命中"]].map(r=><article key={r[0]}><span><strong>{r[0]}</strong><small>{r[1]}</small></span><button>立即优化</button><button>停用</button></article>)}</div></Panel></div><Panel title="智能订阅推荐" note="根据关注偏好和隐私聚合后的同行采用情况"><div className="prd-recommend-grid">{[["低空经济政策与融资","92%","同行中 68% 已订阅"],["人形机器人产业链","86%","基于具身智能浏览行为"],["先进储能技术进展","78%","基于新能源专利标签"]].map(r=><article key={r[0]}><header><BrainCircuit/><span>{r[1]} 匹配</span></header><h2>{r[0]}</h2><p>{r[2]}</p><footer><button>不感兴趣</button><button className="kds-button kds-button-primary">一键采用</button></footer></article>)}</div></Panel></div>;
}

function ApprovalPage({ item }: { item: SpecificCapabilityItem }) {
  return <div className="prd-page"><Metrics labels={["待我办理", "我发起的", "即将超期", "本月办结"]}/><Panel title="当前流转" note="重要情报内部定向批示"><div className="ref-approval-flow">{["发起批示","负责人批示","专业部门会签","执行任务分派","结果反馈"].map((x,i)=><div className={i<2?"is-done":i===2?"is-current":""} key={x}><span>{i+1}</span><strong>{x}</strong><small>{i<2?"已完成":i===2?"进行中":"等待"}</small></div>)}</div></Panel><div className="prd-grid-2"><Panel title="批示意见追踪"><div className="ref-opinions"><article><strong>王主任</strong><p>请产业研究一部核实企业治理变化的潜在影响。</p><time>10:24</time></article><article><strong>产业研究一部</strong><p>已完成来源核验，正在补充关联企业与融资信息。</p><time>11:08</time></article></div></Panel><Panel title="流程效能"><Metrics labels={["平均办理时长", "按时办结率", "退回率"]}/><button className="kds-button kds-button-primary">发起情报流转</button></Panel></div></div>;
}

function ProfileInsights({ item }: { item: SpecificCapabilityItem }) {
  return <div className="prd-page"><Metrics labels={["画像主体", "活跃用户", "推荐曝光", "采纳后打开率"]}/><div className="prd-grid-2"><Panel title="创新主体多维画像" note="显式关注与行为推断分开呈现"><div className="ref-groups">{["产业研究人员","政策研究人员","企业技术负责人","情报专家"].map((x,i)=><button key={x}><Users/><span><strong>{x}</strong><small>{[1286,842,2418,126][i]} 人 · 活跃度高</small></span><ArrowRight/></button>)}</div></Panel><Panel title="跨域偏好关联热力图" note="仅展示满足最小聚合人数的群体"><div className="ref-heatmap">{["低空经济","新型储能","量子信息","合成生物"].map((x,i)=><div key={x}><span>{x}</span>{[72,48,86,61].map((v,j)=><i style={{opacity:(v+i*7-j*5)/100}} title={`${v}%`} key={j}/>)}</div>)}</div></Panel></div><Panel title="推荐效果"><div className="ref-effect"><span>曝光 12,846</span><span>采纳 3,284</span><span>不感兴趣 426</span><span>采纳后打开率 78.6%</span><button>配置推荐场景</button></div></Panel></div>;
}

function ThresholdControl({ item }: { item: SpecificCapabilityItem }) {
  return <div className="prd-page"><div className="prd-grid-2"><Panel title="推送频控与智能打包" note="保护用户免受高频情报打扰"><div className="ref-config"><label>单日推送上限<input type="number" defaultValue="20"/></label><label>相似情报合并窗口<button>30 分钟<ChevronDown/></button></label><label>日终简报时间<input type="time" defaultValue="18:00"/></label><label>S 级强制放行<button>始终放行<ChevronDown/></button></label><footer><button className="kds-button kds-button-primary">保存频控策略</button></footer></div></Panel><Panel title="AI 分发置信度阈值" note="通过历史数据回放平衡误报与漏报"><div className="ref-threshold"><strong>当前阈值 82%</strong><input type="range" min="50" max="99" defaultValue="82"/><div><span>预计日均命中 186 条</span><span>人工审核 27 条</span><span>可能漏报 8 条</span></div><button className="kds-button kds-button-primary">应用阈值</button></div></Panel></div><PathView item={{...item,id:"A16"}}/></div>;
}

const custom:Record<string,(p:{item:SpecificCapabilityItem})=>React.ReactNode>={
  U01:({item})=><Dashboard item={item}/>, U02:({item})=><IntelligenceFeed item={item}/>, U03:({item})=><IntelligenceDetail item={item}/>, U04:({item})=><Timeline item={item}/>, U05:({item})=><SearchResults item={item}/>, U06:({item})=><IntelligenceFeed item={item} favorites/>, U07:({item})=><SubscriptionHub item={item}/>, U08:({item})=><RuleEditor item={item}/>, U09:({item})=><Recommendations item={item}/>, U10:({item})=><ApprovalPage item={item}/>, U11:({item})=><FormPage item={item}/>, U12:({item})=><Dashboard item={item}/>, U13:({item})=><FormPage item={item}/>,
  A01:({item})=><Dashboard item={item}/>, A04:({item})=><FormPage item={item}/>, A10:({item})=><PathView item={item}/>, A12:({item})=><ThresholdControl item={item}/>, A14:({item})=><Annotation item={item}/>, A15:({item})=><ProfileInsights item={item}/>, A16:({item})=><PathView item={item}/>, A17:({item})=><Dashboard item={item}/>, A19:({item})=><TemplateEditor item={item}/>, A21:({item})=><ThresholdControl item={item}/>, A22:({item})=><Timeline item={item}/>, A24:({item})=><Permission item={item}/>, A26:({item})=><Dashboard item={item}/>,
};

export default function PrdPageRenderer({item,notify}:{item:SpecificCapabilityItem;notify:Notify}){
  const Custom=custom[item.id];
  if(Custom)return <div data-prd-layout="custom" data-page-id={item.id}><Custom item={item}/></div>;
  return <div data-prd-layout="structured-list" data-page-id={item.id}><SpecificCapabilityPage item={item} notify={notify}/></div>;
}
