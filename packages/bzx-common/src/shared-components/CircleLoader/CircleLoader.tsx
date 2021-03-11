import React from 'react'

interface ICircleLoaderProps {
  children?: React.ReactNode
}
const CircleLoader = (props: ICircleLoaderProps) => {
  return (
    <div className="circle-loader">
      <div className="circle-main"></div>
      <div className="circle-background"></div>
      {props.children}
    </div>
  )
}
export default CircleLoader
