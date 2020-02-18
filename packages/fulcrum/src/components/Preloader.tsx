import React from 'react';

export interface IPreloaderProps {

}

export const Preloader = (props: IPreloaderProps) => {
  return (
    <div className="wrapper-loader">
      <div className="container-loader">
        <div className="item-loader"></div>
      </div>
    </div>
  )
}