import React, { ReactNode, ChangeEvent } from "react";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import cx from "classnames";
import "./style.scss";

interface IRadioButtonProps {
	id: string;
	checked: boolean;
	name: string;
	value: string | number;
	label: string | ReactNode;
	children: string | ReactNode;
	className?: string;
	borderColor: "white" | "gray" | "black" | "blue" | "dark-gray";
	onChange: () => any;
	[x: string]: any;
}

const RadioButton: FC<IRadioButtonProps> = ({ id, name, value, checked, label, className, borderColor = "gray", children, onChange }): JSX.Element => {
	const { t } = useTranslation();

	const classNames = cx("form-check mt-2", className ? className : "");

	return (
		<div className={classNames}>
			<input id={id} type="radio" className={`form-check-input border-${borderColor}`} name={name} value={value} onChange={onChange} checked={checked} />
			<label className="form-check-label" htmlFor={id}>
				{label ? t(label) : t(children)}
			</label>
		</div>
	);
};

export default RadioButton;
