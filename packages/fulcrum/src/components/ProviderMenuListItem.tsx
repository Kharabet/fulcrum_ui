import React, { Component } from "react";
import { ProviderType } from "../domain/ProviderType";
import { ProviderTypeDictionary } from "../domain/ProviderTypeDictionary";

export interface IProviderMenuListItemProps {
  providerType: ProviderType;
  selectedProviderType: ProviderType;
  isConnected: boolean;
  isActivating: boolean;
  onSelect: (providerType: ProviderType) => void;
}
function Spinner({ color, ...rest }: any) {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke={color} {...rest}>
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)" strokeWidth="2">
          <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
          <path d="M36 18c0-9.94-8.06-18-18-18">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </g>
    </svg>
  )
}
export class ProviderMenuListItem extends Component<IProviderMenuListItemProps> {
  public render() {
    const providerTypeDetails = ProviderTypeDictionary.providerTypes.get(this.props.providerType) || null;
    if (!providerTypeDetails) {
      return null;
    }

    const isProviderTypeActiveClass =
      this.props.isConnected ? "provider-menu__list-item--selected" : "";

    if (this.props.providerType === ProviderType.None) {
      return (
        <li className={`provider-menu__list-item ${isProviderTypeActiveClass}`} onClick={this.onClick}>
          <div className="provider-menu__list-item-content-txt">{providerTypeDetails.displayName}</div>

        </li>
      )
    }
    return (
      <li className={`provider-menu__list-item ${isProviderTypeActiveClass}`} onClick={this.onClick}>
        <div className="provider-menu__list-item-content-txt">{providerTypeDetails.displayName}</div>
        {this.props.isActivating && <Spinner color={'green'} style={{ height: '25%', marginLeft: '-1rem' }} />}
        
        <div className="provider-menu__list-item-content-img">{providerTypeDetails.reactLogoSvgShort.render()}</div>
        {/* {this.props.isConnected ? <span role="img" aria-label="check">
          ✅
                  </span>
          : null} */}

        {/* {this.props.providerType === ProviderType.Squarelink ? <span className="warning" style={{
          textAlign: "center",
          fontSize: "12px",
          color: "var(--trade-header-color)"
        }}>Please note: Squarelink has shutdown. We recommend moving your funds to a different wallet.</span> : null} */}
      </li>
    );
  }

  private onClick = () => {
    this.props.onSelect(this.props.providerType);
  };
}
