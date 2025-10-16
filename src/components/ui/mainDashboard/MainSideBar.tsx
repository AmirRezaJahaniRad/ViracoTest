import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  Drawer,
  Box,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
  Toolbar,
} from "@mui/material";

// ICONS
import MenuIcon from "@mui/icons-material/Menu";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import PublicIcon from "@mui/icons-material/Public";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

type MenuItem = {
  title: string;
  path?: string;
  children?: MenuItem[];
};

// Mock-Data
const menuData: MenuItem[] = [
  {
    title: "حسابداری",
    path: "/accounting",
    children: [
      { title: "سند حسابداری", path: "/accounting/documents" },
      { title: "ترازنامه", path: "/accounting/balance" },
      {
        title: "گزارشات",
        children: [
          { title: "گزارش ماهانه", path: "/accounting/reports/monthly" },
          { title: "گزارش سالانه", path: "/accounting/reports/yearly" },
        ],
      },
    ],
  },
  {
    title: "تنظیمات",
    path: "/settings",
    children: [
      { title: "کاربران", path: "/settings/users" },
      { title: "سطوح دسترسی", path: "/settings/roles" },
      {
        title : "امیررضا" ,
        children : [
          { title: "گزارش ماهانه", path: "/accounting/reports/monthly" },
          { title: "گزارش سالانه", path: "/accounting/reports/yearly" },
        ]
      }
    ],
  },
  {
    title: "عمومی",
    path: "/general",
    children: [
      { title: "تعاریف پایه", path: "/general/base" },
      { title: "واحدها", path: "/general/units" },
    ],
  },
  {
    title: "مودیان",
    path: "/clients",
    children: [
      { title: "لیست مودیان", path: "/clients/list" },
      { title: "ثبت مودی جدید", path: "/clients/add" },
    ],
  },
];

const iconMap: Record<string, JSX.Element> = {
  "حسابداری": <AccountBalanceIcon />,
  "تنظیمات": <SettingsIcon />,
  "عمومی": <PublicIcon />,
  "مودیان": <PeopleIcon />,
};

const COLLAPSED_WIDTH = 64;
const EXPANDED_WIDTH = 270;

const MainSideBar : React.FC = () => {
  
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState<boolean>(true);
  // which top-level Accordion is expanded (title) — only used in expanded mode for top-level accordions
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);
  // nested expanded keys for recursive nodes
  const [openKeys, setOpenKeys] = useState<Record<string, boolean>>({});

  const toggleKey = useCallback((key: string) => {
    setOpenKeys(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleTopAccordionChange = (title: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    console.log(event);
    setExpandedAccordion(isExpanded ? title : false);
  };

  const keyFor = (ancestors: string[], title: string) => {
    return [...ancestors, title].join("/");
  };

  const renderTree = (items: MenuItem[], ancestors: string[] = []) => {
    return (
      <List component="div" disablePadding>
        {items.map((it) => {
          const key = keyFor(ancestors, it.title);
          const hasChildren = Array.isArray(it.children) && it.children.length > 0;
          return (
            <React.Fragment key={key}>
              <ListItemButton
                dense
                sx={{ pl: (ancestors.length + 1) * 2 }}
                onClick={() => {
                  if (hasChildren) toggleKey(key);
                  else if (it.path) navigate(it.path);
                }}
              >
                <ListItemText primary={it.title} />
                {hasChildren && (openKeys[key] ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>

              {hasChildren && (
                <Collapse in={!!openKeys[key]} timeout="auto" unmountOnExit>
                  {renderTree(it.children!, [...ancestors, it.title])}
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </List>
    );
  };

  // in collapsed mode: show vertical icon buttons for top-level items
  const collapsedView = (
    <Box sx={{ width: COLLAPSED_WIDTH, display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <IconButton onClick={() => setCollapsed(false)} size="small">
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, mt: 1 }}>
        {menuData.map((m) => (
          <IconButton
            key={m.title}
            title={m.title}
            size="large"
            onClick={() => {
              if (m.path) navigate(m.path);
              else if (m.children) {
                setCollapsed(false);
                setTimeout(() => setExpandedAccordion(m.title), 120);
              }
            }}
          >
            {iconMap[m.title] ?? <AccountBalanceIcon />}
          </IconButton>
        ))}
      </Box>
    </Box>
  );

  // expanded view: Drawer wide + top-level Accordions with icon + title headline
  const expandedView = (
    <Box sx={{ width: EXPANDED_WIDTH }}>
      <Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 1 }}>
        <Box component="span" sx={{ fontWeight: "bold" }}>منو</Box>
        <IconButton onClick={() => setCollapsed(true)} size="small">
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <Box sx={{ px: 1 }}>
        {menuData.map((m) => (
          <Accordion
            key={m.title}
            disableGutters
            elevation={0}
            expanded={expandedAccordion === m.title}
            onChange={handleTopAccordionChange(m.title)}
            sx={{ "&:before": { display: "none" } }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ py: 0, px: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>{iconMap[m.title] ?? <AccountBalanceIcon />}</ListItemIcon>
              <Box sx={{ ml: 1 }}>{m.title}</Box>
            </AccordionSummary>
            <AccordionDetails sx={{ py: 0, px: 0 }}>
              {/* If the top-level item has a path and you want clicking header to navigate instead of only expand,
                  you could add a small button. Here header controls expansion; leaf navigation handled below. */}
              {m.children ? renderTree(m.children, [m.title]) : (
                <ListItemButton onClick={() => m.path && navigate(m.path)}>
                  <ListItemText primary={m.title} />
                </ListItemButton>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );

  return (
    <nav aria-label="sidebar" dir="rtl">
      <Drawer
        variant="permanent"
        open
        sx={{
          width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
            boxSizing: 'border-box',
            transition: 'width 200ms',
            overflowX: 'hidden',
            zIndex : -1,
            marginTop : 8
          }
        }}
      >
        {collapsed ? collapsedView : expandedView}
      </Drawer>
    </nav>
  );
}

export default MainSideBar;