import React from "react";
import { useTranslation } from "react-i18next";
import NumberFormat from "react-number-format";
import cx from "classnames";
import "./style.scss";

const InputMaskComponent = ({
	className,
	containerClass,
	label = "",
	prefix = "+998",
	format = "(##) ###-##-##",
	mask = "_",
	readOnly = false,
	placeholder = "",
	size = "default",
	// maxVal,
	field,
	form: { touched, errors },
	...otherProps
}) => {
	const { t } = useTranslation();
	const classes = cx("relative mb-5", containerClass ? containerClass : "", className);

	return (
		<div className={classes}>
			{label && <label className="form-label">{t(label)}</label>}
			<NumberFormat
				className="form-control"
				format={format}
				mask={mask}
				prefix={prefix}
				placeholder={t(placeholder)}
				readOnly={readOnly}
				// isAllowed={values => {
				// 	const { formattedValue, floatValue } = values;
				// 	return formattedValue === "" || (floatValue <= 15 && floatValue >= 12);
				// }}
				{...field}
				{...otherProps}
				name={field.name}
				value={field.value}
			/>
			{touched[field.name] && errors[field.name] && <div className="form-field__error">{t(errors[field.name])}</div>}
		</div>
	);
};

export default InputMaskComponent;
