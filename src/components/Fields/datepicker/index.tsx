import React, { FC, useEffect, useState } from "react";
import DateRangePicker from "react-daterange-picker";
import "react-daterange-picker/dist/css/react-calendar.css";
import cx from "classnames";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Icon } from "../../";
import { UseOutsideClick } from "hooks";
import "./style.scss";

interface IFieldProps {
	name: string;
	value: Date | null | undefined;
}

interface IFormProps {
	setFieldValue: Function;
	touched: any;
	errors: any;
}

interface IDatePickerProps {
	type: "range" | "single" | undefined;
	className?: string;
	format?: string;
	size?: "lg" | "sm";
	placeholder?: string;
	isClearable?: boolean;
	readOnly?: boolean;
	field: IFieldProps;
	form: IFormProps;
	label?: string;
	disabled?: boolean;
	position?: "left" | "right";
	[x: string]: any;
}

const DatePickerComponent: FC<IDatePickerProps> = ({
	type = "single",
	placeholder,
	className = "",
	format = "DD-MM-YYYY",
	size,
	isClearable = true,
	readOnly = false,
	disabled = false,
	field,
	form: { setFieldValue, touched, errors },
	label,
	position = "left",
	...otherProps
}): JSX.Element => {
	const { t } = useTranslation();
	const { isVisible, setIsVisible, ref } = UseOutsideClick();
	const [newDate, setNewDate] = useState<any>();
	const classes = cx("datepicker-component mb-5 relative", className ? className : "");

	const onSelect = (date: any) => {
		const _date = moment(date).format(format);
		setNewDate(date);
		setFieldValue(field.name, _date);
		setIsVisible(!isVisible);
	};

	const handleToday = () => {
		const date = new Date();
		const _date = moment(date).format(format);
		setNewDate(date);
		setFieldValue(field.name, _date);
		setIsVisible(!isVisible);
	};

	const handleClearDate = () => {
		setNewDate(null);
		setFieldValue(field.name, null);
	};

	useEffect(() => {
		setNewDate(field.value);
	}, [field]);

	return (
		<div className={classes} ref={ref}>
			{label && <div className="form-label">{t(label)}</div>}
			<div className={`${isClearable ? " relative" : ""}`}>
				<input
					type="text"
					className={`form-control pl-3 ${size ? ` form-control-${size}` : ""}`}
					readOnly={readOnly}
					{...{ field }}
					onClick={() => setIsVisible(!isVisible)}
					value={newDate ? moment(newDate).format(format) : t(placeholder)}
					disabled={disabled}
					onChange={prevState => prevState}
					{...otherProps}
				/>
				{!disabled ? (
					isClearable && newDate ? (
						<div className={`absolute right-0 ${size === "sm" ? "bottom-1" : "bottom-2"} right-3 cursor-pointer`} onClick={handleClearDate}>
							<Icon name="x" className={`${size === "sm" ? "w-4 h-4" : "w-5 h-5"}`} />
						</div>
					) : (
						<div className={`absolute ${size === "sm" ? "bottom-1" : "bottom-3"} right-3 cursor-pointer`} onClick={() => setIsVisible(!isVisible)}>
							<Icon name="calendar" className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"}`} strokeWidth={5} />
						</div>
					)
				) : null}
			</div>

			{isVisible && (
				<>
					<DateRangePicker
						onSelect={onSelect}
						value={newDate}
						className={`datepicker mt-5 absolute
                            ${touched[field.name] && errors[field.name] && "border-theme-24"} ${position === "left" ? "left-0" : "right-0"}`}
						firstOfWeek={1}
						selectionType={type}
					/>
					{type !== "range" && (
						<div
							className="datepicker-today"
							onClick={handleToday}
							style={{ bottom: touched[field.name] && errors[field.name] ? "-2.6rem" : "-5.3rem" }}>
							{t("Today")}
						</div>
					)}
				</>
			)}

			{touched[field.name] && errors[field.name] && <div className="text-theme-24">{t(errors[field.name])}</div>}
		</div>
	);
};

export default DatePickerComponent;
