import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import cx from "classnames";
import './style.scss'
interface IFieldProps {
	name: string;
	value?: boolean;
}

interface ISwitchProps {
	className?: string;
	label?: string;
	field: IFieldProps;
	checked: boolean;
	onChange?: () => any;
	[x: string]: any;
}

const SwitchComponent: FC<ISwitchProps> = ({
	className = null,
	label = null,
	checked = false,
	field,
	onChange,
	...props
}): JSX.Element => {
	const { t } = useTranslation();
	const classes = cx("form-check mb-5", className);
	return (
		<div className={classes}>
			<input
				id={field.name}
				className="form-check-switch"
				type="checkbox"
				checked={field.value}
				name={field.name}
				onChange={onChange}
                {...props}
			/>
			<label className="form-check-label" htmlFor={field.name}>
				{t(label)}
			</label>
		</div>
	);
};

export default SwitchComponent;
