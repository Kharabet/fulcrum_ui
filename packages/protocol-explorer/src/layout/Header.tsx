import React from "react";
import { ReactComponent as LogoExplorer } from "../assets/images/logo-explorer.svg"
import { HeaderMenu } from "./HeaderMenu";
import { Link } from "react-router-dom";

interface IHeaderProps {
}

export const Header = () => {
  return (
    <header>
      <div className="container">
        <div className="flex jc-sb ai-c">
          <Link to="/" className="logo">
            <LogoExplorer />
          </Link>
          <HeaderMenu />
        </div>
      </div>
    </header>
  );
}
