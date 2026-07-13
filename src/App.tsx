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
import { cloneElement, isValidElement, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type PageKey =
  | "report-management"
  | "workflow-center"
  | "form-center"
  | "audit-content"
  | "event-info"
  | "event-dashboard"
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

type ModalMode = "create" | "edit" | "detail" | "batch";
type ModalPayload = Record<string, string>;
type ModalSave = (values: ModalPayload) => void;
type ModalOptions = {
  mode?: ModalMode;
  payload?: ModalPayload;
  onConfirm?: () => void;
  onSave?: ModalSave;
};
type OpenModal = (type: ModalType, options?: ModalOptions) => void;

type NavChild = { key: PageKey; label: string };

type NavItem = {
  label: string;
  icon: LucideIcon;
  key?: PageKey;
  children?: NavChild[];
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    label: "系统管理",
    items: [
      { key: "report-management", label: "报告管理", icon: FileText },
      {
        label: "审核管理",
        icon: ShieldCheck,
        children: [
          { key: "workflow-center", label: "流程中心" },
          { key: "form-center", label: "表单中心" },
          { key: "audit-content", label: "审核内容" },
        ],
      },
      {
        label: "埋点管理",
        icon: Activity,
        children: [
          { key: "event-info", label: "埋点信息" },
          { key: "event-dashboard", label: "数据看板" },
        ],
      },
    ],
  },
  {
    label: "权限管理",
    items: [
      { key: "user-management", label: "用户管理", icon: Users },
      { key: "role-management", label: "角色管理", icon: ShieldCheck },
      { key: "page-management", label: "页面管理", icon: LayoutGrid },
      { key: "resource-management", label: "资源管理", icon: Database },
      { key: "permission-config", label: "权限配置", icon: KeyRound },
    ],
  },
];

const allMenuItems = navSections.flatMap((section) =>
  section.items.flatMap((item) => item.key ? [{ key: item.key, label: item.label }] : item.children ?? [])
);

