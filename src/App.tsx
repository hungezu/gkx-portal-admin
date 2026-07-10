import {
  Activity,
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  ClipboardCheck,
  Copy,
  Database,
  FileBarChart,
  FileText,
  FolderOpen,
  KeyRound,
  LayoutGrid,
  LockKeyhole,
  LogOut,
  Menu,
  MessageSquareMore,
  MoreHorizontal,
  Network,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  Upload,
  Users,
  X,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

type PageKey =
  | "report-management"
  | "workflow-center"
  | "form-center"
  | "audit-content"
  | "event-tracking"
  | "org-management"
  | "user-management"
  | "role-management"
  | "page-management"
  | "resource-management"
  | "permission-config";

type ModalType =
  | "report"
  | "tracking"
  | "user"
  | "role"
  | "page"
  | "delete"
  | null;

type MenuGroup = {
  label: string;
  icon: LucideIcon;
  children: { key: PageKey; label: string }[];
};

const menuGroups: MenuGroup[] = [
  {
    label: "系统管理",
    icon: LayoutGrid,
    children: [
      { key: "report-management", label: "报告管理" },
      { key: "event-tracking", label: "埋点管理" },
    ],
  },
  {
    label: "审核管理",
    icon: ClipboardCheck,
    children: [
      { key: "workflow-center", label: "流程中心" },
      { key: "form-center", label: "表单中心" },
      { key: "audit-content", label: "审核内容管理" },
    ],
  },
  {
    label: "权限管理",
    icon: ShieldCheck,
    children: [
      { key: "org-management", label: "组织管理" },
      { key: "user-management", label: "用户管理" },
      { key: "role-management", label: "角色管理" },
      { key: "page-management", label: "页面管理" },
      { key: "resource-management", label: "资源管理" },
      { key: "permission-config", label: "权限配置" },
    ],
  },
];

const pageTitles: Record<PageKey, { title: string; subtitle: string }> = {
  "report-management": { title: "报告管理", subtitle: "系统管理" },
  "workflow-center": { title: "流程中心", subtitle: "审核管理" },
  "form-center": { title: "表单中心", subtitle: "审核管理" },
  "audit-content": { title: "审核内容管理", subtitle: "审核管理" },
  "event-tracking": { title: "埋点管理", subtitle: "系统管理" },
  "org-management": { title: "组织管理", subtitle: "权限管理" },
  "user-management": { title: "用户管理", subtitle: "权限管理" },
  "role-management": { title: "角色管理", subtitle: "权限管理" },
  "page-management": { title: "页面管理", subtitle: "权限管理" },
  "resource-management": { title: "资源管理", subtitle: "权限管理" },
  "permission-config": { title: "权限配置", subtitle: "权限管理" },
};

const reportTypeOptions = ["TR报告", "战略咨询报告", "洞察分析报告", "未来产业报告"];
const statusOptions = ["启用", "禁用"];
const roleOptions = ["普通用户", "机构用户", "政府用户"];
const resourcePermissionOptions = ["人才库资源", "报告资源", "智库资源"];

const reportRows = [
  { 报告标题: "未来产业报告：智能制造", 报告类型: "未来产业报告", 报告来源: "国科信", 所属领域: "智能制造", 上传时间: "2026-07-08", 内容摘要: "未来产业报告内容摘要", 状态: "上架", 是否置顶: "是" },
  { 报告标题: "TR报告：人工智能", 报告类型: "TR报告", 报告来源: "研究中心", 所属领域: "人工智能", 上传时间: "2026-07-06", 内容摘要: "TR报告内容摘要", 状态: "下架", 是否置顶: "否" },
  { 报告标题: "战略咨询报告：新材料", 报告类型: "战略咨询报告", 报告来源: "战略咨询组", 所属领域: "新材料", 上传时间: "2026-07-01", 内容摘要: "战略咨询报告内容摘要", 状态: "上架", 是否置顶: "否" },
  { 报告标题: "洞察分析报告：低空经济", 报告类型: "洞察分析报告", 报告来源: "洞察分析组", 所属领域: "低空经济", 上传时间: "2026-06-28", 内容摘要: "洞察分析报告内容摘要", 状态: "下架", 是否置顶: "是" },
];

const workflowRows = [
  { 名称: "报告审核流程", 发布时间: "2026-07-08", 发布状态: "发布" },
  { 名称: "认证学者审核流程", 发布时间: "2026-07-05", 发布状态: "下架" },
  { 名称: "评论审核流程", 发布时间: "2026-07-01", 发布状态: "发布" },
];

const commentRows = [
  { 评论内容: "门户论文评论内容", 渠道: "门户论文", 状态: "待审核" },
  { 评论内容: "社区评论内容", 渠道: "社区评论", 状态: "审核通过" },
];

const scholarRows = [
  { 学者姓名: "张明远", 机构: "中国科学院", 职称: "研究员", 手机号: "13800000001" },
  { 学者姓名: "陈思敏", 机构: "北京大学", 职称: "教授", 手机号: "13800000002" },
];

const auditReportRows = [
  { 报告信息: "TR报告：人工智能", 提交人: "张明远" },
  { 报告信息: "未来产业报告：智能制造", 提交人: "陈思敏" },
];

const trackingRows = [
  { 事件ID: "EVT_REPORT_VIEW", 所属功能模块: "报告管理", 埋点标签: "报告查看", 埋点路径: "/report/detail", 触发机制: "点击" },
  { 事件ID: "EVT_USER_REGISTER", 所属功能模块: "用户管理", 埋点标签: "用户注册", 埋点路径: "/user/register", 触发机制: "提交" },
  { 事件ID: "EVT_ROLE_CONFIG", 所属功能模块: "权限配置", 埋点标签: "权限配置", 埋点路径: "/permission/config", 触发机制: "保存" },
];

const orgRows = [
  { 组织姓名: "国科信", 父组织名称: "-" },
  { 组织姓名: "研究中心", 父组织名称: "国科信" },
  { 组织姓名: "战略咨询组", 父组织名称: "研究中心" },
];

const userRows = [
  { 用户ID: "U20260001", 用户姓名: "张明远", 所属组织名称: "研究中心", 手机号: "13800000001", 邮箱: "zhangmingyuan@gkx.cn", 创建时间: "2026-07-01", 账号状态: "启用" },
  { 用户ID: "U20260002", 用户姓名: "陈思敏", 所属组织名称: "战略咨询组", 手机号: "13800000002", 邮箱: "chensimin@gkx.cn", 创建时间: "2026-07-03", 账号状态: "禁用" },
];

const roleRows = [
  { 角色ID: "R001", 角色名称: "普通用户", 角色描述: "普通用户", 状态: "启用", 创建人: "系统管理员", 创建时间: "2026-07-01", 最近修改人: "系统管理员", 最近修改时间: "2026-07-08" },
  { 角色ID: "R002", 角色名称: "机构用户", 角色描述: "机构用户", 状态: "禁用", 创建人: "系统管理员", 创建时间: "2026-07-02", 最近修改人: "系统管理员", 最近修改时间: "2026-07-07" },
  { 角色ID: "R003", 角色名称: "政府用户", 角色描述: "政府用户", 状态: "废弃", 创建人: "系统管理员", 创建时间: "2026-07-03", 最近修改人: "系统管理员", 最近修改时间: "2026-07-06" },
];

const pageRows = [
  { 一级页面: "系统管理", 二级页面: "报告管理", 三级页面: "-", "地址(URL)": "/report-management", 启用属性: "启用" },
  { 一级页面: "审核管理", 二级页面: "流程中心", 三级页面: "-", "地址(URL)": "/workflow-center", 启用属性: "启用" },
  { 一级页面: "权限管理", 二级页面: "资源管理", 三级页面: "接口资源管理", "地址(URL)": "/resource-management/api", 启用属性: "启用" },
];

const apiLogRows = [
  { 调用时间: "2026-07-08 10:00", 调用方IP: "10.0.0.1", 接口地址: "/api/report", 请求参数: "报告类型", 响应结果: "成功", 调用耗时: "120ms", 错误信息: "-" },
  { 调用时间: "2026-07-08 11:00", 调用方IP: "10.0.0.2", 接口地址: "/api/user", 请求参数: "用户ID", 响应结果: "失败", 调用耗时: "320ms", 错误信息: "错误码说明" },
];

const talentRows = [
  { 人才库名称: "人工智能人才库", 描述: "人才库资源", 学者数量: "128", 创建人: "系统管理员" },
  { 人才库名称: "新材料人才库", 描述: "人才库资源", 学者数量: "96", 创建人: "系统管理员" },
];

const reportResourceRows = [
  { 报告类型: "TR报告", 报告名称: "TR报告：人工智能", 报告类型ID: "TR001", 所属学科: "计算机科学", 领域: "人工智能" },
  { 报告类型: "未来产业报告", 报告名称: "未来产业报告：智能制造", 报告类型ID: "FI001", 所属学科: "工程技术", 领域: "智能制造" },
];

function StatusTag({ value }: { value: string }) {
  const tone =
    value.includes("通过") || value === "上架" || value === "启用" || value === "发布" || value === "成功"
      ? "success"
      : value.includes("失败") || value === "下架" || value === "禁用" || value === "废弃"
        ? "danger"
        : value.includes("待")
          ? "warning"
          : "info";
  return <span className={`status-tag ${tone}`}><i />{value}</span>;
}

function Button({
  children,
  variant = "default",
  icon: Icon,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  variant?: "primary" | "default" | "text" | "danger";
  icon?: LucideIcon;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button type={type} className={`btn ${variant}`} onClick={onClick}>
      {Icon && <Icon size={16} strokeWidth={1.9} />}
      {children}
    </button>
  );
}

function ActionLinks({ actions }: { actions: Array<string | false | null | undefined> }) {
  return (
    <div className="inline-actions">
      {actions.filter(Boolean).map((action) => (
        <button key={action as string}>{action}</button>
      ))}
    </div>
  );
}

function FilterInput({ label, placeholder = label }: { label: string; placeholder?: string }) {
  return (
    <label className="search-field">
      <Search size={17} />
      <input aria-label={label} placeholder={placeholder} />
    </label>
  );
}

function FilterSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="select-field">
      <span>{label}</span>
      <select aria-label={label} defaultValue={options[0]}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function SelectField({ label }: { label: string }) {
  return (
    <button className="select-field">
      <span>{label}</span>
      <ChevronDown size={15} />
    </button>
  );
}

function Pagination({ total = 20 }: { total?: number }) {
  return (
    <div className="pagination">
      <span>共 {total} 条</span>
      <button aria-label="上一页"><ChevronLeft size={16} /></button>
      <button className="active">1</button>
      <button>2</button>
      <button aria-label="下一页"><ChevronRight size={16} /></button>
      <SelectField label="10 条/页" />
    </div>
  );
}

function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <header className="card-header">
      <div><h3>{title}</h3>{subtitle && <span>{subtitle}</span>}</div>
      {action}
    </header>
  );
}

