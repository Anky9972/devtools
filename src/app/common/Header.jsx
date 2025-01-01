"use client";
import React from "react";
import {
  PencilRuler,
} from "lucide-react";
import SearchMenu from "./Search";
import MobileMenu from "./MobileMenu";
import { useRouter } from "next/navigation";

const Header = () => {
const router = useRouter();
function handleNavigate(path) {
  router.push(path);
}
  return (
    <header className="w-full border-b bg-white fixed left-0 top-0 z-10">
      <div className="flex h-16 items-center w-full px-4">
        <div className="flex items-center justify-between space-x-5 w-full ">
          <h1
          onClick={()=>handleNavigate('/')}
          className="text-2xl font-bold flex items-center justify-center gap-5 ">
            <span>
              <PencilRuler />
            </span>
            <span className="hidden md:block">DevTools</span>
          </h1>
          <nav className="w-full flex items-center justify-between lg:justify-end ">
            <SearchMenu />
            <div className="lg:hidden">
              <MobileMenu />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