const pageLabels: Record<PageKey, string> = {
  "report-management": "报告管理",
  "workflow-center": "流程中心",
  "form-center": "表单中心",
  "audit-content": "审核内容管理",
  "event-info": "埋点信息",
  "event-dashboard": "数据看板",
  "org-management": "组织管理",
  "user-management": "用户管理",
  "role-management": "角色管理",
  "page-management": "页面管理",
  "resource-management": "资源管理",
  "permission-config": "权限配置",
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

const initialWorkflowRows = [
  { id: "workflow-report", 名称: "报告审核流程", 发布时间: "2026-07-08", 发布状态: "发布" },
  { id: "workflow-scholar", 名称: "认证学者审核流程", 发布时间: "2026-07-05", 发布状态: "下架" },
  { id: "workflow-comment", 名称: "评论审核流程", 发布时间: "2026-07-01", 发布状态: "发布" },
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

type TimeInterval = "年" | "月" | "日";

type DashboardData = {
  eventTotal: string;
  activeUsers: string;
  conversionRate: string;
  trend: Array<{ label: string; value: number }>;
  ranking: Array<{ label: string; value: number }>;
};

const eventDashboardData: Record<TimeInterval, DashboardData> = {
  年: {
    eventTotal: "24,860",
    activeUsers: "6,420",
    conversionRate: "32.8%",
    trend: [{ label: "1月", value: 1820 }, { label: "3月", value: 2360 }, { label: "5月", value: 3180 }, { label: "7月", value: 4020 }, { label: "9月", value: 4770 }, { label: "11月", value: 5360 }],
    ranking: [{ label: "报告查看", value: 6840 }, { label: "用户注册", value: 4260 }, { label: "权限配置", value: 3180 }],
  },
  月: {
    eventTotal: "8,460",
    activeUsers: "2,180",
    conversionRate: "30.6%",
    trend: [{ label: "第1周", value: 1260 }, { label: "第2周", value: 1420 }, { label: "第3周", value: 1780 }, { label: "第4周", value: 2050 }],
    ranking: [{ label: "报告查看", value: 2280 }, { label: "用户注册", value: 1460 }, { label: "权限配置", value: 980 }],
  },
  日: {
    eventTotal: "1,286",
    activeUsers: "438",
    conversionRate: "28.4%",
    trend: [{ label: "09:00", value: 126 }, { label: "11:00", value: 214 }, { label: "13:00", value: 168 }, { label: "15:00", value: 246 }, { label: "17:00", value: 312 }, { label: "19:00", value: 220 }],
    ranking: [{ label: "报告查看", value: 362 }, { label: "用户注册", value: 216 }, { label: "权限配置", value: 148 }],
  },
};

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

const compactActionLabels: Record<string, string> = {
  "报告上架": "上架",
  "报告下架": "下架",
  "报告删除": "删除",
  "信息修改": "编辑",
  "查看详情": "查看",
  "权限配置": "配置",
  "审核通过": "通过",
  "审核驳回": "驳回",
  "审核失败/取消展示": "取消展示",
};

const actionPriorities: Record<string, number> = {
  "查询": 1,
  "查看": 2,
  "编辑": 3,
  "配置": 4,
  "新增": 5,
  "上架": 6,
  "下架": 6,
  "发布": 6,
  "置顶": 7,
  "取消置顶": 7,
  "启用": 8,
  "禁用": 8,
  "通过": 8,
  "取消展示": 8,
  "驳回": 8,
  "删除": 99,
};

type ActionSource = Array<string | false | null | undefined>;

type TableAction = {
  originalLabel: string;
  label: string;
  index: number;
  priority: number;
  isDanger: boolean;
};

function getOrderedActions(actions: ActionSource): TableAction[] {
  return actions
    .filter(Boolean)
    .map((action, index) => {
      const originalLabel = action as string;
      const label = compactActionLabels[originalLabel] ?? originalLabel;
      const isDanger = label.includes("删除") || label.includes("驳回") || label.includes("失败") || label.includes("禁用") || label.includes("取消展示");
      return { originalLabel, label, index, priority: actionPriorities[label] ?? 50, isDanger };
    })
    .sort((a, b) => a.priority - b.priority || a.index - b.index);
}

function ActionLinks({ actions, onAction }: { actions: ActionSource; onAction?: (action: string) => void }) {
  const orderedActions = getOrderedActions(actions);
  return (
    <div className="inline-actions">
      {orderedActions.map(({ originalLabel, label, isDanger }) => {
        return (
          <button
            aria-label={originalLabel}
            className={isDanger ? "danger-action" : ""}
            key={originalLabel}
            onClick={(event) => {
              event.stopPropagation();
              onAction?.(originalLabel);
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function getActionItems(actionNode: ReactNode): TableAction[] {
  if (isValidElement<{ actions: ActionSource }>(actionNode) && actionNode.type === ActionLinks) {
    return getOrderedActions(actionNode.props.actions);
  }
  return [];
}

function getActionColumnWidth(actionRows: TableAction[][]) {
  return Math.max(60, ...actionRows.map((actions) => {
    const contentWidth = actions.reduce((width, action) => width + Array.from(action.label).length * 14, 0);
    return contentWidth + Math.max(0, actions.length - 1) * 12 + 32;
  }));
}

function FilterInput({
  label,
  placeholder = label,
  searchable = false,
}: {
  label: string;
  placeholder?: string;
  searchable?: boolean;
}) {
  return (
    <label className="filter-field">
      <span className="filter-label">{label}</span>
      {searchable ? (
        <span className="filter-search-control">
          <input aria-label={label} placeholder={placeholder} />
          <Search aria-hidden="true" size={16} />
        </span>
      ) : (
        <input className="filter-control" aria-label={label} placeholder={placeholder} />
      )}
    </label>
  );
}

function FilterSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
}) {
  const [internalSelected, setInternalSelected] = useState(options[0]);
  const [open, setOpen] = useState(false);
  const selected = value ?? internalSelected;
  return (
    <div className="filter-field">
      <span className="filter-label">{label}</span>
      <div
        className={`filter-select-control ${open ? "open" : ""}`}
        onBlur={(event) => {
          const nextTarget = event.relatedTarget;
          if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
            setOpen(false);
          }
        }}
      >
        <button
          type="button"
          className="filter-select-trigger"
          aria-label={label}
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={() => setOpen((value) => !value)}
        >
          <span>{selected}</span>
          <ChevronDown aria-hidden="true" size={16} />
        </button>
        {open && (
          <div className="filter-select-menu" role="listbox" aria-label={label}>
            {options.map((option) => (
              <button
                type="button"
                role="option"
                aria-selected={selected === option}
                className={selected === option ? "active" : ""}
                key={option}
                onClick={() => {
                  if (value === undefined) setInternalSelected(option);
                  onChange?.(option);
                  setOpen(false);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
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

function getPaginationItems(totalPages: number, currentPage: number) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
  const items: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  if (start > 2) items.push("ellipsis");
  for (let page = start; page <= end; page += 1) items.push(page);
  if (end < totalPages - 1) items.push("ellipsis");
  items.push(totalPages);
  return items;
}

function Pagination({
  total,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageItems = getPaginationItems(totalPages, currentPage);
  return (
    <nav className="pagination" aria-label="分页">
      <span>共 {total} 条</span>
      <button aria-label="上一页" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}><ChevronLeft size={16} /></button>
      {pageItems.map((item, index) => (
        item === "ellipsis"
          ? <span className="pagination-ellipsis" key={`ellipsis-${index}`}>…</span>
          : <button className={item === currentPage ? "active" : ""} aria-current={item === currentPage ? "page" : undefined} key={item} onClick={() => onPageChange(item)}>{item}</button>
      ))}
      <button aria-label="下一页" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}><ChevronRight size={16} /></button>
      <label className="pagination-size">
        <select aria-label="每页条数" value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))}>
          {[10, 20, 50].map((size) => <option key={size} value={size}>{size} 条/页</option>)}
        </select>
        <ChevronDown aria-hidden="true" size={16} />
      </label>
    </nav>
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

function getTableText(value: ReactNode) {
  if (typeof value === "string" || typeof value === "number") return String(value);
  return null;
}

type TableColumnWidthKind = "long" | "name" | "date" | "identifier" | "contact" | "numeric" | "compact" | "default";

const tableColumnMinimumWidths: Record<string, number> = {
  报告标题: 200,
  报告类型: 128,
  报告来源: 160,
  所属领域: 120,
  上传时间: 120,
  内容摘要: 240,
  状态: 96,
  是否置顶: 96,
  名称: 200,
  发布时间: 120,
  发布状态: 96,
  评论内容: 240,
  渠道: 120,
  学者姓名: 120,
  机构: 180,
  职称: 96,
  手机号: 128,
  报告信息: 220,
  提交人: 120,
  事件ID: 180,
  所属功能模块: 140,
  埋点标签: 160,
  埋点路径: 220,
  触发机制: 96,
  组织姓名: 180,
  父组织名称: 180,
  用户ID: 120,
  用户姓名: 120,
  所属组织名称: 180,
  邮箱: 200,
  创建时间: 120,
  账号状态: 96,
  角色ID: 96,
  角色名称: 140,
  角色描述: 220,
  创建人: 128,
  最近修改人: 128,
  最近修改时间: 144,
  一级页面: 140,
  二级页面: 140,
  三级页面: 140,
  "地址(URL)": 240,
  启用属性: 96,
  接口名称: 160,
  请求方法: 96,
  参数列表: 240,
  返回格式: 120,
  示例请求: 200,
  响应结果: 96,
  错误码说明: 200,
  调用时间: 144,
  调用方IP: 128,
  接口地址: 220,
  请求参数: 200,
  调用耗时: 96,
  错误信息: 200,
  人才库名称: 220,
  描述: 240,
  学者数量: 96,
  报告名称: 220,
  报告类型ID: 120,
  所属学科: 160,
  领域: 120,
};

const tableColumnMinimumWidthByKind: Record<TableColumnWidthKind, number> = {
  long: 224,
  name: 192,
  date: 144,
  identifier: 128,
  contact: 128,
  numeric: 104,
  compact: 96,
  default: 144,
};

function getTableColumnWidthKind(column: string): TableColumnWidthKind {
  if (/(时间|日期)/.test(column)) return "date";
  if (/(ID|编号)/.test(column)) return "identifier";
  if (/(手机号|邮箱|IP)/.test(column)) return "contact";
  if (/(数量|耗时)/.test(column)) return "numeric";
  if (/(状态|是否|渠道|领域|职称|属性|方法|机制|格式|结果)/.test(column)) return "compact";
  if (/(内容|摘要|描述|地址|路径|参数|错误|说明|示例请求|信息)/.test(column)) return "long";
  if (/(标题|名称)/.test(column)) return "name";
  return "default";
}

function getTextDisplayWidth(text: string) {
  const units = Array.from(text).reduce((total, character) => (
    total + (/^[\u2E80-\u9FFF\uF900-\uFAFF]$/.test(character) ? 1 : character === " " ? .35 : .58)
  ), 0);
  return Math.ceil(Math.min(units, 16) * 14 + 32);
}

function getColumnWidth<T extends Record<string, ReactNode>>(column: string, rows: T[]) {
  const contentWidth = rows.reduce((longest, row) => {
    const value = getTableText(row[column]);
    return Math.max(longest, value ? getTextDisplayWidth(value) : 0);
  }, getTextDisplayWidth(column));
  const minimumWidth = tableColumnMinimumWidths[column] ?? tableColumnMinimumWidthByKind[getTableColumnWidthKind(column)];
  return Math.max(minimumWidth, contentWidth);
}

function TableCellContent({
  value,
  onShowTooltip,
  onHideTooltip,
}: {
  value: ReactNode;
  onShowTooltip: (content: string, target: HTMLElement) => void;
  onHideTooltip: () => void;
}) {
  const text = getTableText(value);
  const shouldTruncate = Boolean(text && Array.from(text).length > 16);
  if (!shouldTruncate || !text) return <>{value}</>;
  return (
    <span
      className="table-cell-text is-truncated"
      title={text}
      onMouseEnter={(event) => onShowTooltip(text, event.currentTarget)}
      onMouseLeave={onHideTooltip}
    >
      {text}
    </span>
  );
}

function DataTable<T extends Record<string, ReactNode>>({
  columns,
  rows,
  actions,
  rowKey,
  onRowClick,
  activeRowKey,
}: {
  columns: string[];
  rows: T[];
  actions?: (row: T) => ReactNode;
  rowKey?: (row: T, index: number) => string | number;
  onRowClick?: (row: T, index: number) => void;
  activeRowKey?: string | number | null;
}) {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(() => new Set());
  const [scrollState, setScrollState] = useState({ hasOverflow: false, showLeftShadow: false, showRightShadow: false });
  const [tooltip, setTooltip] = useState<{ content: string; left: number; top: number } | null>(null);
  const tableWrapRef = useRef<HTMLDivElement>(null);
  const selectAllRef = useRef<HTMLInputElement>(null);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const pageStart = (activePage - 1) * pageSize;
  const pageRows = rows.slice(pageStart, pageStart + pageSize);
  const visibleRowIndexes = pageRows.map((_, index) => pageStart + index);
  const allVisibleRowsSelected = visibleRowIndexes.length > 0 && visibleRowIndexes.every((index) => selectedRows.has(index));
  const someVisibleRowsSelected = visibleRowIndexes.some((index) => selectedRows.has(index));
  const columnWidths = columns.map((column) => getColumnWidth(column, rows));
  const actionRows = actions ? rows.map((row) => getActionItems(actions(row))) : [];
  const actionColumnWidth = actions ? getActionColumnWidth(actionRows) : 0;
  const selectedActionRows = Array.from(selectedRows, (rowIndex) => actionRows[rowIndex]).filter((actionItems): actionItems is TableAction[] => Boolean(actionItems));
  const canBatchDelete = selectedActionRows.length > 0 && selectedActionRows.every((actionItems) => actionItems.some((action) => action.label.includes("删除")));
  const tableMinWidth = 52 + columnWidths.reduce((total, width) => total + width, 0) + actionColumnWidth;
  const tableWidth = actions ? "100%" : `${tableMinWidth}px`;

  const updateScrollState = () => {
    const tableWrap = tableWrapRef.current;
    if (!tableWrap) return;
    const maxScrollLeft = Math.max(0, tableWrap.scrollWidth - tableWrap.clientWidth);
    const hasOverflow = maxScrollLeft > 1;
    const nextState = {
      hasOverflow,
      showLeftShadow: hasOverflow && tableWrap.scrollLeft > 1,
      showRightShadow: hasOverflow && tableWrap.scrollLeft < maxScrollLeft - 1,
    };
    setScrollState((current) => (
      current.hasOverflow === nextState.hasOverflow
      && current.showLeftShadow === nextState.showLeftShadow
      && current.showRightShadow === nextState.showRightShadow
        ? current
        : nextState
    ));
  };

  useEffect(() => {
    const tableWrap = tableWrapRef.current;
    if (!tableWrap) return undefined;
    updateScrollState();
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(tableWrap);
    window.addEventListener("resize", updateScrollState);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScrollState);
    };
  }, [actions, columns.length, pageSize, rows.length, tableMinWidth]);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someVisibleRowsSelected && !allVisibleRowsSelected;
    }
  }, [allVisibleRowsSelected, someVisibleRowsSelected]);

  const toggleVisibleRows = () => {
    setSelectedRows((current) => {
      const next = new Set(current);
      if (allVisibleRowsSelected) visibleRowIndexes.forEach((index) => next.delete(index));
      else visibleRowIndexes.forEach((index) => next.add(index));
      return next;
    });
  };

  const toggleRow = (rowIndex: number) => {
    setSelectedRows((current) => {
      const next = new Set(current);
      if (next.has(rowIndex)) next.delete(rowIndex);
      else next.add(rowIndex);
      return next;
    });
  };

  const showTooltip = (content: string, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    const maxLeft = Math.max(8, window.innerWidth - 368);
    setTooltip({ content, left: Math.min(Math.max(8, rect.left), maxLeft), top: rect.bottom + 8 });
  };

  const pagination = (
    <Pagination
      total={rows.length}
      currentPage={activePage}
      pageSize={pageSize}
      onPageChange={setCurrentPage}
      onPageSizeChange={(nextPageSize) => {
        setPageSize(nextPageSize);
        setCurrentPage(1);
      }}
    />
  );

  return (
    <>
      <div
        className={`table-wrap ${actions ? "has-actions" : ""} ${scrollState.hasOverflow ? "is-scrollable" : ""} ${scrollState.showLeftShadow ? "has-left-shadow" : ""} ${scrollState.showRightShadow ? "has-right-shadow" : ""}`}
        ref={tableWrapRef}
        onScroll={updateScrollState}
      >
        <table style={{ width: tableWidth, minWidth: `${tableMinWidth}px` }}>
          <colgroup>
            <col className="table-select-column" />
            {columnWidths.map((width, index) => <col key={columns[index]} style={{ width }} />)}
            {actions && <col className="table-spacer-column" />}
            {actions && <col className="table-action-column" style={{ width: actionColumnWidth }} />}
          </colgroup>
          <thead>
            <tr>
              <th className="table-select-cell table-sticky-left">
                <input ref={selectAllRef} type="checkbox" aria-label="选择当前页全部数据" checked={allVisibleRowsSelected} onChange={toggleVisibleRows} />
              </th>
              {columns.map((column) => <th key={column}>{column}</th>)}
              {actions && <th className="table-spacer-cell" aria-hidden="true" />}
              {actions && <th className="table-action-cell table-sticky-right">操作</th>}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, pageIndex) => {
              const rowIndex = pageStart + pageIndex;
              const key = rowKey?.(row, rowIndex) ?? rowIndex;
              const isActiveRow = activeRowKey !== undefined && activeRowKey === key;
              return (
                <tr
                  className={`${selectedRows.has(rowIndex) ? "is-selected" : ""} ${isActiveRow ? "is-active" : ""}`.trim()}
                  key={key}
                  onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}
                >
                  <td className="table-select-cell table-sticky-left">
                    <input type="checkbox" aria-label={`选择第 ${rowIndex + 1} 条数据`} checked={selectedRows.has(rowIndex)} onClick={(event) => event.stopPropagation()} onChange={() => toggleRow(rowIndex)} />
                  </td>
                  {columns.map((column) => (
                    <td key={column}>
                      <TableCellContent value={row[column]} onShowTooltip={showTooltip} onHideTooltip={() => setTooltip(null)} />
                    </td>
                  ))}
                  {actions && <td className="table-spacer-cell" aria-hidden="true" />}
                  {actions && <td className="table-action-cell table-sticky-right">{actions(row)}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selectedRows.size > 0 ? (
        <div className="table-bottom-bar batch-selection-bar">
          <div className="batch-selection-actions">
            <span>已选 {selectedRows.size} 条</span>
            {canBatchDelete && <button type="button" className="danger-action">批量删除</button>}
            <button type="button" onClick={() => setSelectedRows(new Set())}>取消选择</button>
          </div>
          {pagination}
        </div>
      ) : pagination}
      {tooltip && createPortal(
        <div className="table-cell-tooltip" role="tooltip" style={{ left: tooltip.left, top: tooltip.top }}>{tooltip.content}</div>,
        document.body,
      )}
    </>
  );
}

function ReportManagement({ openModal }: { openModal: OpenModal }) {
  const [reports, setReports] = useState(reportRows);

  const updateReport = (title: string, patch: Partial<(typeof reportRows)[number]>) => {
    setReports((list) => list.map((report) => (report.报告标题 === title ? { ...report, ...patch } : report)));
  };

  return (
    <section className="card page-card">
      <div className="filters">
        <FilterSelect label="报告类型" options={["全部", ...reportTypeOptions]} />
        <FilterSelect label="所属领域" options={["全部", "人工智能", "智能制造", "新材料", "低空经济"]} />
        <FilterInput label="报告来源" placeholder="请输入" searchable />
      </div>
      <div className="table-toolbar">
        <div>
          <Button
            variant="primary"
            icon={Upload}
            onClick={() => openModal("report", {
              mode: "create",
              onSave: (values) => setReports((list) => [
                ...list,
                {
                  报告标题: values.报告标题,
                  报告类型: values.报告类型,
                  报告来源: values.报告来源,
                  所属领域: values.所属领域,
                  上传时间: values.上传时间,
                  内容摘要: values.内容摘要,
                  状态: "上架",
                  是否置顶: "否",
                },
              ]),
            })}
          >报告上传</Button>
        </div>
      </div>
      <DataTable
        columns={["报告标题", "报告类型", "报告来源", "所属领域", "上传时间", "内容摘要", "状态", "是否置顶"]}
        rows={reports.map((row) => ({ ...row, 原始状态: row.状态, 状态: <StatusTag value={row.状态} /> }))}
        actions={(row) => (
          <ActionLinks
            actions={[
              row.原始状态 === "下架" ? "报告上架" : "报告下架",
              "信息修改",
              row.原始状态 === "下架" && "报告删除",
              row.是否置顶 === "是" ? "取消置顶" : "置顶",
            ]}
            onAction={(action) => {
              const title = String(row.报告标题);
              const report = reports.find((item) => item.报告标题 === title);
              if (!report) return;
              if (action === "报告上架" || action === "报告下架") updateReport(title, { 状态: action === "报告上架" ? "上架" : "下架" });
              if (action === "置顶" || action === "取消置顶") updateReport(title, { 是否置顶: action === "置顶" ? "是" : "否" });
              if (action === "信息修改") {
                openModal("report", {
                  mode: "edit",
                  payload: report,
                  onSave: (values) => updateReport(title, values),
                });
              }
              if (action === "报告删除") {
                openModal("delete", {
                  payload: { message: `确认删除${title}？` },
                  onConfirm: () => setReports((list) => list.filter((item) => item.报告标题 !== title)),
                });
              }
            }}
          />
        )}
      />
    </section>
  );
}

type WorkflowNodeType = "start" | "process" | "cc" | "end";

type WorkflowCondition = {
  id: string;
  field: string;
  operator: "包含" | "等于";
  value: string;
};

type WorkflowNode = {
  id: string;
  type: WorkflowNodeType;
  节点名称: string;
  负责人: string[];
  节点提交条件: string;
  多位负责人规则: "所有负责人提交后进入下一节点" | "任一负责人提交后进入下一节点";
  找不到负责人处理: "自动提交当前待办" | "将待办转给指定人员进行处理";
  流转条件: WorkflowCondition[];
};

const workflowNodeLabels: Record<WorkflowNodeType, string> = {
  start: "流程发起节点",
  process: "流程节点",
  cc: "抄送节点",
  end: "流程结束节点",
};

function createWorkflowNodes(workflowId: string): WorkflowNode[] {
  const createNode = (type: WorkflowNodeType, suffix: string): WorkflowNode => ({
    id: `${workflowId}-${suffix}`,
    type,
    节点名称: workflowNodeLabels[type],
    负责人: [],
    节点提交条件: "",
    多位负责人规则: "所有负责人提交后进入下一节点",
    找不到负责人处理: "自动提交当前待办",
    流转条件: type === "process" ? [{ id: `${workflowId}-${suffix}-condition`, field: "", operator: "包含", value: "" }] : [],
  });
  return [createNode("start", "start"), createNode("process", "process"), createNode("end", "end")];
}

function WorkflowCenter({ openModal }: { openModal: OpenModal }) {
  const [view, setView] = useState<"management" | "designer">("management");
  const [workflowList, setWorkflowList] = useState(initialWorkflowRows);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);
  const [nodesByWorkflow, setNodesByWorkflow] = useState<Record<string, WorkflowNode[]>>(() => Object.fromEntries(initialWorkflowRows.map((workflow) => [workflow.id, createWorkflowNodes(workflow.id)])));
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const selectedWorkflow = workflowList.find((workflow) => workflow.id === selectedWorkflowId) ?? null;
  const currentNodes = selectedWorkflowId ? nodesByWorkflow[selectedWorkflowId] ?? [] : [];
  const selectedNode = currentNodes.find((node) => node.id === selectedNodeId) ?? currentNodes[0] ?? null;

  const openDesigner = (workflowId: string) => {
    const nodes = nodesByWorkflow[workflowId] ?? createWorkflowNodes(workflowId);
    if (!nodesByWorkflow[workflowId]) setNodesByWorkflow((current) => ({ ...current, [workflowId]: nodes }));
    setSelectedWorkflowId(workflowId);
    setSelectedNodeId(nodes[0]?.id ?? null);
    setView("designer");
  };

  const updateWorkflowStatus = (workflowId: string, 发布状态: string) => {
    setWorkflowList((list) => list.map((workflow) => (workflow.id === workflowId ? { ...workflow, 发布状态 } : workflow)));
  };

  const updateNode = (nodeId: string, patch: Partial<WorkflowNode>) => {
    if (!selectedWorkflowId) return;
    setNodesByWorkflow((current) => ({
      ...current,
      [selectedWorkflowId]: (current[selectedWorkflowId] ?? []).map((node) => (node.id === nodeId ? { ...node, ...patch } : node)),
    }));
  };

  const addNode = (type: "process" | "cc") => {
    if (!selectedWorkflowId) return;
    const nodeId = `${selectedWorkflowId}-${type}-${Date.now()}`;
    const nextNode: WorkflowNode = {
      id: nodeId,
      type,
      节点名称: workflowNodeLabels[type],
      负责人: [],
      节点提交条件: "",
      多位负责人规则: "所有负责人提交后进入下一节点",
      找不到负责人处理: "自动提交当前待办",
      流转条件: type === "process" ? [{ id: `${nodeId}-condition`, field: "", operator: "包含", value: "" }] : [],
    };
    setNodesByWorkflow((current) => {
      const nodes = current[selectedWorkflowId] ?? [];
      const endIndex = Math.max(0, nodes.findIndex((node) => node.type === "end"));
      const next = [...nodes];
      next.splice(endIndex, 0, nextNode);
      return { ...current, [selectedWorkflowId]: next };
    });
    setSelectedNodeId(nextNode.id);
  };

  const updateCondition = (conditionId: string, patch: Partial<WorkflowCondition>) => {
    if (!selectedNode) return;
    updateNode(selectedNode.id, { 流转条件: selectedNode.流转条件.map((condition) => (condition.id === conditionId ? { ...condition, ...patch } : condition)) });
  };

  const addCondition = () => {
    if (!selectedNode) return;
    updateNode(selectedNode.id, { 流转条件: [...selectedNode.流转条件, { id: `${selectedNode.id}-${Date.now()}`, field: "", operator: "包含", value: "" }] });
  };

  const removeCondition = (conditionId: string) => {
    if (!selectedNode || selectedNode.流转条件.length <= 1) return;
    updateNode(selectedNode.id, { 流转条件: selectedNode.流转条件.filter((condition) => condition.id !== conditionId) });
  };

  if (view === "management") {
    return (
      <section className="card page-card workflow-management">
        <div className="workflow-management-label">表单页面管理</div>
        <DataTable
          columns={["名称", "发布时间", "发布状态"]}
          rows={workflowList.map((workflow) => ({ ...workflow, 原始发布状态: workflow.发布状态, 发布状态: <StatusTag value={workflow.发布状态} /> }))}
          rowKey={(row) => String(row.id)}
          activeRowKey={selectedWorkflowId}
          onRowClick={(row) => openDesigner(String(row.id))}
          actions={(row) => (
            <ActionLinks
              actions={[row.原始发布状态 === "发布" ? "下架" : "发布", "编辑", "删除"]}
              onAction={(action) => {
                const workflowId = String(row.id);
                if (action === "编辑") openDesigner(workflowId);
                if (action === "发布" || action === "下架") updateWorkflowStatus(workflowId, action === "发布" ? "发布" : "下架");
                if (action === "删除") {
                  openModal("delete", {
                    payload: { message: `确认删除${row.名称}？` },
                    onConfirm: () => setWorkflowList((list) => list.filter((workflow) => workflow.id !== workflowId)),
                  });
                }
              }}
            />
          )}
        />
      </section>
    );
  }

  return (
    <section className="process-designer workflow-designer">
      <header className="process-designer-header">
        <div className="workflow-designer-title">
          <Button variant="text" icon={ChevronLeft} onClick={() => setView("management")}>返回</Button>
          <strong>流程设计表单</strong>
        </div>
        <Button variant="primary" onClick={() => selectedWorkflow && updateWorkflowStatus(selectedWorkflow.id, "发布")}>发布</Button>
      </header>
      <div className="process-designer-main">
        <aside className="node-palette">
          <div className="node-palette-title">流程设计器节点</div>
          <div className="node-list">
            {(["start", "end", "process", "cc"] as WorkflowNodeType[]).map((type) => {
              const isDefaultNode = type === "start" || type === "end";
              const existingNode = currentNodes.find((node) => node.type === type);
              return (
                <button
                  key={type}
                  type="button"
                  className={`node-card ${isDefaultNode ? "locked" : ""} ${existingNode?.id === selectedNode?.id ? "active" : ""}`}
                  onClick={() => isDefaultNode ? setSelectedNodeId(existingNode?.id ?? null) : addNode(type)}
                >
                  <span className={`node-icon ${type}`}>{type === "process" ? <CircleUserRound size={16} /> : type === "cc" ? <FileText size={16} /> : <i />}</span>
                  <span><b>{workflowNodeLabels[type]}</b>{isDefaultNode && <small>系统默认，不可删除</small>}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="designer-canvas" aria-label="流程设计表单">
          <div className="flow-strip">
            {currentNodes.map((node, index) => (
              <div className="flow-node-group" key={node.id}>
                <button className={`workflow-canvas-node ${node.type} ${selectedNode?.id === node.id ? "active" : ""}`} onClick={() => setSelectedNodeId(node.id)}>
                  {node.type === "process" ? <CircleUserRound size={16} /> : node.type === "cc" ? <FileText size={16} /> : <i />}
                  <span>{node.节点名称}</span>
                </button>
                {index < currentNodes.length - 1 && <i className="flow-connector" />}
              </div>
            ))}
          </div>
        </section>

        <aside className="node-property">
          <div className="node-property-title">节点配置表单</div>
          {selectedNode && (
            <div className="node-property-body">
              <label className="designer-field"><span>节点名称</span><input type="text" value={selectedNode.节点名称} onChange={(event) => updateNode(selectedNode.id, { 节点名称: event.target.value })} /></label>
              <div className="designer-field"><span>负责人</span><FormMultiSelect ariaLabel="负责人" options={roleOptions} value={selectedNode.负责人} onChange={(负责人) => updateNode(selectedNode.id, { 负责人 })} /></div>
              <label className="designer-field"><span>节点提交条件</span><input type="text" value={selectedNode.节点提交条件} onChange={(event) => updateNode(selectedNode.id, { 节点提交条件: event.target.value })} /></label>
              <div className="designer-field">
                <span>有多位负责人时</span>
                <div className="radio-stack">
                  {(["所有负责人提交后进入下一节点", "任一负责人提交后进入下一节点"] as const).map((rule) => (
                    <label key={rule}><input type="radio" name={`multi-user-${selectedNode.id}`} checked={selectedNode.多位负责人规则 === rule} onChange={() => updateNode(selectedNode.id, { 多位负责人规则: rule })} />{rule}</label>
                  ))}
                </div>
              </div>
              <div className="designer-field">
                <span>找不到节点负责人时</span>
                <FormSelect ariaLabel="找不到节点负责人时" options={["自动提交当前待办", "将待办转给指定人员进行处理"]} value={selectedNode.找不到负责人处理} onChange={(找不到负责人处理) => updateNode(selectedNode.id, { 找不到负责人处理: 找不到负责人处理 as WorkflowNode["找不到负责人处理"] })} />
              </div>
              <div className="condition-panel">
                <h3>按条件流转</h3>
                {selectedNode.流转条件.map((condition) => (
                  <div className="condition-row" key={condition.id}>
                    <input type="text" value={condition.field} onChange={(event) => updateCondition(condition.id, { field: event.target.value })} />
                    <FormSelect ariaLabel="流转条件运算符" options={["包含", "等于"]} value={condition.operator} onChange={(operator) => updateCondition(condition.id, { operator: operator as WorkflowCondition["operator"] })} />
                    <input type="text" value={condition.value} onChange={(event) => updateCondition(condition.id, { value: event.target.value })} />
                    <button type="button" className="delete-condition" onClick={() => removeCondition(condition.id)} aria-label="删除"><Trash2 size={16} /></button>
                  </div>
                ))}
                <button type="button" className="add-condition" onClick={addCondition}><Plus size={14} />添加流转条件</button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

function FormCenter() {
  const components = ["单行文本", "多行文本", "数字字段", "日期时间", "单选按钮组", "复选框组", "下拉框"];
  const [tab, setTab] = useState<"components" | "rules">("components");
  return (
    <section className="card page-card">
      <div className="resource-header">
        <div className="resource-tabs">
          <button className={tab === "components" ? "active" : ""} onClick={() => setTab("components")}>组件</button>
          <button className={tab === "rules" ? "active" : ""} onClick={() => setTab("rules")}>规则配置</button>
        </div>
        <Button variant="primary" icon={FileText} onClick={() => window.print()}>打印成表格</Button>
      </div>
      {tab === "components" && (
        <div className="role-grid">
          {components.map((name) => (
            <article className="role-card" key={name}>
              <div className="role-card-head"><span><FileText size={21} /></span><div><h3>{name}</h3></div></div>
            </article>
          ))}
        </div>
      )}
      {tab === "rules" && (
        <form className="page-form form-center-rules">
          <div className="form-row">
            <FormField label="最大长度"><input type="text" /></FormField>
            <FormField label="最大最小值"><input type="number" /></FormField>
          </div>
          <div className="form-row">
            <FormField label="最大最小日期"><span className="date-range-fields"><DateField /><DateField /></span></FormField>
            <FormField label="可选项/多选"><FormSelect options={["可选项", "多选"]} /></FormField>
          </div>
        </form>
      )}
    </section>
  );
}

function AuditContent() {
  const [tab, setTab] = useState<"comments" | "scholars" | "reports">("comments");
  const [comments, setComments] = useState(commentRows);
  const [scholars, setScholars] = useState(scholarRows);
  const [reports, setReports] = useState(auditReportRows);
  return (
    <section className="card page-card">
      <div className="subtabs">
        <button className={tab === "comments" ? "active" : ""} onClick={() => setTab("comments")}>评论审核</button>
        <button className={tab === "scholars" ? "active" : ""} onClick={() => setTab("scholars")}>认证学者审核</button>
        <button className={tab === "reports" ? "active" : ""} onClick={() => setTab("reports")}>报告审核</button>
      </div>
      {tab === "comments" && (
        <DataTable
          columns={["评论内容", "渠道", "状态"]}
          rows={comments.map((row) => ({ ...row, 原始评论内容: row.评论内容, 状态: <StatusTag value={row.状态} /> }))}
          actions={(row) => (
            <ActionLinks
              actions={["审核通过", "审核失败/取消展示"]}
              onAction={(action) => {
                const comment = String(row.原始评论内容);
                setComments((list) => list.map((item) => (
                  item.评论内容 === comment ? { ...item, 状态: action === "审核通过" ? "审核通过" : "审核失败" } : item
                )));
              }}
            />
          )}
        />
      )}
      {tab === "scholars" && (
        <DataTable
          columns={["学者姓名", "机构", "职称", "手机号"]}
          rows={scholars}
          actions={(row) => <ActionLinks actions={["审核通过", "审核驳回"]} onAction={() => setScholars((list) => list.filter((item) => item.学者姓名 !== String(row.学者姓名)))} />}
        />
      )}
      {tab === "reports" && (
        <DataTable
          columns={["报告信息", "提交人"]}
          rows={reports}
          actions={(row) => <ActionLinks actions={["审核通过", "审核驳回"]} onAction={() => setReports((list) => list.filter((item) => item.报告信息 !== String(row.报告信息)))} />}
        />
      )}
    </section>
  );
}

function DashboardMetric({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <article className="dashboard-metric">
      <div className="dashboard-metric-icon"><Icon size={20} /></div>
      <div><span>{label}</span><strong>{value}</strong></div>
    </article>
  );
}

function EventGrowthTrend({ data }: { data: DashboardData }) {
  const width = 560;
  const height = 220;
  const chartTop = 20;
  const chartBottom = 42;
  const chartLeft = 20;
  const chartRight = 20;
  const max = Math.max(...data.trend.map((point) => point.value));
  const min = Math.min(...data.trend.map((point) => point.value));
  const span = Math.max(1, max - min);
  const points = data.trend.map((point, index) => ({
    ...point,
    x: chartLeft + (index / Math.max(1, data.trend.length - 1)) * (width - chartLeft - chartRight),
    y: chartTop + ((max - point.value) / span) * (height - chartTop - chartBottom),
  }));
  return (
    <section className="dashboard-panel trend-panel">
      <h3>事件增长趋势</h3>
      <div className="trend-chart">
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="事件增长趋势">
          {[0, 1, 2, 3].map((line) => {
            const y = chartTop + line * ((height - chartTop - chartBottom) / 3);
            return <line key={line} x1={chartLeft} x2={width - chartRight} y1={y} y2={y} className="trend-grid-line" />;
          })}
          <polyline className="trend-line" points={points.map((point) => `${point.x},${point.y}`).join(" ")} />
          {points.map((point) => (
            <g key={point.label} className="trend-point">
              <circle cx={point.x} cy={point.y} r="4"><title>{`${point.label} ${point.value}`}</title></circle>
              <text x={point.x} y={height - 14} textAnchor="middle">{point.label}</text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}

function EventRanking({ data }: { data: DashboardData }) {
  const max = Math.max(...data.ranking.map((item) => item.value));
  return (
    <section className="dashboard-panel ranking-panel">
      <h3>事件排行</h3>
      <ol>
        {data.ranking.map((item, index) => (
          <li key={item.label}>
            <span className="ranking-index">{index + 1}</span>
            <span className="ranking-label">{item.label}</span>
            <span className="ranking-bar"><i style={{ width: `${(item.value / max) * 100}%` }} /></span>
            <strong>{item.value}</strong>
          </li>
        ))}
      </ol>
    </section>
  );
}

function EventDashboard() {
  const [interval, setInterval] = useState<TimeInterval>("日");
  const data = eventDashboardData[interval];
  return (
    <div className="event-dashboard">
      <div className="filters dashboard-filter">
        <FilterSelect label="时间区间" options={["年", "月", "日"]} value={interval} onChange={(value) => setInterval(value as TimeInterval)} />
      </div>
      <div className="dashboard-metrics">
        <DashboardMetric label="事件总量" value={data.eventTotal} icon={Activity} />
        <DashboardMetric label="活跃用户数" value={data.activeUsers} icon={Users} />
        <DashboardMetric label="事件转化率" value={data.conversionRate} icon={BarChart3} />
      </div>
      <div className="dashboard-data-panels">
        <EventGrowthTrend data={data} />
        <EventRanking data={data} />
      </div>
    </div>
  );
}

function EventTracking({ openModal, initialTab }: { openModal: OpenModal; initialTab: "info" | "stats" }) {
  const [tab, setTab] = useState<"info" | "stats">(initialTab);
  const [events, setEvents] = useState(trackingRows);

  const updateEvent = (eventId: string, patch: Partial<(typeof trackingRows)[number]>) => {
    setEvents((list) => list.map((event) => (event.事件ID === eventId ? { ...event, ...patch } : event)));
  };

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
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => openModal("tracking", {
                  mode: "create",
                  onSave: (values) => setEvents((list) => [...list, {
                    事件ID: values.事件ID,
                    所属功能模块: values.所属功能模块,
                    埋点标签: values.埋点标签,
                    埋点路径: values.埋点路径,
                    触发机制: values.触发机制,
                  }]),
                })}
              >新增埋点事件</Button>
              <Button
                icon={Upload}
                onClick={() => openModal("tracking", { mode: "batch" })}
              >批量上传埋点事件</Button>
            </div>
          </div>
          <DataTable
            columns={["事件ID", "所属功能模块", "埋点标签", "埋点路径", "触发机制"]}
            rows={events}
            actions={(row) => (
              <ActionLinks
                actions={["查询", "修改", "删除", "查看详情"]}
                onAction={(action) => {
                  const eventId = String(row.事件ID);
                  const event = events.find((item) => item.事件ID === eventId);
                  if (!event) return;
                  if (action === "修改") {
                    openModal("tracking", {
                      mode: "edit",
                      payload: event,
                      onSave: (values) => updateEvent(eventId, values),
                    });
                  }
                  if (action === "查询" || action === "查看详情") openModal("tracking", { mode: "detail", payload: event });
                  if (action === "删除") {
                    openModal("delete", {
                      payload: { message: `确认删除${eventId}？` },
                      onConfirm: () => setEvents((list) => list.filter((item) => item.事件ID !== eventId)),
                    });
                  }
                }}
              />
            )}
          />
        </>
      )}
      {tab === "stats" && <EventDashboard />}
    </section>
  );
}

function UserManagement({ openModal, initialTab = "users" }: { openModal: OpenModal; initialTab?: "org" | "users" }) {
  const [tab, setTab] = useState<"org" | "users">(initialTab);
  const [users, setUsers] = useState(userRows);

  const updateUser = (userId: string, patch: Partial<(typeof userRows)[number]>) => {
    setUsers((list) => list.map((user) => (user.用户ID === userId ? { ...user, ...patch } : user)));
  };

  return (
    <section className="card page-card">
      <div className="subtabs">
        <button className={tab === "org" ? "active" : ""} onClick={() => setTab("org")}>组织管理</button>
        <button className={tab === "users" ? "active" : ""} onClick={() => setTab("users")}>用户管理</button>
      </div>
      {tab === "org" && (
        <>
          <div className="filters">
            <FilterInput label="组织检索" placeholder="请输入" searchable />
          </div>
          <div className="table-toolbar">
            <div><Button icon={Network}>组织数据对接</Button></div>
          </div>
          <DataTable columns={["组织姓名", "父组织名称"]} rows={orgRows} />
        </>
      )}
      {tab === "users" && (
        <>
          <div className="filters">
            <FilterInput label="用户检索" placeholder="请输入" searchable />
          </div>
          <div className="table-toolbar">
            <div>
              <Button icon={Network}>用户数据对接</Button>
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => openModal("user", {
                  mode: "create",
                  onSave: (values) => setUsers((list) => [
                    ...list,
                    {
                      用户ID: `U2026${String(list.length + 1).padStart(4, "0")}`,
                      用户姓名: values.用户姓名,
                      所属组织名称: values.所属组织,
                      手机号: values.手机号,
                      邮箱: values.邮箱,
                      创建时间: "2026-07-13",
                      账号状态: "启用",
                    },
                  ]),
                })}
              >用户注册</Button>
            </div>
          </div>
          <DataTable
            columns={["用户ID", "用户姓名", "所属组织名称", "手机号", "邮箱", "创建时间", "账号状态"]}
            rows={users.map((row) => ({ ...row, 原始账号状态: row.账号状态, 账号状态: <StatusTag value={row.账号状态} /> }))}
            actions={(row) => (
              <ActionLinks
                actions={[row.原始账号状态 === "启用" ? "禁用" : "启用", "查看详情"]}
                onAction={(action) => {
                  const userId = String(row.用户ID);
                  const user = users.find((item) => item.用户ID === userId);
                  if (!user) return;
                  if (action === "启用" || action === "禁用") updateUser(userId, { 账号状态: action });
                  if (action === "查看详情") openModal("user", { mode: "detail", payload: user });
                }}
              />
            )}
          />
        </>
      )}
    </section>
  );
}

function RoleManagement({ openModal, onPermissionConfig }: { openModal: OpenModal; onPermissionConfig: () => void }) {
  const [roles, setRoles] = useState(roleRows);

  const updateRole = (roleId: string, patch: Partial<(typeof roleRows)[number]>) => {
    setRoles((list) => list.map((role) => (role.角色ID === roleId ? { ...role, ...patch } : role)));
  };

  return (
    <section className="card page-card">
      <div className="filters">
        <FilterInput label="角色ID" placeholder="角色ID" />
        <FilterInput label="角色名称" placeholder="角色名称" />
        <FilterSelect label="状态" options={["启用", "禁用", "废弃"]} />
      </div>
      <div className="table-toolbar">
        <div>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => openModal("role", {
              mode: "create",
              onSave: (values) => setRoles((list) => [
                ...list,
                {
                  角色ID: `R${String(list.length + 1).padStart(3, "0")}`,
                  角色名称: values.角色名称,
                  角色描述: values.角色描述,
                  状态: values.状态,
                  创建人: "系统管理员",
                  创建时间: "2026-07-13",
                  最近修改人: "系统管理员",
                  最近修改时间: "2026-07-13",
                },
              ]),
            })}
          >新建</Button>
        </div>
      </div>
      <DataTable
        columns={["角色ID", "角色名称", "角色描述", "状态", "创建人", "创建时间", "最近修改人", "最近修改时间"]}
        rows={roles.map((row) => ({ ...row, 原始状态: row.状态, 状态: <StatusTag value={row.状态} /> }))}
        actions={(row) => (
          <ActionLinks
            actions={["编辑", row.原始状态 === "废弃" && "删除", "权限配置"]}
            onAction={(action) => {
              const roleId = String(row.角色ID);
              const role = roles.find((item) => item.角色ID === roleId);
              if (!role) return;
              if (action === "编辑") openModal("role", { mode: "edit", payload: role, onSave: (values) => updateRole(roleId, values) });
              if (action === "删除") {
                openModal("delete", {
                  payload: { message: `确认删除${role.角色名称}？` },
                  onConfirm: () => setRoles((list) => list.filter((item) => item.角色ID !== roleId)),
                });
              }
              if (action === "权限配置") onPermissionConfig();
            }}
          />
        )}
      />
    </section>
  );
}

function PageManagement({ openModal }: { openModal: OpenModal }) {
  const [pages, setPages] = useState(pageRows);

  const updatePage = (url: string, patch: Partial<(typeof pageRows)[number]>) => {
    setPages((list) => list.map((page) => (page["地址(URL)"] === url ? { ...page, ...patch } : page)));
  };

  return (
    <section className="card page-card">
      <div className="table-toolbar">
        <div>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => openModal("page", {
              mode: "create",
              onSave: (values) => setPages((list) => [
                ...list,
                {
                  一级页面: values.父页面 || "-",
                  二级页面: values.标题,
                  三级页面: "-",
                  "地址(URL)": values["地址(URL)"],
                  启用属性: values.启用属性,
                },
              ]),
            })}
          >新建/修改页面</Button>
        </div>
      </div>
      <DataTable
        columns={["一级页面", "二级页面", "三级页面", "地址(URL)", "启用属性"]}
        rows={pages.map((row) => ({ ...row, 原始启用属性: row.启用属性, 启用属性: <StatusTag value={row.启用属性} /> }))}
        actions={(row) => (
          <ActionLinks
            actions={["修改", "删除"]}
            onAction={(action) => {
              const url = String(row["地址(URL)"]);
              const page = pages.find((item) => item["地址(URL)"] === url);
              if (!page) return;
              const payload: ModalPayload = {
                标题: page.二级页面,
                "地址(URL)": page["地址(URL)"],
                父页面: page.一级页面,
                启用属性: page.启用属性,
              };
              if (action === "修改") openModal("page", { mode: "edit", payload, onSave: (values) => updatePage(url, { 一级页面: values.父页面 || "-", 二级页面: values.标题, "地址(URL)": values["地址(URL)"], 启用属性: values.启用属性 }) });
              if (action === "删除") {
                openModal("delete", {
                  payload: { message: `确认删除${page.二级页面}？` },
                  onConfirm: () => setPages((list) => list.filter((item) => item["地址(URL)"] !== url)),
                });
              }
            }}
          />
        )}
      />
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
            <div>{allMenuItems.map((page) => <label key={page.key}><input type="checkbox" defaultChecked /><span><b>{page.label}</b><small>若页面管理中页面为禁用，则优先覆盖此处配置。</small></span></label>)}</div>
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

const reportFormFields = ["报告标题", "报告类型", "报告来源", "所属领域", "上传时间", "内容摘要"] as const;
const trackingFormFields = ["事件ID", "所属功能模块", "埋点标签", "埋点路径", "触发机制"] as const;
const userFormFields = ["用户姓名", "手机号", "邮箱", "所属组织"] as const;
const roleFormFields = ["角色名称", "角色描述", "状态"] as const;
const pageFormFields = ["标题", "地址(URL)", "父页面", "启用属性"] as const;

function useModalValues(payload: ModalPayload, fields: readonly string[], aliases: Record<string, string> = {}) {
  const makeValues = () => Object.fromEntries(fields.map((field) => [field, payload[field] ?? payload[aliases[field] ?? ""] ?? ""]));
  const [values, setValues] = useState<ModalPayload>(makeValues);

  useEffect(() => {
    setValues(makeValues());
  }, [payload]);

  return {
    values,
    setValue: (field: string, value: string) => setValues((current) => ({ ...current, [field]: value })),
  };
}

function Modal({ type, mode = "create", payload = {}, onConfirm, onSave, close }: { type: ModalType; mode?: ModalMode; payload?: ModalPayload; onConfirm?: () => void; onSave?: ModalSave; close: () => void }) {
  if (!type) return null;
  if (type === "delete") return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="modal confirm-modal">
        <button className="modal-close" onClick={close}><X size={18} /></button>
        <div className="confirm-icon"><Trash2 size={24} /></div>
        <h2>删除</h2>
        <p>{payload.message}</p>
        <div className="modal-footer"><Button onClick={close}>取消</Button><Button variant="danger" onClick={() => { onConfirm?.(); close(); }}>删除</Button></div>
      </div>
    </div>
  );
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="modal form-modal">
        {type === "report" && <ReportModal close={close} payload={payload} onSave={onSave} />}
        {type === "tracking" && mode === "batch" && <TrackingBatchModal close={close} />}
        {type === "tracking" && mode !== "batch" && <TrackingModal close={close} mode={mode} payload={payload} onSave={onSave} />}
        {type === "user" && <UserModal close={close} mode={mode} payload={payload} onSave={onSave} />}
        {type === "role" && <RoleModal close={close} payload={payload} onSave={onSave} />}
        {type === "page" && <PageModal close={close} payload={payload} onSave={onSave} />}
      </div>
    </div>
  );
}

function ReportModal({ close, payload, onSave }: { close: () => void; payload: ModalPayload; onSave?: ModalSave }) {
  const { values, setValue } = useModalValues(payload, reportFormFields);
  return (
    <>
      <ModalHeader title="报告上传/信息修改" close={close} />
      <form className="modal-form" onSubmit={(e) => { e.preventDefault(); onSave?.(values); close(); }}>
        <div className="modal-form-body">
          <FormField label="PDF格式文件"><FileUploadField /></FormField>
          <div className="form-row">
            <FormField label="报告标题"><input value={values.报告标题} onChange={(event) => setValue("报告标题", event.target.value)} /></FormField>
            <FormField label="报告类型"><FormSelect options={reportTypeOptions} value={values.报告类型} onChange={(value) => setValue("报告类型", value)} /></FormField>
          </div>
          <div className="form-row">
            <FormField label="报告来源"><input value={values.报告来源} onChange={(event) => setValue("报告来源", event.target.value)} /></FormField>
            <FormField label="所属领域"><FormSelect options={["人工智能", "智能制造", "新材料", "低空经济"]} value={values.所属领域} onChange={(value) => setValue("所属领域", value)} /></FormField>
          </div>
          <FormField label="上传时间"><DateField value={values.上传时间} onChange={(value) => setValue("上传时间", value)} /></FormField>
          <FormField label="内容摘要"><textarea value={values.内容摘要} onChange={(event) => setValue("内容摘要", event.target.value)} /></FormField>
        </div>
        <div className="modal-footer"><Button onClick={close}>取消</Button><Button type="submit" variant="primary">保存</Button></div>
      </form>
    </>
  );
}

function TrackingBatchModal({ close }: { close: () => void }) {
  return (
    <>
      <ModalHeader title="批量上传埋点事件" close={close} />
      <form className="modal-form" onSubmit={(event) => { event.preventDefault(); close(); }}>
        <div className="modal-form-body"><FileUploadField accept=".xlsx,.xls,.csv" hint="选择文件" /></div>
        <div className="modal-footer"><Button onClick={close}>取消</Button><Button type="submit" variant="primary">保存</Button></div>
      </form>
    </>
  );
}

function TrackingModal({ close, mode, payload, onSave }: { close: () => void; mode: Exclude<ModalMode, "batch">; payload: ModalPayload; onSave?: ModalSave }) {
  const { values, setValue } = useModalValues(payload, trackingFormFields);
  const isDetail = mode === "detail";
  return (
    <>
      <ModalHeader title={isDetail ? "查看详情" : "新增埋点事件"} close={close} />
      <form className="modal-form" onSubmit={(e) => { e.preventDefault(); onSave?.(values); close(); }}>
        <div className="modal-form-body">
          {trackingFormFields.map((field) => <FormField label={field} key={field}><input readOnly={isDetail} value={values[field]} onChange={(event) => setValue(field, event.target.value)} /></FormField>)}
        </div>
        <div className="modal-footer">{isDetail ? <Button variant="primary" onClick={close}>关闭</Button> : <><Button onClick={close}>取消</Button><Button type="submit" variant="primary">保存</Button></>}</div>
      </form>
    </>
  );
}

function UserModal({ close, mode, payload, onSave }: { close: () => void; mode: ModalMode; payload: ModalPayload; onSave?: ModalSave }) {
  const { values, setValue } = useModalValues(payload, userFormFields, { 所属组织: "所属组织名称" });
  const isDetail = mode === "detail";
  return (
    <>
      <ModalHeader title={isDetail ? "查看详情" : "用户注册"} close={close} />
      <form className="modal-form" onSubmit={(e) => { e.preventDefault(); onSave?.(values); close(); }}>
        <div className="modal-form-body">
          {userFormFields.map((field) => <FormField label={field} key={field}><input readOnly={isDetail} value={values[field]} onChange={(event) => setValue(field, event.target.value)} /></FormField>)}
        </div>
        <div className="modal-footer">{isDetail ? <Button variant="primary" onClick={close}>关闭</Button> : <><Button onClick={close}>取消</Button><Button type="submit" variant="primary">保存</Button></>}</div>
      </form>
    </>
  );
}

function RoleModal({ close, payload, onSave }: { close: () => void; payload: ModalPayload; onSave?: ModalSave }) {
  const { values, setValue } = useModalValues(payload, roleFormFields);
  return (
    <>
      <ModalHeader title="新建/编辑" close={close} />
      <form className="modal-form" onSubmit={(e) => { e.preventDefault(); onSave?.(values); close(); }}>
        <div className="modal-form-body">
          <FormField label="角色名称"><input value={values.角色名称} onChange={(event) => setValue("角色名称", event.target.value)} /></FormField>
          <FormField label="角色描述"><textarea value={values.角色描述} onChange={(event) => setValue("角色描述", event.target.value)} /></FormField>
          <FormField label="状态"><FormSelect options={statusOptions} value={values.状态} onChange={(value) => setValue("状态", value)} /></FormField>
        </div>
        <div className="modal-footer"><Button onClick={close}>取消</Button><Button type="submit" variant="primary">保存</Button></div>
      </form>
    </>
  );
}

function PageModal({ close, payload, onSave }: { close: () => void; payload: ModalPayload; onSave?: ModalSave }) {
  const { values, setValue } = useModalValues(payload, pageFormFields);
  return (
    <>
      <ModalHeader title="新建/修改页面" close={close} />
      <form className="modal-form" onSubmit={(e) => { e.preventDefault(); onSave?.(values); close(); }}>
        <div className="modal-form-body">
          <FormField label="标题"><input value={values.标题} onChange={(event) => setValue("标题", event.target.value)} /></FormField>
          <FormField label="地址(URL)"><input value={values["地址(URL)"]} onChange={(event) => setValue("地址(URL)", event.target.value)} /></FormField>
          <FormField label="父页面"><input value={values.父页面} onChange={(event) => setValue("父页面", event.target.value)} /></FormField>
          <FormField label="启用属性"><FormSelect options={statusOptions} value={values.启用属性} onChange={(value) => setValue("启用属性", value)} /></FormField>
        </div>
        <div className="modal-footer"><Button onClick={close}>取消</Button><Button type="submit" variant="primary">保存</Button></div>
      </form>
    </>
  );
}

function FileUploadField({ id, accept = "application/pdf", hint = "仅支持 PDF 格式文件" }: { id?: string; accept?: string; hint?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const clearFile = () => {
    if (inputRef.current) inputRef.current.value = "";
    setFileName("");
  };
  return (
    <div className="upload-field">
      <input
        ref={inputRef}
        id={id}
        className="upload-file-input"
        type="file"
        accept={accept}
        onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
      />
      <button className="upload-trigger" type="button" onClick={() => inputRef.current?.click()}><Upload size={14} />点击上传</button>
      <small className="upload-hint">{hint}</small>
      {fileName && (
        <div className="upload-file-row">
          <FileText size={16} />
          <span>{fileName}</span>
          <button type="button" aria-label="移除文件" onClick={clearFile}><X size={16} /></button>
        </div>
      )}
    </div>
  );
}

type FormSelectProps = {
  id?: string;
  options: string[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
};

type SelectMenuPosition = { left: number; top: number; width: number };

function FormSelect({ id, options, defaultValue, value, onChange, placeholder = "请选择", ariaLabel }: FormSelectProps) {
  const [internalSelected, setInternalSelected] = useState(defaultValue ?? options[0] ?? "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, options.indexOf(value ?? defaultValue ?? options[0] ?? "")));
  const [menuPosition, setMenuPosition] = useState<SelectMenuPosition | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const selected = value ?? internalSelected;

  const updateMenuPosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMenuPosition({ left: rect.left, top: rect.bottom + 4, width: rect.width });
  };

  useEffect(() => {
    if (!open) return undefined;
    updateMenuPosition();
    const closeOnExternalPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) setOpen(false);
    };
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    document.addEventListener("pointerdown", closeOnExternalPointerDown);
    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
      document.removeEventListener("pointerdown", closeOnExternalPointerDown);
    };
  }, [open]);

  const openMenu = () => {
    if (!options.length) return;
    updateMenuPosition();
    setActiveIndex(Math.max(0, options.indexOf(selected)));
    setOpen(true);
  };

  const moveActive = (offset: number) => {
    if (!options.length) return;
    setActiveIndex((current) => (current + offset + options.length) % options.length);
  };

  const selectOption = (option: string) => {
    if (value === undefined) setInternalSelected(option);
    onChange?.(option);
    setOpen(false);
  };

  return (
    <div
      className={`gkx-select ${open ? "is-open" : ""}`}
      onBlur={(event) => {
        const nextTarget = event.relatedTarget;
        if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        className="gkx-select-trigger"
        aria-label={ariaLabel}
        aria-controls={menuId}
        aria-activedescendant={open ? `${menuId}-option-${activeIndex}` : undefined}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => {
          if (open) setOpen(false);
          else openMenu();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (!open) openMenu();
            else moveActive(event.key === "ArrowDown" ? 1 : -1);
          } else if (event.key === "Home" || event.key === "End") {
            event.preventDefault();
            if (!open) openMenu();
            setActiveIndex(event.key === "Home" ? 0 : Math.max(0, options.length - 1));
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (!open) openMenu();
            else if (options[activeIndex]) selectOption(options[activeIndex]);
          } else if (event.key === "Escape") {
            setOpen(false);
          }
        }}
      >
        <span className={selected ? "" : "is-placeholder"}>{selected || placeholder}</span>
        <ChevronDown aria-hidden="true" size={16} />
      </button>
      {open && menuPosition && createPortal(
        <div
          id={menuId}
          ref={menuRef}
          className="gkx-select-menu"
          role="listbox"
          aria-label={ariaLabel}
          style={menuPosition}
          onMouseDown={(event) => event.preventDefault()}
        >
          {options.map((option, index) => (
            <button
              id={`${menuId}-option-${index}`}
              type="button"
              role="option"
              aria-selected={selected === option}
              className={`${selected === option ? "active" : ""} ${activeIndex === index ? "is-active" : ""}`.trim()}
              key={option}
              onClick={() => {
                setActiveIndex(index);
                selectOption(option);
              }}
            >
              {option}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </div>
  );
}

type FormMultiSelectProps = Omit<FormSelectProps, "defaultValue" | "value" | "onChange"> & {
  value?: string[];
  onChange?: (value: string[]) => void;
};

function FormMultiSelect({ id, options, value, onChange, placeholder = "请选择", ariaLabel }: FormMultiSelectProps) {
  const [internalSelected, setInternalSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuPosition, setMenuPosition] = useState<SelectMenuPosition | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const selected = value ?? internalSelected;
  const selectedText = selected.join("、");

  const updateMenuPosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMenuPosition({ left: rect.left, top: rect.bottom + 4, width: rect.width });
  };

  useEffect(() => {
    if (!open) return undefined;
    updateMenuPosition();
    const closeOnExternalPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) setOpen(false);
    };
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    document.addEventListener("pointerdown", closeOnExternalPointerDown);
    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
      document.removeEventListener("pointerdown", closeOnExternalPointerDown);
    };
  }, [open]);

  const openMenu = () => {
    if (!options.length) return;
    updateMenuPosition();
    setActiveIndex(Math.max(0, options.findIndex((option) => selected.includes(option))));
    setOpen(true);
  };

  const moveActive = (offset: number) => {
    if (!options.length) return;
    setActiveIndex((current) => (current + offset + options.length) % options.length);
  };

  const toggleOption = (option: string) => {
    const next = selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option];
    if (value === undefined) setInternalSelected(next);
    onChange?.(next);
  };

  return (
    <div
      className={`gkx-select ${open ? "is-open" : ""}`}
      onBlur={(event) => {
        const nextTarget = event.relatedTarget;
        if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        className="gkx-select-trigger"
        aria-label={ariaLabel}
        aria-controls={menuId}
        aria-activedescendant={open ? `${menuId}-option-${activeIndex}` : undefined}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => {
          if (open) setOpen(false);
          else openMenu();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (!open) openMenu();
            else moveActive(event.key === "ArrowDown" ? 1 : -1);
          } else if (event.key === "Home" || event.key === "End") {
            event.preventDefault();
            if (!open) openMenu();
            setActiveIndex(event.key === "Home" ? 0 : Math.max(0, options.length - 1));
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (!open) openMenu();
            else if (options[activeIndex]) toggleOption(options[activeIndex]);
          } else if (event.key === "Escape") {
            setOpen(false);
          }
        }}
      >
        <span className={selectedText ? "" : "is-placeholder"}>{selectedText || placeholder}</span>
        <ChevronDown aria-hidden="true" size={16} />
      </button>
      {open && menuPosition && createPortal(
        <div
          id={menuId}
          ref={menuRef}
          className="gkx-select-menu gkx-multiselect-menu"
          role="listbox"
          aria-label={ariaLabel}
          aria-multiselectable="true"
          style={menuPosition}
          onMouseDown={(event) => event.preventDefault()}
        >
          {options.map((option, index) => {
            const isSelected = selected.includes(option);
            return (
              <button
                id={`${menuId}-option-${index}`}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`${isSelected ? "is-selected" : ""} ${activeIndex === index ? "is-active" : ""}`.trim()}
                key={option}
                onClick={() => {
                  setActiveIndex(index);
                  toggleOption(option);
                }}
              >
                <i aria-hidden="true" />
                {option}
              </button>
            );
          })}
        </div>,
        document.body,
      )}
    </div>
  );
}

function DateField({ id, value, onChange }: { id?: string; value?: string; onChange?: (value: string) => void }) {
  return (
    <span className="date-field-control">
      <input id={id} type="date" value={value} onChange={(event) => onChange?.(event.target.value)} />
      <CalendarDays aria-hidden="true" size={16} />
    </span>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  const fieldId = useId();
  const control = isValidElement<{ id?: string }>(children) ? cloneElement(children, { id: fieldId }) : children;
  return <div className="form-field"><label className="form-field-label" htmlFor={fieldId}>{required && <em>*</em>}{label}</label>{control}</div>;
}

function ModalHeader({ title, subtitle, close }: { title: string; subtitle?: string; close: () => void }) {
  return <header className="modal-header"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div><button onClick={close}><X size={20} /></button></header>;
}

function Sidebar({ active, setActive, collapsed, setCollapsed }: { active: PageKey; setActive: (p: PageKey) => void; collapsed: boolean; setCollapsed: (v: boolean) => void }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 审核管理: true, 埋点管理: true });
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="brand">
        <img src="./assets/gkx-logo.png" alt="国科信" />
        {!collapsed && <strong>国科信门户管理系统</strong>}
      </div>
      <button className="sidebar-fold" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "展开侧栏" : "收起侧栏"}>
        <img src={collapsed ? "./assets/sidebar-collapsed.svg" : "./assets/sidebar-expanded.svg"} alt="" />
      </button>
      <nav>
        {navSections.map((section) => (
          <div className="nav-section-block" key={section.label}>
            {!collapsed && <div className="nav-section-title">{section.label}</div>}
            {section.items.map((item) => {
              const ItemIcon = item.icon;
              const isLeafActive = item.key === active;
              const hasActiveChild = item.children?.some((child) => child.key === active) ?? false;
              const isOpen = expanded[item.label] ?? hasActiveChild;
              if (item.key) {
                return (
                  <button className={`group-button nav-leaf ${isLeafActive ? "active" : ""}`} title={collapsed ? item.label : undefined} onClick={() => setActive(item.key!)} key={item.label}>
                    <ItemIcon size={19} />
                    {!collapsed && <span>{item.label}</span>}
                  </button>
                );
              }
              return (
                <div className={`nav-group ${hasActiveChild ? "has-active" : ""}`} key={item.label}>
                  <button className="group-button nav-parent" title={collapsed ? item.label : undefined} onClick={() => collapsed ? setActive(item.children![0].key) : setExpanded({ ...expanded, [item.label]: !isOpen })}>
                    <ItemIcon size={19} />
                    {!collapsed && <><span>{item.label}</span><ChevronDown className={isOpen ? "rotate" : ""} size={15} /></>}
                  </button>
                  {!collapsed && isOpen && <div className="group-children">{item.children?.map((child) => <button className={active === child.key ? "active" : ""} onClick={() => setActive(child.key)} key={child.key}>{child.label}</button>)}</div>}
                </div>
              );
            })}
          </div>
        ))}
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
  const [modal, setModal] = useState<{ type: ModalType; mode: ModalMode; payload: ModalPayload; onConfirm?: () => void; onSave?: ModalSave }>({ type: null, mode: "create", payload: {} });
  const [command, setCommand] = useState(false);
  const currentTitle = pageLabels[active];
  const openModal: OpenModal = (type, options = {}) => setModal({
    type,
    mode: options.mode ?? "create",
    payload: options.payload ?? {},
    onConfirm: options.onConfirm,
    onSave: options.onSave,
  });
  const go = (key: PageKey) => { setActive(key); setMobileOpen(false); };
  const page = useMemo(() => {
    if (active === "report-management") return <ReportManagement openModal={openModal} />;
    if (active === "workflow-center") return <WorkflowCenter openModal={openModal} />;
    if (active === "form-center") return <FormCenter />;
    if (active === "audit-content") return <AuditContent />;
    if (active === "event-info") return <EventTracking key="event-info" initialTab="info" openModal={openModal} />;
    if (active === "event-dashboard") return <EventTracking key="event-dashboard" initialTab="stats" openModal={openModal} />;
    if (active === "org-management") return <UserManagement key="org-management" initialTab="org" openModal={openModal} />;
    if (active === "user-management") return <UserManagement openModal={openModal} />;
    if (active === "role-management") return <RoleManagement openModal={openModal} onPermissionConfig={() => go("permission-config")} />;
    if (active === "page-management") return <PageManagement openModal={openModal} />;
    if (active === "resource-management") return <ResourceManagement />;
    return <PermissionConfig />;
  }, [active]);
  return (
    <div className={`app-shell ${collapsed ? "is-sidebar-collapsed" : ""}`}>
      <div className={mobileOpen ? "mobile-sidebar open" : "mobile-sidebar"}><Sidebar active={active} setActive={go} collapsed={collapsed} setCollapsed={setCollapsed} /></div>
      {mobileOpen && <button className="mobile-overlay" onClick={() => setMobileOpen(false)} aria-label="关闭导航" />}
      <TopBar collapsed={collapsed} onMenu={() => setMobileOpen(!mobileOpen)} onSearch={() => setCommand(true)} />
      <main className={collapsed ? "main collapsed" : "main"}>
        <div className="page-heading"><p><img src="./assets/breadcrumb-home.svg" alt="" /> <span>/</span> {currentTitle}</p></div>
        <div className="page-content">
          <div className="page-body">{page}</div>
        </div>
      </main>
      <Modal type={modal.type} mode={modal.mode} payload={modal.payload} onConfirm={modal.onConfirm} onSave={modal.onSave} close={() => setModal({ type: null, mode: "create", payload: {} })} />
      {command && <div className="modal-backdrop command-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setCommand(false)}><div className="command-box"><label><Search size={20} /><input autoFocus placeholder="搜索菜单…" /><kbd>ESC</kbd></label><p>快速导航</p><div>{allMenuItems.map(item => <button key={item.key} onClick={() => { go(item.key); setCommand(false); }}><span><LayoutGrid size={16} />{item.label}</span><small>菜单 <ChevronRight size={14} /></small></button>)}</div></div></div>}
    </div>
  );
}
