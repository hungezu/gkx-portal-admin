import {
  AlertTriangle,
  BellRing,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Radio,
  Settings,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import PrdPageRenderer from "./PrdPageRenderer";
import { prdNavGroups, prdPages, prdPageSpecs } from "./prd-system-pages";

type NoticeTone = "success" | "warning" | "info";

function Notice({ message, tone }: { message: string; tone: NoticeTone }) {
  return <div className={`kds-toast is-${tone}`} role="status">{tone === "success" ? <CheckCircle2 size={17} /> : tone === "warning" ? <AlertTriangle size={17} /> : <Radio size={17} />}{message}</div>;
}

export default function PrdKeyDataSystem() {
  const requestedView = new URLSearchParams(window.location.search).get("view");
  const initialPage = prdPages.find((item) => item.id === requestedView) ?? prdPages[0];
  const initialGroup = prdNavGroups.find((group) => group.pages.some((item) => item.id === initialPage.id)) ?? prdNavGroups[0];
  const [activePageId, setActivePageId] = useState(initialPage.id);
  const [expandedGroup, setExpandedGroup] = useState(initialGroup.label);
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notice, setNotice] = useState<{ message: string; tone: NoticeTone } | null>(null);
  const initialSubpage = new URLSearchParams(window.location.search).get("subpage");
  const [subpage, setSubpage] = useState<string | null>(initialSubpage && initialSubpage.length <= 60 ? initialSubpage : initialSubpage ? "情报详情" : null);
  const [selectMenu, setSelectMenu] = useState<{ label: string; left: number; top: number; width: number; options?: string[] } | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const activePage = useMemo(() => prdPages.find((item) => item.id === activePageId) ?? prdPages[0], [activePageId]);
  const activeGroup = useMemo(() => prdNavGroups.find((group) => group.pages.some((item) => item.id === activePage.id)) ?? prdNavGroups[0], [activePage]);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("capability");
    url.searchParams.delete("workspace");
    if (activePage.id === prdPages[0].id) url.searchParams.delete("view"); else url.searchParams.set("view", activePage.id);
    if (subpage) url.searchParams.set("subpage", subpage); else url.searchParams.delete("subpage");
    window.history.replaceState(window.history.state, "", url);
  }, [activePage, subpage]);

  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;
    root.querySelectorAll("h2").forEach((heading) => { if (heading.textContent?.trim() === activePage.label) heading.hidden = true; });
    root.querySelectorAll("p").forEach((paragraph) => { if (paragraph.textContent?.trim() === activePage.description) paragraph.hidden = true; });
    root.querySelectorAll("section > header").forEach((header) => {
      const visibleText = [...header.querySelectorAll("h2,p")].some((node) => !(node as HTMLElement).hidden && node.textContent?.trim());
      if (!visibleText && !header.querySelector("button")) (header as HTMLElement).hidden = true;
    });
    root.querySelectorAll<HTMLElement>(".prd-toolbar, .prd-search-box, .kds-specific-toolbar, .kds-specific-search").forEach((toolbar) => {
      if (!toolbar.querySelector("input")) return;
      toolbar.querySelectorAll("button").forEach((button) => { const text = button.textContent?.trim(); if (text === "搜索" || text === "查询链路") button.textContent = "查询"; });
      const buttonLabels = [...toolbar.querySelectorAll("button")].map((button) => button.textContent?.trim());
      if (!buttonLabels.some((label) => label === "查询" || label === "搜索" || label?.includes("查询链路"))) {
        const query = document.createElement("button");
        query.type = "button"; query.className = "kds-button kds-button-primary"; query.textContent = "查询";
        query.addEventListener("click", () => notify("查询完成", "success"));
        toolbar.appendChild(query);
      }
      if (!buttonLabels.includes("重置")) {
        const reset = document.createElement("button");
        reset.type = "button"; reset.className = "kds-button kds-button-secondary"; reset.textContent = "重置";
        reset.addEventListener("click", () => { toolbar.querySelectorAll<HTMLInputElement>("input").forEach((input) => { input.value = ""; input.dispatchEvent(new Event("input", { bubbles: true })); }); notify("筛选条件已重置", "info"); });
        toolbar.appendChild(reset);
      }
    });
  }, [activePage]);

  const notify = (message: string, tone: NoticeTone = "success") => {
    setNotice({ message, tone });
    window.setTimeout(() => setNotice(null), tone === "warning" ? 4500 : 3000);
  };

  const openSubpage = (label: string) => {
    const safeLabel = label.length > 60 ? "情报详情" : label;
    setSubpage(safeLabel);
    const url = new URL(window.location.href);
    url.searchParams.set("subpage", safeLabel);
    window.history.replaceState(window.history.state, "", url);
  };
  const closeSubpage = () => {
    setSubpage(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("subpage");
    window.history.replaceState(window.history.state, "", url);
  };
  const handleContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const control = (event.target as HTMLElement).closest("button, .prd-alert-cards article, .prd-feed article") as HTMLElement | null;
    if (!control || !control.closest(".kds-capability-content") || (control instanceof HTMLButtonElement && control.disabled)) return;
    if (control.closest(".prd-filter-select")) return;
    const label = (control.querySelector("h2")?.textContent || control.querySelector("strong")?.textContent || control.textContent || control.getAttribute("aria-label") || "操作").trim();
    if (!label) return;
    if (activePage.id === "U02" && (!(control instanceof HTMLButtonElement) || label.includes("查看详情"))) {
      setActivePageId("U03");
      setExpandedGroup("情报中心");
      setSubpage(null);
      return;
    }
    if (activePage.id === "U07" && /(新建订阅规则|编辑)/.test(label)) {
      setActivePageId("U08");
      setExpandedGroup("我的订阅");
      setSubpage(null);
      return;
    }
    if (activePage.id === "A03" && label.includes("查看详情")) {
      setActivePageId("A04");
      setExpandedGroup("数据接入");
      setSubpage(null);
      return;
    }
    if (activePage.id === "U03" && label.includes("时间线")) {
      setActivePageId("U04");
      setExpandedGroup("情报中心");
      setSubpage(null);
      return;
    }
    if (!(control instanceof HTMLButtonElement)) {
      openSubpage(label);
      return;
    }
    if (label.includes("更多操作")) {
      const rect = control.getBoundingClientRect();
      setSelectMenu({ label: "更多操作", left: rect.right - 148, top: rect.bottom + 4, width: 148, options: prdPageSpecs[activePage.id]?.actions?.slice(2) ?? ["查看详情", "停用"] });
      return;
    }
    if (control.querySelector(".lucide-chevron-down")) {
      const rect = control.getBoundingClientRect();
      setSelectMenu({ label: label.replace(/请选择|全部/g, "") || "选项", left: rect.left, top: rect.bottom + 4, width: Math.max(rect.width, 140) });
      return;
    }
    if (/(查看|详情|进入|编辑|配置|管理|预览|追踪|诊断|原文|明细|路径|文档|调试|标注|审核|新建|发起|办理|模拟)/.test(label)) {
      openSubpage(label);
      return;
    }
    notify(`${label}操作已完成`, /(删除|撤回|停用|退回|忽略)/.test(label) ? "warning" : "success");
  };

  return <div className={`kds-app${collapsed ? " is-collapsed" : ""}`} onClickCapture={handleContentClick}>
    <aside className="kds-sidebar">
      <div className="kds-brand"><img src="/assets/gkx-logo.png" alt="" /><span><strong>国科信</strong><small>关键数据更新订阅推送系统</small></span></div>
      <nav aria-label="系统导航">{prdNavGroups.map((group) => {
        const open = expandedGroup === group.label;
        const active = group.label === activeGroup.label;
        const visiblePages = group.pages.filter((item) => !item.navHidden);
        const single = visiblePages.length === 1;
        return <section className={`kds-nav-group${active ? " has-active" : ""}`} key={group.label}>
          <button className={`kds-nav-parent${single && active ? " is-active" : ""}`} type="button" aria-expanded={single ? undefined : open} title={collapsed ? group.label : undefined} onClick={() => {
            if (single) {
              setActivePageId(visiblePages[0].id);
              setExpandedGroup(group.label);
            } else setExpandedGroup(open ? "" : group.label);
          }}><span>{group.label}</span>{!single && <ChevronDown className={`kds-nav-chevron${open ? " is-open" : ""}`} size={16} />}</button>
          {!single && open && <div className="kds-nav-children">{visiblePages.map((item) => <button className={activePage.id === item.id ? "is-active" : ""} type="button" title={item.label} aria-current={activePage.id === item.id ? "page" : undefined} onClick={() => setActivePageId(item.id)} key={item.id}><span>{item.label}</span></button>)}</div>}
        </section>;
      })}</nav>
      <button className="kds-sidebar-collapse" type="button" onClick={() => setCollapsed((value) => !value)}>{collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}<span>收起导航</span></button>
    </aside>

    <header className="kds-topbar">
      <div className="kds-system-context"><span className="kds-environment">生产环境</span><Radio size={16} /><span>实时连接正常</span><i />最后刷新 10:35:20</div>
      <div className="kds-top-actions">
        <button aria-label="S 级告警，1 条未确认" title="S 级告警" type="button" onClick={() => openSubpage("S 级告警")}><AlertTriangle size={18} /><i /></button>
        <button aria-label="消息中心，6 条未读" title="消息中心" type="button" onClick={() => openSubpage("消息中心")}><BellRing size={18} /></button>
        <button aria-label="统一待办，5 项待处理" title="统一待办" type="button" onClick={() => openSubpage("统一待办")}><ClipboardCheck size={18} /></button>
        <button aria-label="帮助" title="帮助" type="button" onClick={() => openSubpage("帮助中心")}><CircleHelp size={18} /></button>
        <div className="kds-profile"><button type="button" aria-expanded={profileOpen} onClick={() => setProfileOpen((value) => !value)}><span><UserRound size={17} /></span><b>系统管理员</b><ChevronDown size={14} /></button>{profileOpen && <div><button type="button"><UserRound size={15} />账号信息</button><button type="button"><Settings size={15} />个人设置</button></div>}</div>
      </div>
    </header>

    <main className="kds-main kds-prd-main">
      <header className="kds-prd-page-header">
        <nav aria-label="面包屑">
          {activeGroup.pages.filter((item) => !item.navHidden).length > 1 && <><span>{activeGroup.label}</span><ChevronRight size={14} /></>}
          <strong aria-current="page">{activePage.label}</strong>
        </nav>
      </header>
      <div className="kds-workspace kds-prd-workspace" key={activePage.id}>
        <header className="kds-prd-workspace-heading"><h1>{activePage.label}</h1><p>{activePage.description}</p></header>
        <div className="kds-capability-content" ref={contentRef}><PrdPageRenderer item={{ ...activePage, groupId: activeGroup.label, groupLabel: activeGroup.label }} notify={notify} /></div>
      </div>
    </main>
    {selectMenu && <><button className="arco-select-mask" aria-label="关闭下拉菜单" type="button" onClick={() => setSelectMenu(null)} /><div className="arco-select-popup" role="listbox" aria-label={selectMenu.label} style={{ left: selectMenu.left, top: selectMenu.top, width: selectMenu.width }}>{(selectMenu.options ?? ["全部", `${selectMenu.label} A`, `${selectMenu.label} B`, `${selectMenu.label} C`]).map((option, index) => <button className={!selectMenu.options && index === 0 ? "is-selected" : /(停用|删除|撤回|忽略)/.test(option) ? "is-danger" : ""} role="option" aria-selected={!selectMenu.options && index === 0} type="button" onClick={() => { if (/(查看|详情|编辑|配置)/.test(option)) openSubpage(option); else notify(`${option}操作已执行`, /(停用|删除|撤回|忽略)/.test(option) ? "warning" : "success"); setSelectMenu(null); }} key={option}>{option}</button>)}</div></>}
    {subpage && <div className="prd-subpage-mask" onMouseDown={(event) => event.target === event.currentTarget && closeSubpage()}><aside className="prd-subpage" role="dialog" aria-modal="true" aria-labelledby="prd-subpage-title"><header><div><h2 id="prd-subpage-title" title={subpage}>{subpage}</h2><p>{activePage.label} · 子页面</p></div><button type="button" aria-label="关闭子页面" onClick={closeSubpage}><X size={18} /></button></header><div className="prd-subpage-body"><section><h3>基本信息</h3><dl><div><dt>所属页面</dt><dd>{activePage.label}</dd></div><div><dt>当前操作</dt><dd>{subpage}</dd></div></dl></section><section><h3>操作内容</h3><p>此处承载该操作对应的详情、配置、预览或处理流程，并保留当前列表与筛选上下文。</p></section></div><footer><button type="button" onClick={closeSubpage}>返回</button><button className="kds-button kds-button-primary" type="button" onClick={() => { notify(`${subpage}已保存`); closeSubpage(); }}>确认</button></footer></aside></div>}
    {notice && <Notice {...notice} />}
  </div>;
}
