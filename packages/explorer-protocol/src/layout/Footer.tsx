import React from "react";
import { FooterMenu } from "./FooterMenu";
import { FooterSocial } from "./FooterSocial";

export const Footer = () => {
  return (
    <footer className="py-90">
      <div className="container">
        <div className="flex">
          <FooterSocial />
          <FooterMenu />
        </div>
      </div>
    </footer>
  );
}
