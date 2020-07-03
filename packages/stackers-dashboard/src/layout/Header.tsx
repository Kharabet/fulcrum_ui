import React from "react";
import { ReactComponent as LogoBzx } from "../assets/images/logo-bzx.svg"
import { HeaderMenu } from "./HeaderMenu";
import { Link } from "react-router-dom";
import { OnChainIndicator } from "../components/OnChainIndicator";

interface IHeaderProps {
  doNetworkConnect: () => void;
}

export const Header = (props: IHeaderProps) => {
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
            <OnChainIndicator doNetworkConnect={props.doNetworkConnect} />
          </div>
        </div>
      </div>
    </header>
  );
}
