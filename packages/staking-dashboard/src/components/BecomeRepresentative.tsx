import React from "react";
import { ReactComponent as CloseIcon } from "../assets/images/ic__close.svg"

export interface IBecomeRepresentativeProps {
  onBecomeRepresentativeClose: () => void;
}

export const BecomeRepresentative = (props: IBecomeRepresentativeProps) => {
  return (
    <div className="modal become-representative">
      <div className="modal__title">
        Become A Representative
        <div onClick={props.onBecomeRepresentativeClose}>
          <CloseIcon className="modal__close" />
        </div>
      </div>
      <input placeholder="Enter Adress" />
      <button className="button blue">Become A Representative</button>
    </div>
  );
}