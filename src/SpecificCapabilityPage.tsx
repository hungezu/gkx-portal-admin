import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Eye,
  Filter,
  GitBranch,
  MoreHorizontal,
  Network,
  Play,
  Plus,
  RefreshCw,
  Settings,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import type { CapabilityPageSpec } from "./capability-page-specs";
import TemporalControl, { temporalKindForField } from "./TemporalControl";
import { prdPageSpecs } from "./prd-system-pages";

export type SpecificCapabilityItem = {
  id: string;
  groupId: string;
  groupLabel: string;
  label: string;
  description: string;
};

type Notify = (message: string, tone?: "success" | "warning" | "info") => void;

const sourceValues = ["企业信息系统", "专利数据库", "政策采集系统", "科研项目系统"];
const timeValues = ["10:32", "10:18", "09:46", "昨天"];
const statusValues = ["运行中", "已完成", "待复核", "需检查"];

function demoValue(column: string, index: number) {
  if (/(名称|标题|对象|任务|规则|策略|Topic|API|函数|事件簇|主体分群|情报内容|广播标题|流转事项|数据集)$/.test(column)) return "演示记录";
  if (/(来源|源系统|业务系统|调用方|始发节点|目标节点)/.test(column)) return sourceValues[index % sourceValues.length];
  if (/(类型|方式|模式|算法|协议|格式|分类)/.test(column)) return ["实时增量", "标准协议", "自动处理", "规则触发"][index % 4];
  if (/(版本|位点|检查点)/.test(column)) return ["v2.4.1", "v3.2.0", "offset-18426", "cp-1024"][index % 4];
  if (/(状态|结果|健康|发布状态|处理状态)/.test(column)) return statusValues[index % statusValues.length];
  if (/(时间|最近|周期|下次执行)/.test(column)) return timeValues[index % timeValues.length];
  if (/(延迟|耗时|RTO)/.test(column)) return ["180 ms", "420 ms", "1.8 s", "3.2 s"][index % 4];
  if (/(成功率|一致率|覆盖率|完整度|置信度|相似度|命中率)/.test(column)) return ["99.8%", "98.6%", "96.4%", "91.2%"][index % 4];
  if (/(数量|次数|今日|数据量|速率|额度|积压|分区数|样本数|规则数)/.test(column)) return ["1,284", "486", "126", "27"][index % 4];
  if (/(范围|领域|赛道|产业)/.test(column)) return ["八大业务系统", "低空经济", "新型储能", "合成生物"][index % 4];
  if (/(优先级|紧急度|等级|背压级别|风险等级)/.test(column)) return ["高", "S 级", "A 级", "中"][index % 4];
  if (/(人员|负责人|接收对象|目标对象|提交主体|规则所有人|批示人)/.test(column)) return ["产业研究一部", "技术战略组", "政策研究组", "平台运营组"][index % 4];
  if (/(渠道|终端|平台)/.test(column)) return ["站内信", "政务短信", "企业邮箱", "政务微信"][index % 4];
  return ["已配置", "演示值 A", "演示值 B", "—"][index % 4];
}

function fieldValue(field: string) {
  if (/(时间|窗口|周期)/.test(field)) return "30 分钟";
  if (/(阈值|上限|次数|容量|速率|精度)/.test(field)) return "100";
  if (/(范围|系统|对象|渠道|终端|数据源)/.test(field)) return "八大业务系统";
  if (/(算法|模式|策略|方式|条件)/.test(field)) return "按优先级自动执行";
  if (/(版本)/.test(field)) return "v1.0";
  return "已配置";
}

function State({ value }: { value: string }) {
  const tone = /(需检查|异常|失败|阻断)/.test(value) ? "warning" : /(待|运行中)/.test(value) ? "info" : "success";
  return <span className={`kds-specific-state is-${tone}`}>{value}</span>;
}

function Metrics({ labels }: { labels: string[] }) {
  const values = ["98.7%", "1,284", "27", "3.2 s"];
  return <div className={`kds-specific-metrics is-${Math.min(labels.length, 4)}`}>{labels.slice(0, 4).map((label, index) => <div key={label}><span>{label}</span><strong>{values[index]}</strong><small>最近更新 10:35</small></div>)}</div>;
}

