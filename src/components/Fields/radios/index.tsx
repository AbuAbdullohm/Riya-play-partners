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
	options: [];
	borderColor: "white" | "gray" | "black" | "blue" | "dark-gray";
	onChange: () => any;
	[x: string]: any;
}

const RadioButtons: FC<IRadioButtonProps> = ({ options, id, label, checked, className, borderColor = "gray", onChange }): JSX.Element => {
	const { t } = useTranslation();

	const classNames = cx("form-check mt-2 mr-5", className ? className : "");

	return (
		<>
			<label>{label}</label>
			<div className="d-flex align-items-center mb-5">
				{options.map(({ label, value }) => {
					return (
						<div className={classNames}>
							<input
								id={value}
								name={id}
								type="radio"
								className={`form-check-input border-${borderColor}`}
								value={value}
								onChange={onChange}
								checked={checked === value}
							/>
							<label className="form-check-label" htmlFor={value}>
								{t(label)}
							</label>
						</div>
					);
				})}
			</div>
		</>
	);
};

export default RadioButtons;
