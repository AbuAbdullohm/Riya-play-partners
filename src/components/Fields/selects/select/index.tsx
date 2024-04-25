import React, { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import cx from "classnames";
import "../style.scss";
import { useSelector } from "react-redux";

interface IFormProps {
	touched: any;
	errors: any;
	setFieldValue: Function;
	setFieldTouched: Function;
}

interface IFieldProps {
	name: string;
	value: string | number | undefined;
}

interface ISimpleValueProps {
	options: object[];
	value: any;
	optionValue?: string | Function;
	children: any;
	defaultValue: any;
	[x: string]: any;
}

interface ISelectProps {
	label?: string;
	className?: string;
	placeholder?: string;
	isDisabled?: boolean;
	isMulti: boolean;
	isClearable?: boolean;
	isSearchable?: boolean;
	options: object[];
	optionValue?: string | Function;
	optionLabel: string | Function;
	menuPlacement?: "bottom";
	menuPortalTarget: any;
	disableOptions: [];
	field: IFieldProps;
	form: IFormProps;
	handleChange?: Function;

	[x: string]: any;
}

const SimpleValue: FC<ISimpleValueProps> = ({ options, value, optionValue, children, ...rest }) => {
	value = value ? options.find((option: any) => typeof optionValue === "string" && option[optionValue] === value) : value;
	return children({ options, value, ...rest });
};

const SelectComponent: FC<ISelectProps> = (props): JSX.Element => {
	const { t } = useTranslation();
	const {
		isClearable = false,
		isDisabled = false,
		isMulti = false,
		isSearchable = false,
		disableOptions,
		className,
		label,
		placeholder,
		options,
		field,
		optionLabel,
		optionValue = "id",
		form: { touched, errors, setFieldValue, setFieldTouched },
		menuPlacement,
		initialValue,
		menuPortalTarget,
		defaultValue,
		handleChange = () => {},
		...otherProps
	} = props;
	const theme = useSelector((state: any) => state.system.theme);
	const classes = cx(
		"form-field-select mb-5",
		touched[field.name] && errors[field.name] && "form-field-select--error",
		field.value && "form-field-select--active",
		className ? className : ""
	);

	const customStyle = {
		container: (provided: any) => ({
			...provided,
			minHeight: "20px",
			minWidth: "150px"
		}),
		control: (provided: any) => ({
			...provided,
			cursor: "pointer",
			borderColor: "rgba(0,0,0,.1)",
			borderRadius: "0.375rem",
			border: touched[field.name] && errors[field.name] ? "1px solid rgba(206, 49, 49, 1)" : "1px solid #e1e2e6",
			backgroundColor: theme === "dark" ? "rgba(35, 42, 59, 1)" : "white",
			padding: "0px 10px 2px 0",
			minHeight: "20px",
			zIndex: 1
		}),
		indicatorSeparator: (provided: any) => ({
			...provided,
			display: "none"
		}),
		option: (provided: any) => {
			return {
				...provided,
				fontSize: "14px",
				color: theme === "dark" ? "rgba(113, 128, 150, 1)" : "",
				backgroundColor: "initial",
				cursor: "pointer",
				"&:hover": {
					backgroundColor: theme === "dark" ? "#3f4865" : "#B2D4FF"
				}
			};
		},
		menuPortal: (provided: any) => ({
			...provided,
			zIndex: 9999
		}),
		menu: (provided: any) => ({
			...provided,
			backgroundColor: theme === "dark" ? "rgba(35, 42, 59, 1)" : "#fff",
			zIndex: 9999
		}),
		placeholder: (provided: any) => ({
			...provided,
			fontSize: "14px",
			fontFamily: "Roboto",
			whiteSpace: "nowrap",
			color: theme === "dark" ? "rgba(74, 85, 104, 1)" : "rgba(160, 174, 192, 1)",
			overflow: "hidden",
			textOverflow: "ellipsis"
		}),
		singleValue: (provided: any) => {
			return {
				...provided,
				color: theme === "dark" ? "rgba(113, 128, 150, 1)" : "#000"
				// backgroundColor: "initial"
			};
		}
	};

	useEffect(() => {
		if (initialValue) {
			setFieldValue(field.name, initialValue);
		}
	}, []);

	return (
		<div className={classes}>
			{label && <label className="form-label">{t(label)}</label>}
			<SimpleValue
				id={field.name}
				name={field.name}
				onChange={(option: any, action: any) => {
					setFieldValue(field.name, option ? option[optionValue as string] : null);
					handleChange(option);
				}}
				onBlur={() => setFieldTouched(field.name, true)}
				options={options}
				optionValue={optionValue}
				getValue={(option: any) => typeof optionValue === "string" && option[optionValue]}
				getOptionLabel={(option: any) => (typeof optionLabel === "function" ? optionLabel(option) : option[optionLabel])}
				getOptionValue={(option: any) => (typeof optionValue === "function" ? optionValue(option) : option[optionValue])}
				placeholder={placeholder}
				styles={customStyle}
				menuPortalTarget={menuPortalTarget}
				value={field.value}
				isDisabled={isDisabled}
				isMulti={isMulti}
				isSearchable={isSearchable}
				isClearable={isClearable}
				menuPlacement={menuPlacement}
				defaultValue={defaultValue}
				{...otherProps}>
				{(simpleProps: ISelectProps) => <Select {...simpleProps} />}
			</SimpleValue>
			{touched[field.name] && errors[field.name] && (
				<div className="text-theme-24 absolute left-0">
					<span>{t(errors[field.name])}</span>
				</div>
			)}
		</div>
	);
};

export default SelectComponent;
