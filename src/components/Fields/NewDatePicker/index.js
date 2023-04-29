import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { get } from "lodash";
import DatePicker from "react-datepicker";
import qs from "qs";
import "react-datepicker/dist/react-datepicker.css";
import "./style.scss";
import { useHistory } from "react-router-dom";

const NewDatePicker = ({ onChange, data, label, placeholder, type, isToday = false, isClearable = false, form, field, clearButton, ...props }) => {
	const setFieldValue = get(form, "setFieldValue");
	const fieldName = get(field, "name");
	const fieldValue = get(field, "value");
	const history = useHistory();

	// let start_years = new Date().getFullYear() - 100;
	// let end_years = new Date().getFullYear() + 100;
	// const years = range(start_years, end_years, 1);
	// const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const clearForm = () => {
		history.push({
			search: qs.stringify({}, { encode: false })
		});
	};

	return (
		<div className="mb-5">
			<label className="form-label">{label}</label>
			<div className="newDataPicker">
				{type === "range" ? (
					<>
						<DatePicker
							className="newDataPicker form-control"
							selectsRange={true}
							dateFormat="dd/MM/yyyy"
							showYearDropdown
							showMonthDropdown
							placeholderText={placeholder ? placeholder : "DD/MM/YYYY"}
							startDate={fieldValue[0] ? new Date(moment.unix(fieldValue[0]).format("MM/DD/YYYY")) : fieldValue[0]}
							endDate={fieldValue[1] ? new Date(moment.unix(fieldValue[1]).format("MM/DD/YYYY")) : fieldValue[1]}
							dropdownMode="select"
							peekNextMonth
							onChange={value => {
								onChange(
									value.map(item =>
										moment(item)
											.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
											.unix()
									)
								);
								// onChange(
								// 	moment(value[0])
								// 		.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
								// 		.unix(),
								// 	moment(value[1])
								// 		.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
								// 		.unix()
								// );
							}}
							{...props}
						/>
						{clearButton && get(field, "value").length > 0 && get(field, "value")[0] !== null ? (
							<span
								className="datepickerClose"
								onClick={() => {
									setFieldValue(fieldName, []);
									clearForm();
									// data(null);
								}}>
								x
							</span>
						) : (
							get(field, "value").length > 0 &&
							get(field, "value")[0] !== null && (
								<span
									className="datepickerClose"
									onClick={() => {
										setFieldValue(fieldName, []);
									}}>
									x
								</span>
							)
						)}
					</>
				) : (
					<>
						<DatePicker
							selected={isToday ? new Date() : fieldValue ? new Date(fieldValue * 1000) : null}
							placeholderText={placeholder ? placeholder : "DD/MM/YYYY"}
							showYearDropdown
							showMonthDropdown
							dropdownMode="select"
							onChange={value => {
								onChange(
									moment(value)
										.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
										// .utcOffset(0)
										.unix()
								);
							}}
							dateFormat="dd/MM/yyyy"
							{...props}
						/>

						{fieldValue && fieldValue ? (
							<span
								className="datepickerClose"
								onClick={() => {
									setFieldValue(fieldName, null);
								}}>
								x
							</span>
						) : (
							""
						)}
					</>
					// <DatePicker
					// 	selected={isToday ? new Date() : dateRange ? new Date(dateRange * 1000) : null}
					// 	dateFormat="d/MM/yyyy"
					// 	placeholderText={placeholder ? placeholder : "DD/MM/YYYY"}
					// 	onChange={value => {
					// 		setDateRange(
					// 			moment(value)
					// 				.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
					// 				.unix()
					// 		);
					// 		onChange(
					// 			moment(value)
					// 				.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
					// 				.unix()
					// 		);
					// 	}}
					// 	renderCustomHeader={({
					// 		date,
					// 		changeYear,
					// 		changeMonth,
					// 		decreaseMonth,
					// 		increaseMonth,
					// 		prevMonthButtonDisabled,
					// 		nextMonthButtonDisabled
					// 	}) => (
					// 		<div className="newDataPicker_inner">
					// 			<button type="button" onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
					// 				{"<"}
					// 			</button>
					// 			<select value={date.getFullYear()} onChange={({ target: { value } }) => changeYear(value)}>
					// 				{years.map(option => (
					// 					<option key={option} value={option}>
					// 						{option}
					// 					</option>
					// 				))}
					// 			</select>

					// 			<select value={months[date.getMonth()]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}>
					// 				{months.map(option => (
					// 					<option key={option} value={option}>
					// 						{option}
					// 					</option>
					// 				))}
					// 			</select>
					// 			<button type="button" onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
					// 				{">"}
					// 			</button>
					// 		</div>
					// 	)}
					// 	{...otherProps}
					// />
				)}
			</div>
		</div>
	);
};

NewDatePicker.propTypes = {
	form: PropTypes.shape({
		touched: PropTypes.object,
		errors: PropTypes.object,
		setFieldValue: PropTypes.func,
		setFieldTouched: PropTypes.func,
		setFieldError: PropTypes.func
	})
};

export default NewDatePicker;
