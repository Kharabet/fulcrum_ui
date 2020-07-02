import React from "react";
import { ReactComponent as LogoBzx } from "../assets/images/logo-bzx.svg"
import { HeaderMenu } from "./HeaderMenu";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header>
      <div className="container container-md">
        <div className="flex jc-sb ai-c ta-c">
          <Link to="/" className="logo">
            <LogoBzx />
          </Link>
          <HeaderMenu />
          <div className="flex ai-c header-right">
            <Link to="https://help.bzx.network/en/" className={`item-menu`}>
              Help Center
            </Link>
            <div className="wallet">Click to Connect Wallet</div>
          </div>
        </div>
      </div>
    </header>
  );
}
