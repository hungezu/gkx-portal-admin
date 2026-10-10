import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PrdKeyDataSystem from "./PrdKeyDataSystem";
import "./key-data-subscription.css";

document.title = "关键数据更新订阅推送系统 - 国科信";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrdKeyDataSystem />
  </StrictMode>,
);
