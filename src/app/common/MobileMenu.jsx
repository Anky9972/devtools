"use client";
import React, { useState } from "react";
import { cn } from "@/app/lib/utils";
import { ChevronDown, ChevronRight, Home, FileText, Clock, Calculator, Database, Code, Type, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";


const menuItems = [
  { icon: Home, label: "Home", path: "/" },
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
      { label: "JSON Formatter", path: "/data-tools/json-formatter" },
      { label: "Password Generator", path: "/data-tools/generate-password" },
      { label: "QR Generator", path: "/data-tools/generate-qr" },
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

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    <div className="lg:hidden">
      <div className="flex items-center justify-end">
        <button
          className="p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {!isOpen ? <Menu className="h-6 w-6" /> : <X className="h-6 w-6" />}
        </button>
      </div>
      {isOpen && (
        <div className="fixed inset-0 min-h-72 top-16 backdrop-blur-sm bg-opacity-55 bg-gray-50 z-20 flex flex-col py-4 px-6 overflow-y-auto">
          {menuItems.map((item) => renderMenuItem(item))}
        </div>
      )}
    </div>
  );
};

export default MobileMenu;