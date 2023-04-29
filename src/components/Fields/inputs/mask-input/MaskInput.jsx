import React, { useEffect } from "react";

import PropTypes from "prop-types";
import cx from "classnames";
import InputMask from "react-input-mask";
import { useTranslation } from "react-i18next";
import "./styles.scss";
const MaskInput = ({
	containerClassName,
	className,
	label,
	placeholder,
	disabled,
	type,
	mask,
	separator = "_",
	field,
	size,
	hasborder,
	touchedColor,
	form: { touched, errors, setFieldValue },
	handleChange,
	...props
}) => {
	const { t } = useTranslation();

	const { value = "", name } = field;

	const classesWrap = cx("form-group", touched[name] && errors[name] && "has-error", value && "label-top", containerClassName);
	const classes = cx(
		"form-input",
		size && `form-input__${size}`,
		hasborder && "border",
		touched[name] && errors[name] && "form-input__error",
		!errors[name] && Boolean(value) && `--touched ${touchedColor}`,
		className
	);
	useEffect(() => {
		setFieldValue(name, value.replaceAll(separator, "").replaceAll(" ", ""));
	}, []);

	return (
		<div className="maskInput">
			<div className={classesWrap}>
				{label && <label className="form-label form-label--sm">{label}</label>}
				<InputMask
					className={classes}
					mask={mask}
					placeholder={placeholder}
					type={type}
					disabled={disabled}
					formatChars={{
						"9": "[0-9]",
						A: "[A-Z]"
					}}
					{...props}
					{...field}
					onChange={event => {
						handleChange(event.target.value.replaceAll(separator, "").replaceAll(" ", ""));
						setFieldValue(field.name, event.target.value.replaceAll(separator, "").replaceAll(" ", ""));
					}}
				/>
				{touched[name] && errors[name] && <div className="form-error">{t(errors[name])}</div>}
			</div>
		</div>
	);
};

MaskInput.propTypes = {
	label: PropTypes.string,
	placeholder: PropTypes.string,
	type: PropTypes.oneOf(["text", "password"]),
	className: PropTypes.string,
	mask: PropTypes.string,
	disabled: PropTypes.bool,
	size: PropTypes.oneOf(["normal", "small"]),
	touchedColor: PropTypes.oneOf(["white", "normal"]),
	hasborder: PropTypes.bool,
	handleChange: PropTypes.func
};

MaskInput.defaultProps = {
	label: "",
	placeholder: "",
	type: "text",
	className: null,
	mask: "+999999999999",
	disabled: false,
	size: "normal",
	touchedColor: "normal",
	hasborder: false,
	handleChange: () => {}
};

export default MaskInput;