function Toolbar({ spec, item, notify }: { spec: CapabilityPageSpec; item: SpecificCapabilityItem; notify: Notify }) {
  const firstFilter = spec.filters?.[0];
  const isSearchPage = spec.mode === "search";
  return <div className="kds-specific-toolbar">
    {firstFilter && (/(时间|日期)/.test(firstFilter) ? <TemporalControl label={firstFilter} kind="date-range" compact /> : <label><input placeholder={`请输入${firstFilter}`} /></label>)}
    {spec.filters?.slice(1, 5).map((filter) => /(时间|日期)/.test(filter) ? <TemporalControl label={filter} kind="date-range" compact key={filter} /> : <button type="button" key={filter}>{filter}<ChevronDown size={15} /></button>)}
    {(spec.filters?.length ?? 0) > 0 && <><button className="kds-button kds-button-primary" type="button" onClick={() => notify("查询完成", "success")}>查询</button><button className="kds-button kds-button-secondary" type="button" onClick={() => notify("筛选条件已重置", "info")}>重置</button></>}
    {!isSearchPage && <button className="kds-button kds-button-primary is-primary-action" type="button" onClick={() => notify(`${item.label}：已执行“${spec.primaryAction}”`, "success")}>
      {spec.primaryAction.includes("刷新") ? <RefreshCw size={16} /> : spec.primaryAction.includes("执行") || spec.primaryAction.includes("启动") ? <Play size={16} /> : <Plus size={16} />}
      {spec.primaryAction}
    </button>}
  </div>;
}

function Steps({ steps }: { steps: string[] }) {
  return <div className="kds-specific-steps">{steps.map((step, index) => <div className={index === 0 ? "is-complete" : index === 1 ? "is-current" : ""} key={step}><span>{index + 1}</span><strong>{step}</strong><small>{index === 0 ? "已完成" : index === 1 ? "进行中" : "等待"}</small></div>)}</div>;
}

function DataTable({ spec, item, notify }: { spec: CapabilityPageSpec; item: SpecificCapabilityItem; notify: Notify }) {
  const columns = spec.columns ?? [];
  const samples = spec.samples ?? [];
  return <div className="kds-specific-table-wrap"><table><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}{(spec.actions?.length ?? 0) > 0 && <th className="is-actions">操作</th>}</tr></thead><tbody>{samples.map((sample, rowIndex) => <tr key={sample}>{columns.map((column, columnIndex) => {
    const isFirst = columnIndex === 0;
    const value = isFirst ? sample : demoValue(column, rowIndex + columnIndex);
    const isState = /(状态|结果)$/.test(column);
    return <td key={column}>{isFirst ? <span className="kds-specific-name">{value}</span> : isState ? <State value={value} /> : value}</td>;
  })}{(spec.actions?.length ?? 0) > 0 && <td className="is-actions">{spec.actions?.slice(0, 2).map((action) => <button type="button" onClick={() => notify(`${item.label}：${action}`, "info")} key={action}>{action}</button>)}{(spec.actions?.length ?? 0) > 2 && <button type="button" aria-label="更多操作"><MoreHorizontal size={17} /></button>}</td>}</tr>)}</tbody></table></div>;
}

function ConfigPage({ spec, item, notify }: { spec: CapabilityPageSpec; item: SpecificCapabilityItem; notify: Notify }) {
  return <div className="kds-specific-config">
    <section className="kds-specific-surface"><header><div><h2>{spec.panelTitle}</h2><p>{item.description}</p></div></header><div className="kds-specific-form">{spec.fields?.map((field, index) => {const temporalKind=temporalKindForField(field);return <label className={index === (spec.fields?.length ?? 0) - 1 && index % 2 === 0 ? "is-wide" : ""} key={field}><span>{field}</span>{temporalKind?<TemporalControl label={field} kind={temporalKind}/>:/(说明|备注|范围规则)/.test(field) ? <textarea defaultValue={fieldValue(field)} /> : /(策略|模式|范围|系统|渠道|算法|条件|方式|版本)/.test(field) ? <button type="button">{fieldValue(field)}<ChevronDown size={15} /></button> : <input defaultValue={fieldValue(field)} />}</label>})}</div>{(spec.steps?.length ?? 0) > 0 && <Steps steps={spec.steps ?? []} />}<footer className="kds-page-action-bar"><button className="kds-button kds-button-secondary" type="button">校验配置</button><button className="kds-button kds-button-primary" type="button" onClick={() => notify(`${item.label}配置已保存`, "success")}>{spec.primaryAction}</button></footer></section>
    <aside className="kds-specific-surface"><header><div><h2>变更记录</h2><p>配置版本与发布状态</p></div></header><div className="kds-specific-history">{[["v12", "当前版本"], ["v11", "已归档"], ["v10", "已归档"]].map((row, index) => <button className={index === 0 ? "is-current" : ""} key={row[0]}><span><strong>{row[0]}</strong><small>{index ? "昨天" : "10:35"}</small></span><State value={row[1]} /></button>)}</div></aside>
  </div>;
}

