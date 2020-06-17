import React from "react";

export interface IGroupButtonProps {
  setPeriodChart: (period: number) => void;
}
export const GroupButton = (props: IGroupButtonProps) => {

  const onClick = (event: any) => {
    const buttons = document.querySelectorAll('.button-period');
    const gridButtonItems = [].slice.call(buttons);
    gridButtonItems.forEach(function (item: any, i: any) {
      if (item.classList.contains('active')) {
        item.classList.remove('active');
      }
    });
    event.target.classList.add('active');
    const value = event.target.dataset.asset;
    props.setPeriodChart(+value);
  }

  return (
    <div className="group-button">
      <button data-asset="365" onClick={onClick} className="button-period">1 Year</button>
      <button data-asset="90" onClick={onClick} className="button-period">90 Days</button>
      <button data-asset="30" onClick={onClick} className="button-period">30 Days</button>
      <button data-asset="1" onClick={onClick} className="button-period active">1 Day</button>
    </div>
  );
}
