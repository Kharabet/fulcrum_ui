import React from 'react';

export interface IPreloaderProps {
width: string
}

export const Preloader = (props: IPreloaderProps) => {
  return (
    <div className="wrapper-loader" style={{width: props.width}}>
      <div className="container-loader">
        <div className="item-loader"></div>
      </div>
    </div>
  )
}