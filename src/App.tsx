import {
  Activity,
  BarChart3,
  Bell,
  BookOpenCheck,
  Boxes,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleUserRound,
  ClipboardCheck,
  Clock3,
  Download,
  Edit3,
  FileBarChart,
  FileCheck2,
  FileText,
  Filter,
  FolderOpen,
  Gauge,
  GitBranch,
  GripVertical,
  Home,
  KeyRound,
  LayoutGrid,
  ListFilter,
  LockKeyhole,
  LogOut,
  Mail,
  Menu,
  MessageSquareMore,
  MonitorUp,
  MoreHorizontal,
  Network,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
  Upload,
  UserCheck,
  UserCog,
  Users,
  X,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

type PageKey =
  | "dashboard"
  | "events"
  | "approval-content"
  | "approval-form"
  | "approval-process"
  | "users"
  | "roles"
  | "permission"
  | "menus"
  | "resources"
  | "reports";

type ModalType =
  | "event"
  | "user"
  | "role"
  | "permission"
  | "approval"
  | "delete"
  | "resource"
  | null;

type MenuGroup = {
  label: string;
  icon: LucideIcon;
  children: { key: PageKey; label: string }[];
};

const menuGroups: MenuGroup[] = [
  {
    label: "活动管理",
    icon: CalendarDays,
    children: [
      { key: "dashboard", label: "数据看板" },
      { key: "events", label: "活动列表" },
    ],
  },
  {
    label: "审批管理",
    icon: ClipboardCheck,
    children: [
      { key: "approval-content", label: "内容审批" },
      { key: "approval-form", label: "表单审批" },
      { key: "approval-process", label: "流程配置" },
    ],
  },
  {
    label: "组织与权限",
    icon: ShieldCheck,
    children: [
      { key: "users", label: "用户管理" },
      { key: "roles", label: "角色管理" },
      { key: "permission", label: "权限配置" },
    ],
  },
  {
    label: "门户配置",
    icon: LayoutGrid,
    children: [
      { key: "menus", label: "菜单管理" },
      { key: "resources", label: "资源管理" },
      { key: "reports", label: "报告管理" },
    ],
  },
];

const pageTitles: Record<PageKey, { title: string; subtitle: string }> = {
  dashboard: { title: "活动数据看板", subtitle: "实时掌握门户活动发布与参与情况" },
  events: { title: "活动列表", subtitle: "管理门户活动的创建、发布与归档" },
  "approval-content": { title: "内容审批", subtitle: "审核门户文章、专题与活动内容" },
  "approval-form": { title: "表单审批", subtitle: "处理用户提交的业务申请" },
  "approval-process": { title: "流程配置", subtitle: "配置审批节点、条件与处理人" },
  users: { title: "用户管理", subtitle: "管理平台用户、部门及账户状态" },
  roles: { title: "角色管理", subtitle: "维护角色与数据权限范围" },
  permission: { title: "权限配置", subtitle: "精细配置菜单、操作和数据权限" },
  menus: { title: "菜单管理", subtitle: "配置门户导航结构与展示顺序" },
  resources: { title: "资源管理", subtitle: "统一管理图片、视频和文档素材" },
  reports: { title: "报告管理", subtitle: "查看并导出平台运营分析报告" },
};

const eventRows = [
  { id: "HD20260018", name: "2026科技创新成果交流会", category: "会议论坛", organizer: "科技发展部", start: "2026-07-18", status: "报名中", count: 328 },
  { id: "HD20260017", name: "人工智能赋能产业升级专题讲座", category: "专题讲座", organizer: "信息研究院", start: "2026-07-15", status: "已发布", count: 216 },
  { id: "HD20260016", name: "青年科技人才创新沙龙", category: "交流沙龙", organizer: "人才工作部", start: "2026-07-12", status: "报名中", count: 156 },
  { id: "HD20260015", name: "新质生产力与未来产业研讨会", category: "会议论坛", organizer: "战略规划部", start: "2026-07-06", status: "已结束", count: 482 },
  { id: "HD20260014", name: "国家科研项目申报政策解读", category: "政策宣讲", organizer: "项目管理部", start: "2026-06-28", status: "已结束", count: 631 },
  { id: "HD20260013", name: "科技成果转化实务培训班", category: "专业培训", organizer: "成果转化部", start: "2026-06-21", status: "草稿", count: 0 },
];

const approvalRows = [
  { id: "SP2026070901", title: "关于举办2026科技创新成果交流会的通知", type: "活动", submitter: "张明远", department: "科技发展部", time: "2026-07-09 10:32", status: "待审批" },
  { id: "SP2026070807", title: "人工智能赋能产业升级专题文章", type: "文章", submitter: "陈思敏", department: "信息研究院", time: "2026-07-08 16:20", status: "待审批" },
  { id: "SP2026070806", title: "青年科技人才创新沙龙专题页", type: "专题", submitter: "王晓峰", department: "人才工作部", time: "2026-07-08 14:05", status: "已通过" },
  { id: "SP2026070703", title: "科研项目申报政策解读报名表", type: "表单", submitter: "刘雨晴", department: "项目管理部", time: "2026-07-07 11:48", status: "已驳回" },
  { id: "SP2026070609", title: "六月科技资讯月度汇编", type: "文章", submitter: "周予安", department: "办公室", time: "2026-07-06 09:16", status: "已通过" },
];

const userRows = [
  { name: "张明远", account: "zhangmingyuan", department: "科技发展部", role: "内容管理员", phone: "138****6221", last: "2026-07-09 14:26", status: "正常", color: "#5b8ff9" },
  { name: "陈思敏", account: "chensimin", department: "信息研究院", role: "审批人员", phone: "136****9058", last: "2026-07-09 13:08", status: "正常", color: "#61d9a7" },
  { name: "王晓峰", account: "wangxiaofeng", department: "人才工作部", role: "部门管理员", phone: "159****3166", last: "2026-07-08 17:42", status: "正常", color: "#f6bd16" },
  { name: "刘雨晴", account: "liuyuqing", department: "项目管理部", role: "普通用户", phone: "188****4570", last: "2026-07-08 11:21", status: "停用", color: "#7262fd" },
  { name: "周予安", account: "zhouyuan", department: "办公室", role: "内容管理员", phone: "135****2735", last: "2026-07-07 15:55", status: "正常", color: "#78d3f8" },
];

function StatusTag({ value }: { value: string }) {
  const tone =
    value.includes("通过") || value === "正常" || value === "已发布"
      ? "success"
      : value.includes("驳回") || value === "停用"
        ? "danger"
        : value.includes("待") || value === "报名中"
          ? "warning"
          : value === "草稿"
            ? "neutral"
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

function TableActions({ onEdit, onDelete, onView }: { onEdit?: () => void; onDelete?: () => void; onView?: () => void }) {
  return (
    <div className="table-actions">
      {onView && <button aria-label="详情" onClick={onView}>详情</button>}
      {onEdit && <button aria-label="编辑" onClick={onEdit}>编辑</button>}
      {onDelete && <button aria-label="删除" className="danger-action" onClick={onDelete}>删除</button>}
    </div>
  );
}

function SearchFilters({ placeholder = "请输入关键词搜索", children }: { placeholder?: string; children?: ReactNode }) {
  return (
    <div className="filters">
      <label className="search-field">
        <Search size={17} />
        <input placeholder={placeholder} />
      </label>
      {children}
      <Button variant="primary">查询</Button>
      <Button>重置</Button>
    </div>
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

function Pagination({ total = 68 }: { total?: number }) {
  return (
    <div className="pagination">
      <span>共 {total} 条</span>
      <button aria-label="上一页"><ChevronLeft size={16} /></button>
      <button className="active">1</button>
      <button>2</button>
      <button>3</button>
      <button>4</button>
      <button aria-label="下一页"><ChevronRight size={16} /></button>
      <SelectField label="10 条/页" />
    </div>
  );
}

function ChartLines() {
  return (
    <svg className="line-chart" viewBox="0 0 720 230" preserveAspectRatio="none" role="img" aria-label="近七日活动访问趋势">
      <defs>
        <linearGradient id="areaA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4180fd" stopOpacity=".25" />
          <stop offset="100%" stopColor="#4180fd" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[30, 76, 122, 168, 214].map((y) => <line key={y} x1="36" x2="700" y1={y} y2={y} stroke="#e8edf5" strokeDasharray="4 5" />)}
      <path d="M36,176 C90,152 112,170 164,135 S248,152 310,98 S405,123 458,72 S560,108 610,58 S670,84 700,42 L700,214 L36,214 Z" fill="url(#areaA)" />
      <path d="M36,176 C90,152 112,170 164,135 S248,152 310,98 S405,123 458,72 S560,108 610,58 S670,84 700,42" fill="none" stroke="#4180fd" strokeWidth="3" strokeLinecap="round" />
      {[["周四", 36], ["周五", 146], ["周六", 256], ["周日", 366], ["周一", 476], ["周二", 586], ["周三", 696]].map(([t, x]) => <text key={t} x={x} y="228" textAnchor="middle" fontSize="11" fill="#86909c">{t}</text>)}
    </svg>
  );
}

function Dashboard() {
  const stats = [
    { label: "活动总数", value: "1,286", trend: "12.5%", icon: CalendarDays, tone: "blue" },
    { label: "本月新增", value: "86", trend: "8.2%", icon: Sparkles, tone: "violet" },
    { label: "累计报名", value: "32,810", trend: "16.8%", icon: Users, tone: "green" },
    { label: "待审批内容", value: "24", trend: "较昨日 -6", icon: Clock3, tone: "orange" },
  ];
  return (
    <div className="dashboard-page">
      <div className="stat-grid">
        {stats.map(({ label, value, trend, icon: Icon, tone }) => (
          <article className="stat-card" key={label}>
            <div className={`stat-icon ${tone}`}><Icon size={22} /></div>
            <div className="stat-copy">
              <span>{label}</span>
              <strong>{value}</strong>
              <small><TrendingUp size={13} /> {trend} <em>较上月</em></small>
            </div>
          </article>
        ))}
      </div>
      <div className="dashboard-grid">
        <section className="card chart-card wide">
          <CardHeader title="访问与报名趋势" subtitle="近 7 日数据" action={<SelectField label="近 7 天" />} />
          <div className="chart-legend"><span><i className="blue-dot" />访问量</span><span><i className="cyan-dot" />报名量</span></div>
          <ChartLines />
        </section>
        <section className="card category-card">
          <CardHeader title="活动类型分布" subtitle="共 1,286 场" />
          <div className="donut-wrap">
            <div className="donut"><div><strong>1,286</strong><span>活动总数</span></div></div>
            <ul className="donut-legend">
              {[
                ["会议论坛", "35%", "#4180fd"],
                ["专题讲座", "28%", "#58a8f9"],
                ["交流沙龙", "21%", "#fd7e03"],
                ["专业培训", "16%", "#4dd164"],
              ].map(([n, p, c]) => <li key={n}><span><i style={{ background: c }} />{n}</span><strong>{p}</strong></li>)}
            </ul>
          </div>
        </section>
        <section className="card activity-rank wide">
          <CardHeader title="热门活动排行" subtitle="按报名人数排序" action={<Button variant="text">查看全部 <ChevronRight size={15} /></Button>} />
          <div className="rank-list">
            {eventRows.slice(0, 5).map((event, i) => (
              <div className="rank-row" key={event.id}>
                <b className={i < 3 ? `top top-${i + 1}` : ""}>{i + 1}</b>
                <div><strong>{event.name}</strong><small>{event.organizer} · {event.start}</small></div>
                <div className="progress"><i style={{ width: `${92 - i * 13}%` }} /></div>
                <span>{event.count} 人</span>
              </div>
            ))}
          </div>
        </section>
        <section className="card quick-card">
          <CardHeader title="快捷入口" />
          <div className="quick-grid">
            {[["发布活动", Plus, "blue"], ["发起审批", FileCheck2, "violet"], ["上传资源", Upload, "green"], ["生成报告", FileBarChart, "orange"]].map(([n, Icon, tone]) => {
              const QuickIcon = Icon as LucideIcon;
              return <button key={n as string}><span className={`quick-icon ${tone}`}><QuickIcon size={20} /></span><b>{n as string}</b><ChevronRight size={15} /></button>;
            })}
          </div>
        </section>
      </div>
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

function EventList({ openModal }: { openModal: (type: ModalType, payload?: string) => void }) {
  return (
    <section className="card page-card">
      <SearchFilters placeholder="活动名称 / 活动编号">
        <SelectField label="全部类型" />
        <SelectField label="全部状态" />
        <button className="date-field"><CalendarDays size={16} />开始日期 - 结束日期</button>
      </SearchFilters>
      <div className="table-toolbar">
        <div><Button variant="primary" icon={Plus} onClick={() => openModal("event")}>新建活动</Button><Button icon={Upload}>批量导入</Button><Button icon={Download}>导出</Button></div>
        <button className="icon-btn" title="刷新"><RefreshCw size={17} /></button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th><input type="checkbox" /></th><th>活动编号</th><th>活动名称</th><th>类型</th><th>主办部门</th><th>开始日期</th><th>报名人数</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            {eventRows.map((row) => (
              <tr key={row.id}>
                <td><input type="checkbox" /></td><td className="code-cell">{row.id}</td><td><div className="title-cell">{row.name}</div></td><td>{row.category}</td><td>{row.organizer}</td><td>{row.start}</td><td>{row.count}</td><td><StatusTag value={row.status} /></td>
                <td><TableActions onView={() => openModal("approval", row.name)} onEdit={() => openModal("event", row.name)} onDelete={() => openModal("delete", row.name)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination total={68} />
    </section>
  );
}

function ApprovalList({ mode, openModal }: { mode: "content" | "form"; openModal: (type: ModalType, payload?: string) => void }) {
  return (
    <section className="card page-card">
      <div className="subtabs"><button className="active">全部 <span>24</span></button><button>待我审批 <span>8</span></button><button>我已审批</button><button>我发起的</button></div>
      <SearchFilters placeholder={mode === "content" ? "标题 / 审批编号" : "申请人 / 申请单号"}>
        <SelectField label={mode === "content" ? "全部内容类型" : "全部申请类型"} />
        <SelectField label="全部状态" />
      </SearchFilters>
      <div className="table-wrap">
        <table>
          <thead><tr><th>审批编号</th><th>{mode === "content" ? "内容标题" : "申请事项"}</th><th>类型</th><th>提交人</th><th>所属部门</th><th>提交时间</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            {approvalRows.map((row, i) => (
              <tr key={row.id}>
                <td className="code-cell">{row.id}</td><td><div className="title-cell">{mode === "form" ? ["会议室使用申请", "门户账号权限申请", "宣传材料发布申请", "外部资源转载申请", "数据导出申请"][i] : row.title}</div></td>
                <td>{mode === "form" ? ["行政", "权限", "内容", "资源", "数据"][i] : row.type}</td><td>{row.submitter}</td><td>{row.department}</td><td>{row.time}</td><td><StatusTag value={row.status} /></td>
                <td><div className="inline-actions"><button onClick={() => openModal("approval", row.title)}>{row.status === "待审批" ? "审批" : "查看"}</button><button>流程</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination total={24} />
    </section>
  );
}

function ProcessPage() {
  const [selected, setSelected] = useState("内容发布审批");
  const processes = ["内容发布审批", "活动发布审批", "资源上传审批", "账号权限申请"];
  return (
    <div className="process-layout">
      <section className="card process-list">
        <CardHeader title="审批流程" action={<button className="icon-btn"><Plus size={17} /></button>} />
        <label className="mini-search"><Search size={15} /><input placeholder="搜索流程" /></label>
        {processes.map((p, i) => <button className={selected === p ? "active" : ""} onClick={() => setSelected(p)} key={p}><span className={`process-badge p${i + 1}`}><GitBranch size={17} /></span><span><b>{p}</b><small>已启用 · 更新于 07-{9 - i}</small></span><ChevronRight size={16} /></button>)}
      </section>
      <section className="card process-canvas">
        <div className="canvas-toolbar">
          <div><h3>{selected}</h3><StatusTag value="已启用" /></div>
          <div><Button>版本记录</Button><Button variant="primary">保存并发布</Button></div>
        </div>
        <div className="canvas-actions"><button><ChevronsLeft size={16} /></button><button><ChevronsRight size={16} /></button><span /><button>80%</button><button><RefreshCw size={15} /></button></div>
        <div className="flow-canvas">
          <FlowNode className="start" icon={Check} title="发起申请" subtitle="由申请人提交" />
          <div className="flow-line" />
          <FlowNode icon={UserCheck} title="部门负责人审批" subtitle="指定角色：部门管理员" />
          <div className="flow-line"><button aria-label="添加节点"><Plus size={14} /></button></div>
          <div className="condition-node"><div><GitBranch size={16} />条件分支</div><p>内容类型 = “专题”</p><button><Settings size={14} /></button></div>
          <div className="branch-lines"><i /><i /></div>
          <div className="branch-nodes">
            <FlowNode icon={Users} title="运营中心会签" subtitle="全部通过后进入下一节点" />
            <FlowNode icon={UserCog} title="分管领导审批" subtitle="指定人员：王主任" />
          </div>
          <div className="merge-lines"><i /><i /></div>
          <FlowNode className="end" icon={CheckCircle2} title="审批完成" subtitle="自动发布并通知发起人" />
        </div>
      </section>
      <aside className="card property-panel">
        <CardHeader title="节点设置" action={<button className="icon-btn"><X size={16} /></button>} />
        <FormField label="节点名称"><input defaultValue="部门负责人审批" /></FormField>
        <FormField label="审批类型"><SelectField label="人工审批" /></FormField>
        <FormField label="审批人"><div className="selected-person"><CircleUserRound size={18} /><span>部门管理员</span><X size={14} /></div><button className="add-person"><Plus size={14} />添加审批人</button></FormField>
        <FormField label="多人审批方式"><label className="radio-line"><input type="radio" defaultChecked /> 或签（一人通过即可）</label><label className="radio-line"><input type="radio" /> 会签（全部通过）</label></FormField>
        <FormField label="高级设置"><label className="switch-line"><span>允许转交</span><input type="checkbox" defaultChecked /></label><label className="switch-line"><span>超时自动通过</span><input type="checkbox" /></label></FormField>
      </aside>
    </div>
  );
}

function FlowNode({ icon: Icon, title, subtitle, className = "" }: { icon: LucideIcon; title: string; subtitle: string; className?: string }) {
  return <div className={`flow-node ${className}`}><span><Icon size={18} /></span><div><b>{title}</b><small>{subtitle}</small></div><MoreHorizontal size={16} /></div>;
}

function UserList({ openModal }: { openModal: (type: ModalType, payload?: string) => void }) {
  return (
    <div className="split-page">
      <aside className="card org-tree">
        <CardHeader title="组织架构" action={<button className="icon-btn"><MoreHorizontal size={17} /></button>} />
        <label className="mini-search"><Search size={15} /><input placeholder="搜索部门" /></label>
        <div className="tree-list">
          <button className="active"><ChevronDown size={14} /><Home size={16} /><span>国科信</span><b>156</b></button>
          {["办公室", "科技发展部", "信息研究院", "人才工作部", "项目管理部", "战略规划部"].map((name, i) => <button className="tree-child" key={name}><ChevronRight size={14} /><span>{name}</span><b>{[18, 26, 34, 22, 31, 25][i]}</b></button>)}
        </div>
      </aside>
      <section className="card page-card">
        <SearchFilters placeholder="姓名 / 账号 / 手机号"><SelectField label="全部角色" /><SelectField label="全部状态" /></SearchFilters>
        <div className="table-toolbar"><div><Button variant="primary" icon={Plus} onClick={() => openModal("user")}>新增用户</Button><Button icon={Upload}>批量导入</Button><Button icon={Download}>导出</Button></div></div>
        <div className="table-wrap"><table><thead><tr><th><input type="checkbox" /></th><th>用户</th><th>账号</th><th>部门</th><th>角色</th><th>手机号</th><th>最后登录</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>{userRows.map((u) => <tr key={u.account}><td><input type="checkbox" /></td><td><div className="user-cell"><span style={{ background: u.color }}>{u.name.slice(-2)}</span><b>{u.name}</b></div></td><td className="code-cell">{u.account}</td><td>{u.department}</td><td><span className="soft-tag">{u.role}</span></td><td>{u.phone}</td><td>{u.last}</td><td><StatusTag value={u.status} /></td><td><TableActions onEdit={() => openModal("user", u.name)} onDelete={() => openModal("delete", u.name)} /></td></tr>)}</tbody>
        </table></div><Pagination total={156} />
      </section>
    </div>
  );
}

function RoleManagement({ openModal }: { openModal: (type: ModalType, payload?: string) => void }) {
  const roles = [
    ["超级管理员", "拥有系统全部管理权限", 3, 8, "系统内置", "#4180fd"],
    ["部门管理员", "管理本部门用户与内容", 12, 26, "自定义", "#a872e2"],
    ["内容管理员", "负责门户内容编辑与发布", 8, 42, "自定义", "#4dd164"],
    ["审批人员", "处理业务审批与内容审核", 6, 18, "自定义", "#f6ba21"],
    ["普通用户", "查看门户内容与提交申请", 1, 62, "系统内置", "#78d3f8"],
  ];
  return (
    <section className="card page-card">
      <SearchFilters placeholder="角色名称 / 角色编码"><SelectField label="全部类型" /></SearchFilters>
      <div className="table-toolbar"><div><Button variant="primary" icon={Plus} onClick={() => openModal("role")}>新增角色</Button></div></div>
      <div className="role-grid">
        {roles.map(([name, desc, menus, users, type, color]) => <article className="role-card" key={name as string}>
          <div className="role-card-head"><span style={{ background: `${color}18`, color: color as string }}><ShieldCheck size={21} /></span><div><h3>{name}</h3><small>{type}</small></div><MoreHorizontal size={18} /></div>
          <p>{desc}</p><div className="role-meta"><span><b>{menus}</b> 菜单权限</span><i /><span><b>{users}</b> 个用户</span></div>
          <div className="role-actions"><Button variant="text" icon={Edit3} onClick={() => openModal("role", name as string)}>编辑</Button><Button variant="text" icon={KeyRound} onClick={() => openModal("permission", name as string)}>配置权限</Button></div>
        </article>)}
      </div>
    </section>
  );
}

function PermissionPage({ openModal }: { openModal: (type: ModalType, payload?: string) => void }) {
  const perms = ["查看", "新增", "编辑", "删除", "导入", "导出", "审批"];
  return (
    <section className="card permission-page">
      <div className="permission-top">
        <div><span>当前角色</span><SelectField label="内容管理员" /><small>已选择 36 项权限</small></div>
        <div><Button>恢复默认</Button><Button variant="primary" onClick={() => openModal("permission", "内容管理员")}>保存配置</Button></div>
      </div>
      <div className="permission-content">
        <aside className="permission-menus">
          <h3>权限模块</h3>
          {menuGroups.map((g, i) => <button className={i === 1 ? "active" : ""} key={g.label}><g.icon size={17} /><span>{g.label}</span><b>{g.children.length * 3}/{g.children.length * 7}</b><ChevronRight size={15} /></button>)}
        </aside>
        <div className="permission-table">
          <div className="permission-title"><div><h3>审批管理</h3><p>配置该角色在审批模块中的操作权限</p></div><label><input type="checkbox" /> 全选本模块</label></div>
          <table><thead><tr><th>功能菜单</th>{perms.map(p => <th key={p}>{p}</th>)}</tr></thead><tbody>
            {["内容审批", "表单审批", "流程配置"].map((m, row) => <tr key={m}><td><label><input type="checkbox" defaultChecked />{m}</label></td>{perms.map((p, col) => <td key={p}><input type="checkbox" defaultChecked={(row + col) % 3 !== 1} disabled={(row === 2 && col > 3)} /></td>)}</tr>)}
          </tbody></table>
          <div className="data-scope"><h3>数据权限范围</h3><p>设置角色可查看和操作的数据范围</p><div>{["仅本人数据", "本部门数据", "本部门及下级部门", "全部数据", "自定义数据范围"].map((x, i) => <label key={x}><input type="radio" name="scope" defaultChecked={i === 1} /><span><b>{x}</b><small>{["只能查看自己创建的数据", "可查看本部门全部数据", "包含所有下级部门数据", "不受部门范围限制", "选择指定部门和人员"][i]}</small></span></label>)}</div></div>
        </div>
      </div>
    </section>
  );
}

function MenuManagement({ openModal }: { openModal: (type: ModalType, payload?: string) => void }) {
  const rows = [
    ["活动管理", "目录", "activity", "1", "显示", "正常", 0],
    ["数据看板", "菜单", "dashboard", "1", "显示", "正常", 1],
    ["活动列表", "菜单", "event:list", "2", "显示", "正常", 1],
    ["审批管理", "目录", "approval", "2", "显示", "正常", 0],
    ["内容审批", "菜单", "approval:content", "1", "显示", "正常", 1],
    ["表单审批", "菜单", "approval:form", "2", "显示", "正常", 1],
    ["流程配置", "菜单", "approval:process", "3", "隐藏", "正常", 1],
    ["组织与权限", "目录", "system", "3", "显示", "正常", 0],
  ];
  return (
    <section className="card page-card">
      <SearchFilters placeholder="菜单名称 / 权限标识"><SelectField label="全部状态" /></SearchFilters>
      <div className="table-toolbar"><div><Button variant="primary" icon={Plus} onClick={() => openModal("role", "新增菜单")}>新增菜单</Button><Button icon={Network}>展开全部</Button></div></div>
      <div className="table-wrap"><table className="tree-table"><thead><tr><th>菜单名称</th><th>类型</th><th>权限标识</th><th>排序</th><th>可见性</th><th>状态</th><th>操作</th></tr></thead><tbody>
        {rows.map(([name, type, perm, order, visible, status, level]) => <tr key={name as string}><td><div className={`menu-cell level-${level}`}>{level === 0 ? <ChevronDown size={15} /> : <span className="tree-elbow">└</span>}<span className="menu-mini-icon">{type === "目录" ? <FolderOpen size={15} /> : <FileText size={15} />}</span><b>{name}</b></div></td><td><span className={`type-tag ${type === "目录" ? "folder" : ""}`}>{type}</span></td><td className="code-cell">{perm}</td><td>{order}</td><td>{visible}</td><td><StatusTag value={status as string} /></td><td><TableActions onEdit={() => openModal("role", name as string)} onDelete={() => openModal("delete", name as string)} /></td></tr>)}
      </tbody></table></div>
    </section>
  );
}

function ResourceManagement({ openModal }: { openModal: (type: ModalType, payload?: string) => void }) {
  const assets = [
    ["科技创新成果交流会-banner.png", "图片", "2.4 MB", "2026-07-09", "gradient-blue"],
    ["人工智能专题封面.jpg", "图片", "1.8 MB", "2026-07-08", "gradient-violet"],
    ["科技成果转化白皮书.pdf", "文档", "8.7 MB", "2026-07-08", "document"],
    ["创新沙龙活动回顾.mp4", "视频", "128 MB", "2026-07-07", "video"],
    ["门户首页科技背景.jpg", "图片", "3.1 MB", "2026-07-06", "gradient-cyan"],
    ["政策解读培训资料.pptx", "文档", "12.6 MB", "2026-07-05", "slides"],
    ["青年人才采访录音.mp3", "音频", "24.3 MB", "2026-07-04", "audio"],
    ["国科信品牌规范.pdf", "文档", "15.2 MB", "2026-07-03", "document-dark"],
  ];
  return (
    <section className="card page-card">
      <div className="resource-header">
        <div className="resource-tabs"><button className="active">全部资源 <span>248</span></button><button>图片 <span>156</span></button><button>视频 <span>32</span></button><button>文档 <span>60</span></button></div>
        <div><Button icon={Plus}>新建文件夹</Button><Button variant="primary" icon={Upload} onClick={() => openModal("resource")}>上传资源</Button></div>
      </div>
      <SearchFilters placeholder="搜索资源名称"><SelectField label="全部上传者" /><SelectField label="最近更新" /></SearchFilters>
      <div className="resource-toolbar"><span><input type="checkbox" />全选</span><span>已使用 6.8 GB / 20 GB</span><div className="storage-bar"><i /></div><button className="icon-btn active"><LayoutGrid size={16} /></button><button className="icon-btn"><Menu size={16} /></button></div>
      <div className="asset-grid">
        {assets.map(([name, type, size, date, thumb]) => <article className="asset-card" key={name}>
          <div className={`asset-thumb ${thumb}`}><span>{type === "图片" ? <MonitorUp /> : type === "视频" ? <Activity /> : <FileText />}</span><label><input type="checkbox" /></label><button><MoreHorizontal size={17} /></button></div>
          <div className="asset-info"><h4 title={name}>{name}</h4><p>{type} · {size}</p><small>更新于 {date}</small></div>
        </article>)}
      </div><Pagination total={248} />
    </section>
  );
}

function ReportsPage() {
  const reports = [
    ["门户运营周报", "2026 第 27 周", "自动生成", "2026-07-08 08:00", "周报", "#4180fd"],
    ["活动运营分析报告", "2026 年 6 月", "张明远", "2026-07-02 16:32", "月报", "#4dd164"],
    ["门户用户增长分析", "2026 年第二季度", "系统生成", "2026-07-01 09:00", "季报", "#a872e2"],
    ["内容质量评估报告", "2026 年 6 月", "陈思敏", "2026-06-30 17:20", "专项", "#f6ba21"],
  ];
  return (
    <div className="reports-page">
      <div className="report-overview">
        <section className="card report-hero"><span><FileBarChart size={26} /></span><div><small>本月报告</small><strong>18</strong><p><TrendingUp size={14} /> 较上月增长 12.5%</p></div></section>
        <section className="card report-mini"><span>已生成</span><strong>156</strong><small>累计报告</small></section>
        <section className="card report-mini"><span>定时任务</span><strong>8</strong><small>正常运行</small></section>
        <section className="card report-mini"><span>下载次数</span><strong>1,286</strong><small>本月累计</small></section>
      </div>
      <section className="card page-card">
        <div className="resource-header"><div className="resource-tabs"><button className="active">全部报告</button><button>运营报告</button><button>活动报告</button><button>用户报告</button></div><Button variant="primary" icon={Plus}>新建报告</Button></div>
        <SearchFilters placeholder="搜索报告名称"><SelectField label="全部周期" /><SelectField label="全部状态" /></SearchFilters>
        <div className="report-list">
          {reports.map(([name, period, author, time, type, color]) => <article key={name}><span className="report-file" style={{ color: color as string, background: `${color}12` }}><FileText size={22} /></span><div className="report-main"><h3>{name}</h3><p>{period} · {author}</p></div><span className="soft-tag">{type}</span><div className="report-time"><small>生成时间</small><b>{time}</b></div><StatusTag value="已完成" /><Button icon={Download}>下载</Button><button className="icon-btn"><MoreHorizontal size={17} /></button></article>)}
        </div><Pagination total={156} />
      </section>
    </div>
  );
}

function Modal({ type, payload, close }: { type: ModalType; payload: string; close: () => void }) {
  if (!type) return null;
  if (type === "delete") return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="modal confirm-modal"><button className="modal-close" onClick={close}><X size={18} /></button><div className="confirm-icon"><Trash2 size={24} /></div><h2>确认删除？</h2><p>删除「{payload || "所选内容"}」后将无法恢复，请谨慎操作。</p><div className="modal-footer"><Button onClick={close}>取消</Button><Button variant="danger" onClick={close}>确认删除</Button></div></div>
    </div>
  );
  if (type === "approval") return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="modal approval-modal">
        <ModalHeader title={payload ? "审批详情" : "内容审批"} subtitle="审批编号 SP2026070901" close={close} />
        <div className="approval-body">
          <div className="approval-preview"><span className="soft-tag">活动</span><h2>{payload || "关于举办2026科技创新成果交流会的通知"}</h2><div className="article-meta"><span>提交人：张明远</span><span>科技发展部</span><span>2026-07-09 10:32</span></div><div className="article-cover"><Sparkles size={42} /><b>科技汇聚 · 创新未来</b><span>2026 科技创新成果交流会</span></div><p>为深入贯彻创新驱动发展战略，促进科技成果交流与转化，拟于近期举办2026科技创新成果交流会。本次活动将邀请领域专家、科研院所及创新企业代表共同参与……</p><h3>一、活动时间与地点</h3><p>时间：2026年7月18日 09:00—17:00<br />地点：国科信国际会议中心</p></div>
          <aside className="approval-side"><h3>审批进度</h3><div className="timeline"><div className="done"><i><Check size={13} /></i><span><b>提交申请</b><small>张明远 · 07-09 10:32</small></span></div><div className="current"><i>2</i><span><b>部门负责人审批</b><small>等待您处理</small></span></div><div><i>3</i><span><b>运营中心复核</b><small>待处理</small></span></div><div><i>4</i><span><b>完成</b><small>自动发布</small></span></div></div><FormField label="审批意见"><textarea placeholder="请输入审批意见（选填）" /></FormField></aside>
        </div>
        <div className="modal-footer spread"><Button variant="text" icon={MessageSquareMore}>转交他人</Button><div><Button icon={XCircle} onClick={close}>驳回</Button><Button variant="primary" icon={CheckCircle2} onClick={close}>通过审批</Button></div></div>
      </div>
    </div>
  );
  const isEvent = type === "event";
  const isUser = type === "user";
  const isRole = type === "role";
  const isResource = type === "resource";
  const title = isEvent ? (payload ? "编辑活动" : "新建活动") : isUser ? (payload ? "编辑用户" : "新增用户") : isRole ? payload || "新增角色" : isResource ? "上传资源" : "保存权限配置";
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className={`modal form-modal ${isResource ? "upload-modal" : ""}`}>
        <ModalHeader title={title} subtitle={isEvent ? "请完善活动基础信息与发布设置" : undefined} close={close} />
        {isResource ? <UploadBody /> : type === "permission" ? <PermissionConfirm payload={payload} /> : (
          <form className="modal-form" onSubmit={(e) => { e.preventDefault(); close(); }}>
            {isEvent && <><div className="form-row"><FormField required label="活动名称"><input defaultValue={payload} placeholder="请输入活动名称" /></FormField><FormField required label="活动类型"><SelectField label="请选择活动类型" /></FormField></div><div className="form-row"><FormField required label="主办部门"><SelectField label="请选择主办部门" /></FormField><FormField label="活动负责人"><input placeholder="请输入负责人姓名" /></FormField></div><div className="form-row"><FormField required label="活动时间"><button className="date-field"><CalendarDays size={16} />选择开始与结束时间</button></FormField><FormField required label="活动地点"><input placeholder="请输入活动地点" /></FormField></div><FormField label="活动简介"><textarea placeholder="请输入活动简介" /></FormField><FormField label="报名设置"><div className="switch-settings"><label><span><b>开放报名</b><small>允许门户用户在线报名</small></span><input type="checkbox" defaultChecked /></label><label><span><b>需要审核</b><small>报名后需管理员审核</small></span><input type="checkbox" /></label></div></FormField></>}
            {isUser && <><div className="avatar-upload"><span><CircleUserRound size={36} /></span><div><b>用户头像</b><small>支持 JPG、PNG，不超过 2MB</small><Button>上传头像</Button></div></div><div className="form-row"><FormField required label="姓名"><input defaultValue={payload} placeholder="请输入姓名" /></FormField><FormField required label="登录账号"><input placeholder="请输入登录账号" /></FormField></div><div className="form-row"><FormField required label="所属部门"><SelectField label="请选择部门" /></FormField><FormField required label="用户角色"><SelectField label="请选择角色" /></FormField></div><div className="form-row"><FormField label="手机号码"><input placeholder="请输入手机号" /></FormField><FormField label="电子邮箱"><input placeholder="请输入邮箱" /></FormField></div></>}
            {isRole && <><div className="form-row"><FormField required label="角色名称"><input defaultValue={payload && payload !== "新增菜单" ? payload : ""} placeholder="请输入角色名称" /></FormField><FormField required label="角色编码"><input placeholder="如 content_admin" /></FormField></div><FormField label="角色说明"><textarea placeholder="请输入角色用途与权限说明" /></FormField><FormField label="角色状态"><label className="switch-line"><span>启用该角色</span><input type="checkbox" defaultChecked /></label></FormField></>}
            <div className="modal-footer"><Button onClick={close}>取消</Button><Button type="submit" variant="primary">保存</Button></div>
          </form>
        )}
      </div>
    </div>
  );
}

function UploadBody() {
  return <div className="upload-body"><div className="drop-zone"><Upload size={30} /><h3>拖拽文件到此处上传</h3><p>或点击选择本地文件，单个文件不超过 200MB</p><Button variant="primary">选择文件</Button><small>支持 JPG、PNG、GIF、MP4、PDF、DOCX、PPTX</small></div><div className="upload-tip"><Sparkles size={17} /><span><b>智能素材处理</b><small>图片将自动生成缩略图，文档支持在线预览。</small></span></div><div className="modal-footer"><Button>取消</Button><Button variant="primary">开始上传</Button></div></div>;
}

function PermissionConfirm({ payload }: { payload: string }) {
  return <div className="permission-confirm"><div className="confirm-icon success"><ShieldCheck size={25} /></div><h3>确认保存权限配置？</h3><p>将更新「{payload || "内容管理员"}」的菜单、操作及数据权限，共涉及 36 项权限。</p><label><input type="checkbox" defaultChecked /> 同步通知该角色下的用户</label><div className="modal-footer"><Button>取消</Button><Button variant="primary">确认保存</Button></div></div>;
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return <label className="form-field"><span>{required && <em>*</em>}{label}</span>{children}</label>;
}

function ModalHeader({ title, subtitle, close }: { title: string; subtitle?: string; close: () => void }) {
  return <header className="modal-header"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div><button onClick={close}><X size={20} /></button></header>;
}

function Sidebar({ active, setActive, collapsed, setCollapsed }: { active: PageKey; setActive: (p: PageKey) => void; collapsed: boolean; setCollapsed: (v: boolean) => void }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ "活动管理": true, "审批管理": true, "组织与权限": true, "门户配置": true });
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
        <button className={`nav-home ${active === "dashboard" ? "active" : ""}`} onClick={() => setActive("dashboard")}><Gauge size={19} />{!collapsed && <span>首页概览</span>}</button>
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
      <button className="global-search" onClick={onSearch}><Search size={17} /><span>搜索菜单、用户或内容</span><kbd>⌘ K</kbd></button>
      <div className="top-actions">
        <button className="top-link"><MessageSquareMore size={16} /><span>帮助</span></button>
        <button className="top-link"><LayoutGrid size={16} /><span>应用</span></button>
        <div className="popover-wrap"><button className="top-icon" onClick={() => { setNotifications(!notifications); setProfile(false); }}><Bell size={19} /><i /></button>{notifications && <div className="popover notification-pop"><header><b>消息通知</b><button>全部已读</button></header>{[["审批提醒", "您有 8 条内容等待审批", "2分钟前"], ["活动提醒", "科技创新成果交流会即将开始", "1小时前"], ["系统通知", "运营周报已生成", "昨天"]].map(([t, d, time], i) => <div className="notice-item" key={t}><span className={`notice-icon n${i + 1}`}>{i === 0 ? <ClipboardCheck size={16} /> : i === 1 ? <CalendarDays size={16} /> : <FileBarChart size={16} />}</span><div><b>{t}</b><p>{d}</p><small>{time}</small></div></div>)}<footer>查看全部通知 <ChevronRight size={14} /></footer></div>}</div>
        <div className="popover-wrap"><button className="profile-button" onClick={() => { setProfile(!profile); setNotifications(false); }}><img src="./assets/user-avatar.png" alt="系统管理员" /><b>系统管理员</b><ChevronDown size={12} /></button>{profile && <div className="popover profile-pop"><button><CircleUserRound size={16} />个人中心</button><button><LockKeyhole size={16} />修改密码</button><i /><button className="logout"><LogOut size={16} />退出登录</button></div>}</div>
      </div>
    </header>
  );
}

export default function App() {
  const [active, setActive] = useState<PageKey>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modal, setModal] = useState<{ type: ModalType; payload: string }>({ type: null, payload: "" });
  const [command, setCommand] = useState(false);
  const current = pageTitles[active];
  const openModal = (type: ModalType, payload = "") => setModal({ type, payload });
  const page = useMemo(() => {
    if (active === "dashboard") return <Dashboard />;
    if (active === "events") return <EventList openModal={openModal} />;
    if (active === "approval-content") return <ApprovalList mode="content" openModal={openModal} />;
    if (active === "approval-form") return <ApprovalList mode="form" openModal={openModal} />;
    if (active === "approval-process") return <ProcessPage />;
    if (active === "users") return <UserList openModal={openModal} />;
    if (active === "roles") return <RoleManagement openModal={openModal} />;
    if (active === "permission") return <PermissionPage openModal={openModal} />;
    if (active === "menus") return <MenuManagement openModal={openModal} />;
    if (active === "resources") return <ResourceManagement openModal={openModal} />;
    return <ReportsPage />;
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
      {command && <div className="modal-backdrop command-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setCommand(false)}><div className="command-box"><label><Search size={20} /><input autoFocus placeholder="搜索菜单、用户或内容…" /><kbd>ESC</kbd></label><p>快速导航</p><div>{menuGroups.flatMap(g => g.children).slice(0, 7).map(item => <button key={item.key} onClick={() => { go(item.key); setCommand(false); }}><span><LayoutGrid size={16} />{item.label}</span><small>菜单 <ChevronRight size={14} /></small></button>)}</div></div></div>}
    </div>
  );
}
