import React from "react";
import { ReactComponent as CloseIcon } from "../assets/images/ic__close.svg"

export interface IFindRepresentativeProps {
  onFindRepresentativeClose: () => void;
}

export const FindRepresentative = (props: IFindRepresentativeProps) => {
  return (
    <div className="modal find-representative">
      <div className="modal__title">
        Find a Representative
        <div onClick={props.onFindRepresentativeClose}>
          <CloseIcon className="modal__close" />
        </div>
      </div>
    </div>
  );
}