function DataTable<T extends Record<string, ReactNode>>({
  columns,
  rows,
  actions,
}: {
  columns: string[];
  rows: T[];
  actions?: (row: T) => ReactNode;
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>{columns.map((column) => <th key={column}>{column}</th>)}{actions && <th>操作</th>}</tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => <td key={column}>{row[column]}</td>)}
              {actions && <td>{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReportManagement({ openModal }: { openModal: (type: ModalType, payload?: string) => void }) {
  return (
    <section className="card page-card">
      <div className="filters">
        <FilterSelect label="报告类型" options={reportTypeOptions} />
        <FilterSelect label="所属领域" options={["人工智能", "智能制造", "新材料", "低空经济"]} />
        <FilterInput label="报告来源" />
        <FilterSelect label="排序规则" options={["上传时间", "报告类型", "所属领域", "报告来源"]} />
        <Button variant="primary">查询</Button>
        <Button>重置</Button>
      </div>
      <div className="table-toolbar">
        <div><Button variant="primary" icon={Upload} onClick={() => openModal("report")}>报告上传</Button></div>
      </div>
      <DataTable
        columns={["报告标题", "报告类型", "报告来源", "所属领域", "上传时间", "内容摘要", "状态", "是否置顶"]}
        rows={reportRows.map((row) => ({ ...row, 原始状态: row.状态, 状态: <StatusTag value={row.状态} /> }))}
        actions={(row) => (
          <ActionLinks actions={[
            row.原始状态 === "下架" ? "报告上架" : "报告下架",
            "信息修改",
            row.原始状态 === "下架" && "报告删除",
            row.是否置顶 === "是" ? "取消置顶" : "置顶",
          ]} />
        )}
      />
      <Pagination total={reportRows.length} />
    </section>
  );
}

function WorkflowCenter() {
  const [selectedNode, setSelectedNode] = useState<"start" | "process" | "cc" | "end">("process");
  const [conditions, setConditions] = useState([{ id: 1 }]);
  const nodeCards: Array<{ key: "start" | "process" | "cc" | "end"; title: string; note?: string; locked?: boolean; active?: boolean }> = [
    { key: "start", title: "流程发起节点", note: "系统默认，不可删除", locked: true },
    { key: "end", title: "流程结束节点", note: "系统默认，不可删除", locked: true },
    { key: "process", title: "流程节点", active: selectedNode === "process" },
    { key: "cc", title: "抄送节点", active: selectedNode === "cc" },
  ];
  const addCondition = () => setConditions((list) => [...list, { id: Date.now() }]);
  const removeCondition = (id: number) => setConditions((list) => (list.length > 1 ? list.filter((item) => item.id !== id) : list));

  return (
    <div className="reports-page">
      <section className="card process-designer">
        <header className="process-designer-header">
          <div className="process-breadcrumb">
            <span>审核管理</span>
            <i>/</i>
            <strong>流程中心</strong>
          </div>
          <Button variant="primary">发布</Button>
        </header>
        <div className="process-designer-main">
          <aside className="node-palette">
            <div className="node-palette-title">流程设计器节点</div>
            <div className="node-list">
              {nodeCards.map((node) => (
                <button
                  key={node.key}
                  type="button"
                  className={`node-card ${node.locked ? "locked" : ""} ${node.active ? "active" : ""}`}
                  onClick={() => !node.locked && setSelectedNode(node.key)}
                  disabled={node.locked}
                >
                  <span className={`node-icon ${node.key}`}>
                    {node.key === "process" ? <CircleUserRound size={16} /> : node.key === "cc" ? <FileText size={16} /> : <i />}
                  </span>
                  <span><b>{node.title}</b>{node.note && <small>{node.note}</small>}</span>
                </button>
              ))}
            </div>
          </aside>

          <section className="designer-canvas" aria-label="流程中心">
            <div className="flow-strip">
              <button className="flow-terminal start" onClick={() => setSelectedNode("start")} aria-label="流程发起节点"><span /></button>
              <i className="flow-connector" />
              <button className={`canvas-node ${selectedNode === "process" ? "active" : ""}`} onClick={() => setSelectedNode("process")}>
                <CircleUserRound size={16} />
                <span>流程节点</span>
              </button>
              <i className="flow-connector" />
              <button className="flow-terminal end" onClick={() => setSelectedNode("end")} aria-label="流程结束节点"><span /></button>
            </div>
          </section>

          <aside className="node-property">
            <div className="node-property-title">节点配置表单</div>
            <div className="node-property-body">
              <label className="designer-field"><span>节点名称</span><input type="text" /></label>
              <label className="designer-field"><span>负责人</span><select multiple><option>普通用户</option><option>机构用户</option><option>政府用户</option></select></label>
              <label className="designer-field"><span>节点提交条件</span><input type="text" /></label>
              <div className="designer-field">
                <span>有多位负责人时</span>
                <div className="radio-stack">
                  <label><input type="radio" name="multi_user" defaultChecked />所有负责人提交后进入下一节点</label>
                  <label><input type="radio" name="multi_user" />任一负责人提交后进入下一节点</label>
                </div>
              </div>
              <label className="designer-field">
                <span>找不到节点负责人时</span>
                <select defaultValue="自动提交当前待办">
                  <option>自动提交当前待办</option>
                  <option>将待办转给指定人员进行处理</option>
                </select>
              </label>
              <div className="condition-panel">
                <h3>按条件流转</h3>
                {conditions.map((condition) => (
                  <div className="condition-row" key={condition.id}>
                    <input type="text" />
                    <select defaultValue="包含"><option>包含</option><option>等于</option></select>
                    <input type="text" />
                    <button type="button" className="delete-condition" onClick={() => removeCondition(condition.id)} aria-label="删除"><Trash2 size={16} /></button>
                  </div>
                ))}
                <button type="button" className="add-condition" onClick={addCondition}><Plus size={14} />添加流转条件</button>
              </div>
            </div>
          </aside>
        </div>
      </section>
      <section className="card page-card">
        <CardHeader title="流程实例" />
        <DataTable columns={["名称", "发布时间", "发布状态"]} rows={workflowRows} actions={() => <ActionLinks actions={["下架", "编辑", "删除", "发布"]} />} />
      </section>
    </div>
  );
}

function FormCenter() {
  const components = ["单行文本", "多行文本", "数字字段", "日期时间", "单选按钮组", "复选框组", "下拉框"];
  return (
    <section className="card page-card">
      <div className="resource-header">
        <div className="resource-tabs"><button className="active">组件</button><button>规则配置</button></div>
        <Button variant="primary" icon={FileText}>打印成表格</Button>
      </div>
      <div className="role-grid">
        {components.map((name) => (
          <article className="role-card" key={name}>
            <div className="role-card-head"><span><FileText size={21} /></span><div><h3>{name}</h3></div></div>
          </article>
        ))}
      </div>
      <section className="card page-card">
        <CardHeader title="规则配置" />
        <form className="modal-form">
          <div className="form-row">
            <FormField label="最大长度"><input type="text" /></FormField>
            <FormField label="最大最小值"><input type="number" /></FormField>
          </div>
          <div className="form-row">
            <FormField label="最大最小日期"><input type="date" /></FormField>
            <FormField label="可选项/多选"><textarea /></FormField>
          </div>
        </form>
      </section>
    </section>
  );
}

function AuditContent() {
  const [tab, setTab] = useState<"comments" | "scholars" | "reports">("comments");
  return (
    <section className="card page-card">
      <div className="subtabs">
        <button className={tab === "comments" ? "active" : ""} onClick={() => setTab("comments")}>评论审核</button>
        <button className={tab === "scholars" ? "active" : ""} onClick={() => setTab("scholars")}>认证学者审核</button>
        <button className={tab === "reports" ? "active" : ""} onClick={() => setTab("reports")}>报告审核</button>
      </div>
      {tab === "comments" && <DataTable columns={["评论内容", "渠道", "状态"]} rows={commentRows.map((row) => ({ ...row, 状态: <StatusTag value={row.状态} /> }))} actions={() => <ActionLinks actions={["审核通过", "审核失败/取消展示"]} />} />}
      {tab === "scholars" && <DataTable columns={["学者姓名", "机构", "职称", "手机号"]} rows={scholarRows} actions={() => <ActionLinks actions={["审核通过", "审核驳回"]} />} />}
      {tab === "reports" && <DataTable columns={["报告信息", "提交人"]} rows={auditReportRows} actions={() => <ActionLinks actions={["审核通过", "审核驳回"]} />} />}
    </section>
  );
}

function EventTracking({ openModal }: { openModal: (type: ModalType, payload?: string) => void }) {
  const [tab, setTab] = useState<"info" | "stats">("info");
  return (
    <section className="card page-card">
      <div className="subtabs">
        <button className={tab === "info" ? "active" : ""} onClick={() => setTab("info")}>埋点信息管理</button>
        <button className={tab === "stats" ? "active" : ""} onClick={() => setTab("stats")}>埋点数据统计</button>
      </div>
      {tab === "info" && (
        <>
          <div className="table-toolbar">
            <div>
              <Button variant="primary" icon={Plus} onClick={() => openModal("tracking")}>新增埋点事件</Button>
              <Button icon={Upload}>批量上传埋点事件</Button>
            </div>
          </div>
          <DataTable columns={["事件ID", "所属功能模块", "埋点标签", "埋点路径", "触发机制"]} rows={trackingRows} actions={() => <ActionLinks actions={["查询", "修改", "删除", "查看详情"]} />} />
        </>
      )}
      {tab === "stats" && (
        <>
          <div className="filters">
            <FilterSelect label="时间区间" options={["年", "月", "日"]} />
            <Button variant="primary">查询</Button>
          </div>
          <div className="stat-grid">
            {["事件总量", "活跃用户数", "事件排行", "事件增长趋势", "事件转化率"].map((label) => (
              <article className="stat-card" key={label}>
                <div className="stat-icon"><BarChart3 size={22} /></div>
                <div className="stat-copy"><span>{label}</span><strong>--</strong></div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function OrgManagement() {
  return (
    <section className="card page-card">
      <div className="filters">
        <FilterInput label="组织检索" placeholder="组织检索" />
        <Button variant="primary">查询</Button>
        <Button icon={Network}>组织数据对接</Button>
      </div>
      <DataTable columns={["组织姓名", "父组织名称"]} rows={orgRows} />
    </section>
  );
}

function UserManagement({ openModal }: { openModal: (type: ModalType, payload?: string) => void }) {
  return (
    <section className="card page-card">
      <div className="filters">
        <FilterInput label="用户检索" placeholder="用户检索" />
        <Button variant="primary">查询</Button>
        <Button icon={Network}>用户数据对接</Button>
        <Button variant="primary" icon={Plus} onClick={() => openModal("user")}>用户注册</Button>
      </div>
      <DataTable columns={["用户ID", "用户姓名", "所属组织名称", "手机号", "邮箱", "创建时间", "账号状态"]} rows={userRows.map((row) => ({ ...row, 原始账号状态: row.账号状态, 账号状态: <StatusTag value={row.账号状态} /> }))} actions={(row) => <ActionLinks actions={[row.原始账号状态 === "启用" ? "禁用" : "启用", "查看详情"]} />} />
      <Pagination total={userRows.length} />
    </section>
  );
}

function RoleManagement({ openModal }: { openModal: (type: ModalType, payload?: string) => void }) {
  return (
    <section className="card page-card">
      <div className="filters">
        <FilterInput label="角色ID" placeholder="角色ID" />
        <FilterInput label="角色名称" placeholder="角色名称" />
        <FilterSelect label="状态" options={["启用", "禁用", "废弃"]} />
        <Button variant="primary">查询</Button>
        <Button variant="primary" icon={Plus} onClick={() => openModal("role")}>新建</Button>
      </div>
      <DataTable
        columns={["角色ID", "角色名称", "角色描述", "状态", "创建人", "创建时间", "最近修改人", "最近修改时间"]}
        rows={roleRows.map((row) => ({ ...row, 原始状态: row.状态, 状态: <StatusTag value={row.状态} /> }))}
        actions={(row) => <ActionLinks actions={["编辑", row.原始状态 === "废弃" && "删除", "权限配置"]} />}
      />
    </section>
  );
}

function PageManagement({ openModal }: { openModal: (type: ModalType, payload?: string) => void }) {
  return (
    <section className="card page-card">
      <div className="table-toolbar">
        <div><Button variant="primary" icon={Plus} onClick={() => openModal("page")}>新建/修改页面</Button></div>
      </div>
      <DataTable columns={["一级页面", "二级页面", "三级页面", "地址(URL)", "启用属性"]} rows={pageRows.map((row) => ({ ...row, 启用属性: <StatusTag value={row.启用属性} /> }))} actions={() => <ActionLinks actions={["修改", "删除"]} />} />
    </section>
  );
}

function ResourceManagement() {
  const [tab, setTab] = useState<"api" | "talent" | "report" | "thinktank">("api");
  return (
    <section className="card page-card">
      <div className="resource-tabs">
        <button className={tab === "api" ? "active" : ""} onClick={() => setTab("api")}>接口资源管理</button>
        <button className={tab === "talent" ? "active" : ""} onClick={() => setTab("talent")}>人才库资源</button>
        <button className={tab === "report" ? "active" : ""} onClick={() => setTab("report")}>报告资源</button>
        <button className={tab === "thinktank" ? "active" : ""} onClick={() => setTab("thinktank")}>智库资源</button>
      </div>
      {tab === "api" && <ApiResources />}
      {tab === "talent" && <TalentPoolResources />}
      {tab === "report" && <ReportResources />}
      {tab === "thinktank" && <ThinkTankResources />}
    </section>
  );
}

function ApiResources() {
  return (
    <div className="reports-page">
      <section className="card page-card">
        <CardHeader title="令牌管理" />
        <div className="table-toolbar">
          <div><Button>生成</Button><Button>存储</Button><Button>注销</Button><Button icon={Copy}>复制令牌字符串</Button></div>
        </div>
        <div className="selected-person"><span>••••••••••••••••</span></div>
      </section>
      <section className="card page-card">
        <CardHeader title="接口调用文档展示" />
        <div className="filters">
          <FilterInput label="模块 / 路径 / 关键词" placeholder="模块 / 路径 / 关键词" />
          <Button variant="primary">查询</Button>
        </div>
        <DataTable
          columns={["接口名称", "请求方法", "参数列表", "返回格式", "示例请求", "响应结果", "错误码说明"]}
          rows={[
            { 接口名称: "报告管理", 请求方法: "GET", 参数列表: "报告类型", 返回格式: "JSON", 示例请求: "/api/report", 响应结果: "成功", 错误码说明: "错误码说明" },
            { 接口名称: "用户管理", 请求方法: "POST", 参数列表: "用户ID", 返回格式: "JSON", 示例请求: "/api/user", 响应结果: "成功", 错误码说明: "错误码说明" },
          ]}
        />
      </section>
      <section className="card page-card">
        <CardHeader title="接口调用日志" />
        <div className="filters">
          <FilterInput label="时间范围" placeholder="时间范围" />
          <FilterSelect label="调用结果" options={["成功", "失败"]} />
          <FilterInput label="接口名称" placeholder="接口名称" />
          <Button variant="primary">查询</Button>
        </div>
        <DataTable columns={["调用时间", "调用方IP", "接口地址", "请求参数", "响应结果", "调用耗时", "错误信息"]} rows={apiLogRows.map((row) => ({ ...row, 响应结果: <StatusTag value={row.响应结果} /> }))} />
      </section>
    </div>
  );
}

function TalentPoolResources() {
  return (
    <div className="split-page">
      <aside className="card org-tree">
        <CardHeader title="目录树" />
        <div className="table-toolbar"><div><Button>新增</Button><Button>编辑</Button><Button>删除</Button></div></div>
        <div className="tree-list">
          <button className="active"><FolderOpen size={16} /><span>人工智能人才库</span></button>
          <button><FolderOpen size={16} /><span>新材料人才库</span></button>
        </div>
      </aside>
      <section className="card page-card">
        <DataTable columns={["人才库名称", "描述", "学者数量", "创建人"]} rows={talentRows} actions={() => <ActionLinks actions={["查看", "新增", "编辑", "禁用", "删除"]} />} />
      </section>
    </div>
  );
}

function ReportResources() {
  return (
    <section className="card page-card">
      <div className="table-toolbar"><div><Button>新增</Button></div></div>
      <DataTable columns={["报告类型", "报告名称", "报告类型ID", "所属学科", "领域"]} rows={reportResourceRows} actions={() => <ActionLinks actions={["新增", "编辑", "删除"]} />} />
    </section>
  );
}

function ThinkTankResources() {
  return (
    <section className="card page-card">
      <CardHeader title="智库资源" subtitle="支持其他子系统的数据维护" />
      <div className="table-toolbar"><div><Button>新增</Button><Button>查看</Button><Button>编辑</Button><Button>删除</Button></div></div>
    </section>
  );
}

function PermissionConfig() {
  return (
    <section className="card permission-page">
      <div className="permission-top">
        <div><span>用户分配</span><small>普通用户 / 机构用户 / 政府用户</small></div>
        <div><Button variant="primary">保存配置</Button></div>
      </div>
      <div className="permission-content">
        <aside className="permission-menus">
          <h3>用户分配</h3>
          {userRows.map((user) => <button key={user.用户ID}><CircleUserRound size={17} /><span>{user.用户姓名}</span><ChevronRight size={15} /></button>)}
        </aside>
        <div className="permission-table">
          <div className="data-scope">
            <h3>用户分配</h3>
            <div>{roleOptions.map((role) => <label key={role}><input type="checkbox" defaultChecked={role === "普通用户"} /><span><b>{role}</b></span></label>)}</div>
          </div>
          <div className="data-scope">
            <h3>角色分配</h3>
            <p>页面权限</p>
            <div>{menuGroups.flatMap((group) => group.children).map((page) => <label key={page.key}><input type="checkbox" defaultChecked /><span><b>{page.label}</b><small>If a page is marked 'disabled' in Page Management, it overrides this setting.</small></span></label>)}</div>
          </div>
          <div className="data-scope">
            <h3>资源权限</h3>
            <div>{resourcePermissionOptions.map((resource) => <label key={resource}><input type="checkbox" defaultChecked /><span><b>{resource}</b></span></label>)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Modal({ type, payload, close }: { type: ModalType; payload: string; close: () => void }) {
  if (!type) return null;
  if (type === "delete") return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="modal confirm-modal">
        <button className="modal-close" onClick={close}><X size={18} /></button>
        <div className="confirm-icon"><Trash2 size={24} /></div>
        <h2>删除</h2>
        <p>{payload}</p>
        <div className="modal-footer"><Button onClick={close}>取消</Button><Button variant="danger" onClick={close}>删除</Button></div>
      </div>
    </div>
  );
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="modal form-modal">
        {type === "report" && <ReportModal close={close} />}
        {type === "tracking" && <TrackingModal close={close} />}
        {type === "user" && <UserModal close={close} />}
        {type === "role" && <RoleModal close={close} />}
        {type === "page" && <PageModal close={close} />}
      </div>
    </div>
  );
}

function ReportModal({ close }: { close: () => void }) {
  return (
    <>
      <ModalHeader title="报告上传/信息修改" close={close} />
      <form className="modal-form" onSubmit={(e) => { e.preventDefault(); close(); }}>
        <FormField label="PDF格式文件"><input type="file" accept="application/pdf" /></FormField>
        <div className="form-row">
          <FormField label="报告标题"><input /></FormField>
          <FormField label="报告类型"><select>{reportTypeOptions.map((type) => <option key={type}>{type}</option>)}</select></FormField>
        </div>
        <div className="form-row">
          <FormField label="报告来源"><input /></FormField>
          <FormField label="所属领域"><select><option>人工智能</option><option>智能制造</option><option>新材料</option><option>低空经济</option></select></FormField>
        </div>
        <FormField label="上传时间"><input type="date" /></FormField>
        <FormField label="内容摘要"><textarea /></FormField>
        <div className="modal-footer"><Button onClick={close}>取消</Button><Button type="submit" variant="primary">保存</Button></div>
      </form>
    </>
  );
}

function TrackingModal({ close }: { close: () => void }) {
  return (
    <>
      <ModalHeader title="新增埋点事件" close={close} />
      <form className="modal-form" onSubmit={(e) => { e.preventDefault(); close(); }}>
        <FormField label="事件ID"><input /></FormField>
        <FormField label="所属功能模块"><input /></FormField>
        <FormField label="埋点标签"><input /></FormField>
        <FormField label="埋点路径"><input /></FormField>
        <FormField label="触发机制"><input /></FormField>
        <div className="modal-footer"><Button onClick={close}>取消</Button><Button type="submit" variant="primary">保存</Button></div>
      </form>
    </>
  );
}

function UserModal({ close }: { close: () => void }) {
  return (
    <>
      <ModalHeader title="用户注册" close={close} />
      <form className="modal-form" onSubmit={(e) => { e.preventDefault(); close(); }}>
        <FormField label="用户姓名"><input /></FormField>
        <FormField label="手机号"><input /></FormField>
        <FormField label="邮箱"><input /></FormField>
        <FormField label="所属组织"><input /></FormField>
        <div className="modal-footer"><Button onClick={close}>取消</Button><Button type="submit" variant="primary">保存</Button></div>
      </form>
    </>
  );
}

function RoleModal({ close }: { close: () => void }) {
  return (
    <>
      <ModalHeader title="新建/编辑" close={close} />
      <form className="modal-form" onSubmit={(e) => { e.preventDefault(); close(); }}>
        <FormField label="角色名称"><input /></FormField>
        <FormField label="角色描述"><textarea /></FormField>
        <FormField label="状态"><select>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></FormField>
        <div className="modal-footer"><Button onClick={close}>取消</Button><Button type="submit" variant="primary">保存</Button></div>
      </form>
    </>
  );
}

function PageModal({ close }: { close: () => void }) {
  return (
    <>
      <ModalHeader title="新建/修改页面" close={close} />
      <form className="modal-form" onSubmit={(e) => { e.preventDefault(); close(); }}>
        <FormField label="标题"><input /></FormField>
        <FormField label="地址(URL)"><input /></FormField>
        <FormField label="父页面"><input /></FormField>
        <FormField label="启用属性"><select>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></FormField>
        <div className="modal-footer"><Button onClick={close}>取消</Button><Button type="submit" variant="primary">保存</Button></div>
      </form>
    </>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return <label className="form-field"><span>{required && <em>*</em>}{label}</span>{children}</label>;
}

function ModalHeader({ title, subtitle, close }: { title: string; subtitle?: string; close: () => void }) {
  return <header className="modal-header"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div><button onClick={close}><X size={20} /></button></header>;
}

function Sidebar({ active, setActive, collapsed, setCollapsed }: { active: PageKey; setActive: (p: PageKey) => void; collapsed: boolean; setCollapsed: (v: boolean) => void }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 系统管理: true, 审核管理: true, 权限管理: true });
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="brand">
        <img src="./assets/gkx-logo.png" alt="国科信" />
        {!collapsed && <strong>门户管理系统</strong>}
      </div>
      <button className="sidebar-fold" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "展开侧栏" : "收起侧栏"}>
        <img src={collapsed ? "./assets/sidebar-collapsed.svg" : "./assets/sidebar-expanded.svg"} alt="" />
      </button>
      <nav>
        {menuGroups.map((group) => {
          const GroupIcon = group.icon;
          const isOpen = expanded[group.label];
          const hasActive = group.children.some((x) => x.key === active);
          return <div className={`nav-group ${hasActive ? "has-active" : ""}`} key={group.label}>
            <button className="group-button" title={collapsed ? group.label : undefined} onClick={() => collapsed ? setActive(group.children[0].key) : setExpanded({ ...expanded, [group.label]: !isOpen })}><GroupIcon size={19} />{!collapsed && <><span>{group.label}</span><ChevronDown className={isOpen ? "rotate" : ""} size={15} /></>}</button>
            {!collapsed && isOpen && <div className="group-children">{group.children.map((item) => <button className={active === item.key ? "active" : ""} onClick={() => setActive(item.key)} key={item.key}><i />{item.label}{active === item.key && <span />}</button>)}</div>}
          </div>;
        })}
      </nav>
      <div className="sidebar-footer"><button><Settings size={18} />{!collapsed && <span>系统设置</span>}</button></div>
    </aside>
  );
}

function TopBar({ collapsed, onMenu, onSearch }: { collapsed: boolean; onMenu: () => void; onSearch: () => void }) {
  const [notifications, setNotifications] = useState(false);
  const [profile, setProfile] = useState(false);
  return (
    <header className={`topbar ${collapsed ? "wide" : ""}`}>
      <button className="mobile-menu" onClick={onMenu}><Menu size={20} /></button>
      <button className="global-search" onClick={onSearch}><Search size={17} /><span>搜索菜单</span><kbd>⌘ K</kbd></button>
      <div className="top-actions">
        <button className="top-link"><MessageSquareMore size={16} /><span>帮助</span></button>
        <button className="top-link"><LayoutGrid size={16} /><span>应用</span></button>
        <div className="popover-wrap">
          <button className="top-icon" onClick={() => { setNotifications(!notifications); setProfile(false); }}><Bell size={19} /><i /></button>
          {notifications && <div className="popover notification-pop"><header><b>消息通知</b><button>全部已读</button></header>{[["报告管理", "报告审核", "2分钟前"], ["审核管理", "流程中心", "1小时前"], ["埋点管理", "埋点数据统计", "昨天"]].map(([t, d, time], i) => <div className="notice-item" key={t}><span className={`notice-icon n${i + 1}`}>{i === 0 ? <FileBarChart size={16} /> : i === 1 ? <ClipboardCheck size={16} /> : <Activity size={16} />}</span><div><b>{t}</b><p>{d}</p><small>{time}</small></div></div>)}<footer>查看全部通知 <ChevronRight size={14} /></footer></div>}
        </div>
        <div className="popover-wrap">
          <button className="profile-button" onClick={() => { setProfile(!profile); setNotifications(false); }}><img src="./assets/user-avatar.png" alt="系统管理员" /><b>系统管理员</b><ChevronDown size={12} /></button>
          {profile && <div className="popover profile-pop"><button><CircleUserRound size={16} />个人中心</button><button><LockKeyhole size={16} />修改密码</button><i /><button className="logout"><LogOut size={16} />退出登录</button></div>}
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const [active, setActive] = useState<PageKey>("report-management");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modal, setModal] = useState<{ type: ModalType; payload: string }>({ type: null, payload: "" });
  const [command, setCommand] = useState(false);
  const current = pageTitles[active];
  const openModal = (type: ModalType, payload = "") => setModal({ type, payload });
  const page = useMemo(() => {
    if (active === "report-management") return <ReportManagement openModal={openModal} />;
    if (active === "workflow-center") return <WorkflowCenter />;
    if (active === "form-center") return <FormCenter />;
    if (active === "audit-content") return <AuditContent />;
    if (active === "event-tracking") return <EventTracking openModal={openModal} />;
    if (active === "org-management") return <OrgManagement />;
    if (active === "user-management") return <UserManagement openModal={openModal} />;
    if (active === "role-management") return <RoleManagement openModal={openModal} />;
    if (active === "page-management") return <PageManagement openModal={openModal} />;
    if (active === "resource-management") return <ResourceManagement />;
    return <PermissionConfig />;
  }, [active]);
  const go = (key: PageKey) => { setActive(key); setMobileOpen(false); };
  return (
    <div className={`app-shell ${collapsed ? "is-sidebar-collapsed" : ""}`}>
      <div className={mobileOpen ? "mobile-sidebar open" : "mobile-sidebar"}><Sidebar active={active} setActive={go} collapsed={collapsed} setCollapsed={setCollapsed} /></div>
      {mobileOpen && <button className="mobile-overlay" onClick={() => setMobileOpen(false)} aria-label="关闭导航" />}
      <TopBar collapsed={collapsed} onMenu={() => setMobileOpen(!mobileOpen)} onSearch={() => setCommand(true)} />
      <main className={collapsed ? "main collapsed" : "main"}>
        <div className="page-heading"><p><img src="./assets/breadcrumb-home.svg" alt="" /> <span>/</span> {current.title}</p></div>
        <div className="page-content">
          <div className="page-title-block"><h1>{current.title}</h1><span>{current.subtitle}</span></div>
          <div className="page-body">{page}</div>
        </div>
      </main>
      <Modal type={modal.type} payload={modal.payload} close={() => setModal({ type: null, payload: "" })} />
      {command && <div className="modal-backdrop command-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setCommand(false)}><div className="command-box"><label><Search size={20} /><input autoFocus placeholder="搜索菜单…" /><kbd>ESC</kbd></label><p>快速导航</p><div>{menuGroups.flatMap(g => g.children).map(item => <button key={item.key} onClick={() => { go(item.key); setCommand(false); }}><span><LayoutGrid size={16} />{item.label}</span><small>菜单 <ChevronRight size={14} /></small></button>)}</div></div></div>}
    </div>
  );
}
