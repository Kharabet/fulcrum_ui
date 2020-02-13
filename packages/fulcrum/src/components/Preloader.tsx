import React from 'react'; // we need this to make JSX compile

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