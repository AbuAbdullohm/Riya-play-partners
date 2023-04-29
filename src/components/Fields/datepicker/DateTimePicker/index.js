import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from "prop-types";
import cx from "classnames";

import "./style.css";

export const fixTimezoneOffset = date => {
	if (!date) return "";
	return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toJSON();
};

const DatePickerField = ({
	placeholder,
	className,
	isClearable = true,
	readOnly,
	field,
	form: { setFieldValue, touched, errors },
	label,
	disabled,
	format = "dd.MM.yyyy"
}) => {
	const classes = cx("datepicker-component mb-5 relative", className ? className : "");
	return (
		<div className={classes}>
			{label && <div className="form-label">{label}</div>}
			<DatePicker
				selected={() => field.value}
				onChange={value => setFieldValue(field.name, value)}
				dateFormat={format}
				timeIntervals={1}
				showMonthDropdown
				showYearDropdown
				dropdownMode="select"
				timeFormat="HH:mm"
				todayButton="Today"
				showTimeSelect
				className={`form-control pl-3 dark:bg-dark-1`}
				disabled={disabled}
				placeholderText={placeholder}
				isClearable={isClearable && !disabled && field.value}
				readOnly={readOnly}
				closeOnScroll={true}
			/>
			{touched[field.name] && errors[field.name] && <div className="text-theme-24">{errors[field.name]}</div>}
		</div>
	);
};

export default DatePickerField;

DatePickerField.propTypes = {
	title: PropTypes.string,
	className: PropTypes.string,
	isClearable: PropTypes.bool,
	readOnly: PropTypes.bool,
	format: PropTypes.string
};
