'use client';
import React, { useState } from "react";
import { cn } from "@/app/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  Home,
  FileText,
  Clock,
  Calculator,
  Database,
  Code,
  Type,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const menuItems = [
  {
    icon: Home,
    label: "Home",
    path: "/",
  },
  {
    icon: FileText,
    label: "File Tools",
    children: [
      { label: "File Converter", path: "/file-tools/file-converter" },
      { label: "File Compressor", path: "/file-tools/file-compressor" },
      { label: "Image Optimizer", path: "/file-tools/image-optimizer" },
      { label: "PDF Tools", path: "/file-tools/pdf-tools" },
    ],
  },
  {
    icon: Type,
    label: "Text Tools",
    children: [
      { label: "Text Case Converter", path: "/text-tools/case-converter" },
      { label: "Grammar Checker", path: "/text-tools/grammar-checker" },
      { label: "Lorem Ipsum Generator", path: "/text-tools/lorem-ipsum" },
      { label: "Word Counter", path: "/text-tools/word-counter" },
    ],
  },
  {
    icon: Clock,
    label: "Time Tools",
    children: [
      { label: "Time Zone Converter", path: "/time-tools/timezone" },
      { label: "Date Calculator", path: "/time-tools/date-calc" },
      { label: "Countdown Timer", path: "/time-tools/countdown" },
      { label: "Meeting Planner", path: "/time-tools/meeting-planner" },
      { label: "Pomodoro Timer", path: "/time-tools/pomodoro-timer" },
    ],
  },
  {
    icon: Calculator,
    label: "Calculators",
    children: [
      { label: "Scientific Calculator", path: "/calculators/scientific" },
      { label: "Unit Converter", path: "/calculators/unit-converter" },
      { label: "Percentage Calculator", path: "/calculators/percentage" },
      { label: "Loan Calculator", path: "/calculators/loan" },
      { label: "Currency Calculator", path: "/calculators/currency" },
    ],
  },
  {
    icon: Database,
    label: "Data Tools",
    children: [
      { label: "CSV JSON", path: "/data-tools/csv-json" },
      { label: "Data Visualizer", path: "/data-tools/data-visualizer" },
      { label: "JSON Formatter", path: "/data-tools/json-formatter" },
      { label: "Password Generator", path: "/data-tools/generate-password" },
      { label: "QR Generator", path: "/data-tools/generate-qr" },
      { label: "Copy Paste", path: "/data-tools/copy-paste-bin" },
    ],
  },
  {
    icon: Code,
    label: "Dev Tools",
    children: [
      { label: "SQL to CAML", path: "/dev-tools/sql-to-caml" },
      { label: "Hash Generator", path: "/dev-tools/hash-generator" },
      { label: "Code Beautifier", path: "/dev-tools/code-beautifier" },
      { label: "Base64 Converter", path: "/dev-tools/base64-encoder" },
      { label: "HTML To Markdown", path: "/dev-tools/html-to-markdown" },
      { label: "Markdown To HTML", path: "/dev-tools/markdown-to-html" },
      { label: "XML To JSON", path: "/dev-tools/xml-to-json" },
      { label: "JSON To XML", path: "/dev-tools/json-to-xml" },
      { label: "Markdown Previewer", path: "/dev-tools/markdown-preview" },
      { label: "Regex Tester", path: "/dev-tools/regex-tester" },
    ],
  },
];

const Sidebar = () => {
  const [expandedItems, setExpandedItems] = useState({});
  const pathname = usePathname();

  const toggleExpand = (label) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleItemClick = (item) => {
    if (item.children) {
      toggleExpand(item.label);
    }
  };

  const renderMenuItem = (item, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.label];
    const isSelected = pathname === item.path;

    return (
      <div key={item.label}>
        <Link
          href={item.path ?? "#"}
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault();
              handleItemClick(item);
            }
          }}
          className={cn(
            "flex items-center px-4 py-2 text-sm font-medium rounded-md",
            "hover:bg-gray-100 hover:text-gray-900",
            "group transition-colors duration-150 ease-in-out",
            level > 0 && "pl-8",
            isSelected ? "bg-blue-50 text-blue-600" : "text-gray-600"
          )}
        >
          {item.icon && <item.icon className="mr-3 h-5 w-5" />}
          {item.label}
          {hasChildren && (
            <div className="ml-auto">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          )}
        </Link>
        {hasChildren && isExpanded && (
          <div className="ml-4 border-l border-gray-200">
            {item.children.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r">
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => renderMenuItem(item))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;