import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import cx from "classnames";
import AsyncPaginate from "react-select-async-paginate";
import get from "lodash/get";
import "../style.scss";
import { api, queryBuilder } from "services";

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

interface IAsyncSelectProps {
	label?: string;
	className?: string;
	placeholder?: string;
	isMulti: false | undefined;
	isClearable?: boolean;
	isSearchable?: boolean;
	options?: [];
	optionValue?: string | Function;
	optionLabel: string | Function;
	menuPlacement?: "bottom";
	loadOptionsKey?: Function | string;
	loadOptionsUrl: string;
	disableOptions: [];
	field: IFieldProps;
	form: IFormProps;
	handleChange?: Function;
	filterParams?: Function;
	loadOptionsParams?: Function;
	[x: string]: any;
}

const load = async (search: any, prevOptions: any, { page }: any, url: string, filterParams: any, loadOptionsParams: Function, loadOptionsKey: Function | string) => {
	const { data } = await api.request.get(
		queryBuilder(url, { page, filter: filterParams, ...loadOptionsParams(search) })
	);
	return {
		options: loadOptionsKey
			? typeof loadOptionsKey === "function"
				? loadOptionsKey(data)
				: get(data, loadOptionsKey, [])
			: data,
		hasMore:
			get(data, "_meta.currentPage", 1) < get(data, "_meta.pageCount", 1),
		additional: { page: get(data, "_meta.currentPage", 1) + 1 }
	};
};

const AsyncSelectComponent: FC<IAsyncSelectProps> = ({
	disableOptions = [],
	className = null,
	label,
	isMulti = false,
	loadOptionsKey = "data",
	placeholder,
	options,
	field,
	optionLabel,
	optionValue = "id",
	form: { errors, setFieldValue, setFieldTouched, touched },
	isSearchable = false,
	menuPlacement = "bottom",
	loadOptionsUrl,
	isClearable = false,
	loadOptionsParams = () => {
	},
	handleChange = () => {
	},
	filterParams = {},
	...otherProps
}): JSX.Element => {
	const { t } = useTranslation();
	// @ts-ignore
	const { system: { theme } } = useSelector(state => state);
	const classes = cx(
		"form-field-select mb-5",
		touched[field.name] && errors[field.name] && "form-field-select--error",
		className
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
			border:
				touched[field.name] && errors[field.name]
					? "1px solid rgba(206, 49, 49, 1)"
					: "1px solid #e1e2e6",
			backgroundColor: theme === "dark" ? "rgba(35, 42, 59, 1)" : "",
			padding: "2px 10px 2px 0",
			minHeight: "20px",
			zIndex: 1
		}),
		indicatorSeparator: (provided: any) => ({
			...provided,
			display: "none"
		}),

		indicatorsContainer: (provided: any) => ({
			...provided,
			height: "30px"
		}),
		option: (provided: any) => {
			return {
				...provided,
				fontSize: "14px",
				color: theme === "dark" ? "rgba(113, 128, 150, 1)" : "",
				backgroundColor: "initial",
				cursor: "pointer",
				"&:hover": {
					backgroundColor:
						theme === "dark" ? "#3f4865" : "#B2D4FF"
				}
			};
		},
		menuPortal: (provided: any) => ({
			...provided,
			zIndex: 9999
		}),
		menu: (provided: any) => ({
			...provided,
			backgroundColor:
				theme === "dark" ? "rgba(35, 42, 59, 1)" : "#fff",
			zIndex: 9999
		}),
		singleValue: (provided: any) => {
			return {
				...provided,
				color: theme === "dark" ? "rgba(113, 128, 150, 1)" : "#000"
				// backgroundColor: "initial"
			};
		},
		placeholder: (provided: any) => ({
			...provided,
			fontSize: "14px",
			fontFamily: "Roboto",
			whiteSpace: "nowrap",
			color: theme === "dark" ? "rgba(74, 85, 104, 1)" : "rgba(160, 174, 192, 1)",
			overflow: "hidden",
			textOverflow: "ellipsis"
		}),
		multiValue: (provided: any) => {
			return {
				...provided,
				backgroundColor: theme === "dark" ? "rgba(20, 46, 113, 1)" : "rgb(223, 227, 235)"
			};
		},
		multiValueLabel: (provided: any) => {
			return {
				...provided,
				color: theme === "dark" ? "white" : "black"
			};
		},
		multiValueRemove: (provided: any) => ({
			...provided,
			color: theme === "dark" ? "#797979" : "black"

		})
	};

	return (
		<div className={classes}>
			{label && (
				<div className="form-field-select__label">{t(label)}</div>
			)}
			<AsyncPaginate
				id={field.name}
				name={field.name}
				debounceTimeout={300}
				onChange={(option: any) => {
					setFieldValue(field.name, option);
					handleChange(option);
				}}
				onBlur={() => setFieldTouched(field.name, true)}
				getValue={(option: any) =>
					typeof optionValue === "string" && option[optionValue]
				}
				getOptionLabel={(option: any) =>
					typeof optionLabel === "function"
						? optionLabel(option)
						: option[optionLabel]
				}
				getOptionValue={(option: any) =>
					typeof optionValue === "function"
						? optionValue(option)
						: option[optionValue]
				}
				value={field.value}
				styles={customStyle}
				isClearable={isClearable}
				additional={{ page: 1 }}
				loadOptions={(search: any, prevOptions: any, { page }: any) =>
					load(
						search,
						prevOptions,
						{ page },
						loadOptionsUrl,
						filterParams,
						loadOptionsParams,
						loadOptionsKey
					)
				}
				isOptionDisabled={(option: any) =>
					disableOptions
						.reduce(
							(prev: any, curr: any) => [...prev, curr.id],
							[]
						)
						.includes(option.id)
				}
				{...{
					isMulti,
					options,
					placeholder,
					isSearchable,
					menuPlacement
				}}
				{...otherProps}
			/>

			{touched[field.name] && errors[field.name] && (
				<div className="form-field-select__error">
					<span>{t(errors[field.name])}</span>
				</div>
			)}
		</div>
	);
};

export default AsyncSelectComponent;