function TopologyPage({ spec, item, notify }: { spec: CapabilityPageSpec; item: SpecificCapabilityItem; notify: Notify }) {
  return <div className="kds-specific-stack"><Metrics labels={spec.metrics ?? []} /><section className="kds-specific-surface"><header><div><h2>{spec.panelTitle}</h2><p>{item.description}</p></div><button className="kds-button kds-button-secondary" onClick={() => notify("拓扑状态已刷新", "success")}><RefreshCw size={16} />{spec.primaryAction}</button></header><div className="kds-specific-topology"><div className="is-center"><Network size={22} /><strong>{spec.nodes?.[0]}</strong><small>核心节点</small></div>{spec.nodes?.slice(1, 9).map((node, index) => <div className={`is-node n${index + 1}`} key={node}><span className={index === 3 ? "is-warning" : ""} /><strong>{node}</strong><small>{index === 3 ? "需检查" : "连接正常"}</small></div>)}</div></section></div>;
}

function SearchPage({ spec, item, notify }: { spec: CapabilityPageSpec; item: SpecificCapabilityItem; notify: Notify }) {
  return <div className="kds-specific-stack"><Toolbar spec={spec} item={item} notify={notify} /><section className="kds-specific-surface"><header><div><h2>{spec.panelTitle}</h2><p>{item.description}</p></div><button className="kds-button kds-button-secondary"><Filter size={16} />筛选结果</button></header><DataTable spec={spec} item={item} notify={notify} /></section></div>;
}

function StandardPage({ spec, item, notify }: { spec: CapabilityPageSpec; item: SpecificCapabilityItem; notify: Notify }) {
  return <div className="kds-specific-stack">
    {(spec.metrics?.length ?? 0) > 0 && <Metrics labels={spec.metrics ?? []} />}
    {(spec.steps?.length ?? 0) > 0 && <section className="kds-specific-surface"><header><div><h2>{spec.panelTitle}</h2><p>{item.description}</p></div></header><Steps steps={spec.steps ?? []} /></section>}
    <Toolbar spec={spec} item={item} notify={notify} />
    <section className="kds-specific-surface"><header><div><h2>{spec.panelTitle}</h2><p>{item.description}</p></div>{spec.mode === "monitor" && <span className="kds-specific-live"><i />实时更新</span>}</header><DataTable spec={spec} item={item} notify={notify} /></section>
    {spec.mode === "workbench" && <section className="kds-specific-detail"><div><CircleAlert size={18} /><span><strong>当前记录详情</strong><p>选择列表记录后，可在此核对原始信息、处理依据和操作结果。</p></span></div><button className="kds-button kds-button-secondary"><Eye size={16} />查看完整内容</button></section>}
  </div>;
}

export default function SpecificCapabilityPage({ item, notify }: { item: SpecificCapabilityItem; notify: Notify }) {
  const spec = prdPageSpecs[item.id];
  if (!spec) throw new Error(`缺少功能页面规格：${item.id} ${item.label}`);
  return <div className="kds-specific-page" data-page-spec={item.id} data-page-mode={spec.mode}>
    {spec.mode === "config" ? <ConfigPage spec={spec} item={item} notify={notify} /> : spec.mode === "topology" ? <TopologyPage spec={spec} item={item} notify={notify} /> : spec.mode === "search" ? <SearchPage spec={spec} item={item} notify={notify} /> : <StandardPage spec={spec} item={item} notify={notify} />}
  </div>;
}
