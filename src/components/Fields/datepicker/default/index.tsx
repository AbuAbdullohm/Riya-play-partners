import React, { FC, ReactNode, useState } from "react";
import { createPortal } from "react-dom";
import DateRangePicker from "react-daterange-picker";
import "react-daterange-picker/dist/css/react-calendar.css";
import cx from "classnames";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Icon, Button } from "components";
import { UseOutsideClick } from "hooks";
import { usePortal } from "hooks";
import "../style.scss";
import { useEffect } from "react";

interface IPortalProps {
	id: string;
	children?: string | ReactNode;
}

const Portal: FC<IPortalProps> = ({ id, children }) => {
	const target = usePortal(id);
	return createPortal(children, target);
};

interface IDatePickerProps {
	className?: string;
	overlayClassName: string;
	format?: string;
	placeholder?: string;
	isClearable?: boolean;
	readOnly?: boolean;
	label?: string;
	disabled?: boolean;
	setValue: Function;
	value: any;
	[x: string]: any;
}

const DatePickerComponent: FC<IDatePickerProps> = ({
	placeholder,
	className = "",
	format = "DD.MM.YYYY",
	overlayClassName = "",
	isClearable = true,
	readOnly = false,
	label,
	setValue,
	value,
	...otherProps
}): JSX.Element => {
	const { t } = useTranslation();
	const { isVisible, setIsVisible, ref } = UseOutsideClick();
	const [newDate, setNewDate] = useState<any>(null);
	const classes = cx("datepicker-component", className ? className : "");
	const [modal, setModal] = useState(false);

	const onSelect = (date: any) => {
		const _date = moment(date).format(format);
		setNewDate(date);
		setValue(_date);
		setModal(!modal);
	};

	useEffect(() => {
		setNewDate(value);
	}, [value]);

	return (
		<>
			{modal && <div className="datepicker-modal__overlay " />}
			<div className={classes} ref={ref} {...otherProps}>
				{label && <div className="form-label">{t(label)}</div>}
				<div className={`${isClearable ? " relative" : ""}`}>
					<div className="absolute top-2 left-3">
						<Icon name="calendar" className="w-4 h-4" strokeWidth={5} />
					</div>
					<input
						type="text"
						className="form-control pl-10"
						readOnly={readOnly}
						onClick={() => setModal(true)}
						value={newDate ? moment(newDate).format(format) : t(placeholder)}
						onChange={prevState => prevState}
					/>
					{isClearable && newDate && (
						<div className="absolute right-0 bottom-2 right-3 cursor-pointer" onClick={() => setNewDate(null)}>
							<Icon name="x" className="w-5 h-5" />
						</div>
					)}
				</div>
				{modal && (
					<Portal id="datepicker-modal">
						<div className="flex flex-column">
							<DateRangePicker onSelect={onSelect} value={newDate} className={`datepicker`} firstOfWeek={1} selectionType="single" />
							<Button.Default type="primary" className="mt-5" onClick={() => setModal(false)}>
								Set time
							</Button.Default>
						</div>
					</Portal>
				)}
			</div>
		</>
	);
};

export default DatePickerComponent;
