import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import cx from "classnames";
import "./style.scss";

interface IFieldProps {
	name: string;
	value?: boolean;
}

interface ICheckboxProps {
	className?: string | null;
	label?: string | null;
	checked: boolean;
	field: IFieldProps;
	onChange?: () => any,

	[x: string]: any;
}

const CheckboxComponent: FC<ICheckboxProps> = ({
												   className = null,
												   label = null,
												   checked = false,
												   field,
												   onChange,
												   ...props
											   }): JSX.Element => {
	const { t } = useTranslation();
	const classes = cx("form-check mt-3", className);

	return (
		<div className={classes}>
			<input
				{...props}
				type="checkbox"
				className="form-check-input"
				checked={field.value}
				name={field.name}
				onChange={onChange}
			/>
			<label className="form-check-label">
				{t(label)}
			</label>
		</div>
	);
};

export default CheckboxComponent;
