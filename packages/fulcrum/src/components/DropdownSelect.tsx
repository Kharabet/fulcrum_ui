import React, { useState, useEffect } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

import "../styles/components/dropdown-select.scss"
import { Asset } from '../domain/Asset';
import { AssetsDictionary } from '../domain/AssetsDictionary';
import { AssetDetails } from '../domain/AssetDetails';
export interface IDropDownSelectOption {
  baseToken: Asset;
  quoteToken: Asset;

}
export interface IDropdownSelectProps {
  options: IDropDownSelectOption[];
  selectedOption: IDropDownSelectOption;
  onDropdownSelect: (baseToken: string, quoteToken: string) => void;
}

export const DropdownSelect = (props: IDropdownSelectProps) => {

  let asset = AssetsDictionary.assets.get(props.selectedOption.baseToken) as AssetDetails;
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
    const search = document.querySelector(".select-options__search") as HTMLElement;
    const inputSelect = document.querySelector(".select-options__input") as HTMLElement;
    const target = e.target as HTMLElement;
    if (target == selectStyled || target == search || target == inputSelect) return;
    selectStyled.classList.remove('active');

    ul.style.display = 'none';

  };

  const onLiClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const li = e.currentTarget;
    const select = e.currentTarget.closest(".select") as HTMLElement;
    const ul = select.querySelector("ul.select-options") as HTMLElement;
    const selectStyled = select.querySelector(".styled-select") as HTMLElement;
    // const selectNative = select.querySelector("select.select-hidden") as HTMLSelectElement
    selectStyled.classList.remove('active');
    // selectNative.selectedIndex = parseInt(li.dataset.index!);
    ul.style.display = 'none';
    await props.onDropdownSelect(li.dataset.basetoken!, li.dataset.quotetoken!);
  }

  const [inputValue, setInput] = useState("");
  const [options, setOptions] = useState(props.options);

  useEffect(() => {
    document.addEventListener('click', onClickOutOfComponent);

    return () => {
      // returned function will be called on component unmount 
      document.removeEventListener('click', onClickOutOfComponent)
    }
  }, [])

  useEffect(() => {

    const searchString = inputValue.toLowerCase();
    const result = inputValue === "" ?
      props.options :
      props.options.filter((option) => option.baseToken.toLowerCase().includes(searchString)
        || option.quoteToken.toLowerCase().includes(searchString)
        || `${option.baseToken.toLowerCase()}-${option.quoteToken.toLowerCase()}`.includes(searchString));
    setOptions(result);
  }, [inputValue])

  return (
    <div className="select">
      {/* <select className="select-hidden" value={props.selectedOption.value}>
        {props.options.map(option => option != props.selectedOption && (<option value={option.value}>{option.displayName}</option>))}
      </select> */}
      <div className="styled-select" onClick={onStyledSelectClick}>
        Select market {asset.reactLogoSvg.render()} {props.selectedOption.baseToken}-{props.selectedOption.quoteToken}
      </div>
      <ul className="select-options">
        <div className="select-options__search">
          <input className="select-options__input" placeholder=""
            onChange={(e) => setInput(e.target.value)}
            value={inputValue}
          />
          <label className="select-options__value">{inputValue}</label>
        </div>
        <SimpleBar style={{ maxHeight: 480 }} autoHide={false}>
          {options.map((option, i) =>
            (<li data-basetoken={option.baseToken}
              data-quotetoken={option.quoteToken}
              data-index={i}
              key={i}
              onClick={onLiClick}>
              {AssetsDictionary.assets.get(option.baseToken)!.reactLogoSvg.render()}
              {option.baseToken}-{option.quoteToken}
            </li>)
          )
          }
        </SimpleBar>

        {!options.length &&
          <div className="message">
            <span>  No markets match your search</span>
          </div>
        }
      </ul>

    </div>
  )
}