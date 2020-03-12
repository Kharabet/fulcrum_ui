import React, { Component } from "react";
import { ReactComponent as CloseIcon } from "../assets/images/ic__close.svg"
export interface IRiskDisclosureProps {
  onClose: () => void;
}

export class RiskDisclosure extends Component<IRiskDisclosureProps> {
  public render() {

    return (
      <div className="disclosure__wrapper">
        <div className="disclosure__header">
          <h2>DeFi Risk Disclosure</h2>
          {<CloseIcon className="disclosure__close" onClick={this.onTokenAddressFormRequestClose} />}
        </div>
        <div className="disclosure__content">
          <p>When using decentralized applications (dApps), it’s critical to remember that YOU are responsible for the security of your digital assets.</p>
          <p>Unlike mainstream financial services, our team can NOT help you recover your funds if you lose your private key.</p>
          <p>While bZx does maintain an insurance fund to protect against the improper liquidation of undercollateralized borrowers, we do NOT insure user funds in the event that the user loses access to - or control over - their private key.</p>
          <p>Here are our safety guidelines for using dApps:</p>
          <h3>Secure your digital assets carefully</h3>
          <ul>
            <li>ALWAYS use a trusted digital wallet provider</li>
            <li>NEVER share your private key and ALWAYS keep a backup</li>
          </ul>
          <h3>Be wary of phishing attacks</h3>
          <ul>
            <li>ALWAYS make sure you have the correct URL</li>
            <li>Team members will NEVER message you first</li>
          </ul>
          <h3>Do your own research</h3>
          <ul>
            <li>ALWAYS evaluate the smart contracts (Read our audits <a href="#">here</a> and <a href="#">here</a>)</li>
            <li>NEVER invest more than you can afford to lose</li>
          </ul>
          <p>To learn more about how to protect yourself from phishing, please read our article on <a href="#">How to stay safe when using Fulcrum and Torque.</a></p>
          <p>We have done our best to make this an effective resource for beginners wanting to learn how to secure their digital assets against the basic risks associated with dApps, however, it’s important to consider that using emerging technologies constitutes a risk unto itself.</p>
          <p>Undiscovered vulnerabilities and the deployment of new dApps may cause unforeseen consequences. Users should always exercise caution when using emerging technologies.</p>
          <p>To get started with tokenized lending and margin trading please visit <a href="https://fulcrum.trade/" target="_blank">https://fulcrum.trade/</a> or head over to <a href="https://torque.loans/#/" target="_blank">https://torque.loans/#/</a> for the smoothest borrowing experience in DeFi.</p>
        </div>
        <div className="disclosure__footer">
          <button onClick={this.onTokenAddressFormRequestClose}>Got it!</button>
        </div>
      </div>
    );
  }
  public onTokenAddressFormRequestClose = () => {
    this.props.onClose();
  };
}
