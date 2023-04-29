import React, { useState, FC } from "react";
import cx from "classnames";
import { get } from "lodash";

import { Icon } from "../../../";
import { UseOutsideClick } from "hooks";
import "./style.scss";

interface ISelectItem {
	id: number | string;
	value: number | string | boolean;
	[x: string]: any;
}

interface ISelectDropdownProps {
	items: ISelectItem[];
	initialValue: string | number | boolean | object;
	className?: string;
	optionValue: string;
	optionLabel: string;
	placeholder?: string;
	setValue: Function;
	[x: string]: any;
}

const SelectDropdownComponent: FC<ISelectDropdownProps> = ({
	items,
	initialValue,
	optionValue,
	optionLabel,
	placeholder,
	setValue,
	className = "",
	...otherProps
}): JSX.Element => {
	const initValue = initialValue
		? initialValue
		: items
		? items[0].optionValue
		: placeholder;
	const [select, setSelect] = useState({id: 0, value: initValue});
	const { ref, isVisible, setIsVisible } = UseOutsideClick(false);
	const classNames = cx(
		"select-container",
		isVisible ? "active" : "",
		className ? className : ""
	);
	return (
		<div className={classNames} {...otherProps}>
			<div
				ref={ref}
				className="select-label"
				onClick={() => setIsVisible(!isVisible)}>
				<span>{select ? select.value : initialValue}</span>
				<Icon
					name={isVisible ? "chevron-up" : "chevron-down"}
					size={20}
				/>
			</div>
			<div
				className={`select-options-containers${
					isVisible ? " visible" : ""
				}`}>
				<ul className="select-options">
					{items &&
						items.length > 0 &&
						items.map((item: any, i: number) => {
							const id = get(item, "id") ? get(item, "id") : i;
							const optValue = get(item, optionValue);
							const optLabel = get(item, optionLabel);
							return (
								<li
									className={`select-option ${select && id === select.id ? "selected" : ""}`}
									key={id}
									onClick={() => {
										setSelect({id, value: optValue});
										setIsVisible(false);
										setValue(optValue);
									}}>
									{optLabel}
								</li>
							);
						})}
				</ul>
			</div>
		</div>
	);
};

export default SelectDropdownComponent;
