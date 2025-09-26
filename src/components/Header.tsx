// @ts-nocheck
import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Header() {
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2 font-bold">
            <span className="text-primary">FinLib</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/"
              className={cn(
                "transition-colors hover:text-foreground/80",
                location.pathname === "/" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Planejador Financeiro
            </Link>
            <Link
              to="/transactions"
              className={cn(
                "transition-colors hover:text-foreground/80",
                location.pathname === "/transactions" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Receitas e Despesas
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}