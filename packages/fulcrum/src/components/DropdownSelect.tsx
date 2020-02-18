import React, { useEffect } from 'react';
export interface IDropDownSelectOption {
  value: string;
  displayName: string;

}
export interface IDropdownSelectProps {
  options: IDropDownSelectOption[];
  selectedOption: IDropDownSelectOption;
  onDropdownSelect: (value: string) =>  void;
}

export const DropdownSelect = (props: IDropdownSelectProps) => {

  const onStyledSelectClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const select = e.currentTarget.closest(".select") as HTMLElement;
    const ul = select.querySelector("ul.select-options") as HTMLElement;
    const selectStyled = e.currentTarget;

    if (selectStyled.classList.contains("active")) {
      selectStyled.classList.remove("active");
      ul.style.display = 'none';
    } else {
      selectStyled.classList.add("active");
      ul.style.display = 'block';
    }
  }
  const onClickOutOfComponent = (e: MouseEvent) => {

    const ul = document.querySelector("ul.select-options") as HTMLElement;
    const selectStyled = document.querySelector(".styled-select") as HTMLElement;
    const target = e.target as HTMLElement;
    if (target  == selectStyled) return;
    selectStyled.classList.remove('active');

    ul.style.display = 'none';

  };

  const onLiClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const li = e.currentTarget;
    const select = e.currentTarget.closest(".select") as HTMLElement;
    const ul = select.querySelector("ul.select-options") as HTMLElement;
    const selectStyled = select.querySelector(".styled-select") as HTMLElement;
    const selectNative = select.querySelector("select.select-hidden") as HTMLSelectElement
    selectStyled.textContent = li.textContent
    selectStyled.classList.remove('active');
    selectNative.selectedIndex = parseInt(li.dataset.index!);
    ul.style.display = 'none';
    await props.onDropdownSelect(li.dataset.value!);
  }

  useEffect(() => {
    document.addEventListener('click', onClickOutOfComponent);

    return () => {
      // returned function will be called on component unmount 
      document.removeEventListener('click', onClickOutOfComponent)
    }
  }, [])
  return (
    <div className="select">
      <select className="select-hidden" value={props.selectedOption.value}>
        {props.options.map(option => option != props.selectedOption && (<option value={option.value}>{option.displayName}</option>))}
      </select>
      <div className="styled-select" onClick={onStyledSelectClick}>
        {props.selectedOption.displayName}
      </div>
      <ul className="select-options">
        {props.options.map((option, i) => option != props.selectedOption && (<li data-value={option.value} data-index={i} key={i} onClick={onLiClick}>{option.displayName}</li>))}

      </ul>
    </div>
  )
}