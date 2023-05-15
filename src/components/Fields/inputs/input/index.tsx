import { Icon } from "components";
import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import "./style.scss";
interface IFormProps {
	touched: any;
	errors: any;
}

interface IFieldProps {
	name: string;
	value: string | number | undefined;
}

interface IInputProps {
	type: "text" | "password" | "number";
	size?: "lg" | "sm";
	className?: string;
	label?: string;
	placeholder?: string;
	readOnly?: boolean;
	form: IFormProps;
	field: IFieldProps;
	disabled?: boolean;
	isRequired?: boolean;
	rounded?: boolean;
	help?: string;
	warning?: string;
	append?: any;
	prepend?: any;
	minLength?: number;
	maxLength?: number;
	registration?: boolean;
}

const InputComponent: FC<IInputProps> = ({
	className,
	label,
	readOnly = false,
	placeholder = "",
	type = "text",
	help = null,
	warning = null,
	size,
	field,
	disabled = false,
	isRequired = false,
	rounded = false,
	registration = false,
	append,
	prepend,
	minLength,
	maxLength,
	form: { touched, errors },
	...otherProps
}): JSX.Element => {
	const { t } = useTranslation();

	const [show, setShow] = useState(false);

	return (
		<div className={`mb-5 relative`}>
			{label && (
				<label htmlFor={field.name} className="form-label">
					{t(label)}
					{isRequired && <span title={t("Обязательный поля")}>*</span>}
				</label>
			)}

			<div className={`${append || prepend ? " input-group" : ""}`}>
				{prepend && (
					<div id={`input-group-${field.name}`} className="input-group-text">
						{prepend}
					</div>
				)}
				<input
					className={`form-control
                            ${className}
                            ${touched[field.name] && errors[field.name] && "border-theme-24"}
                            ${warning && "border-theme-23"}
                            ${size && ` form-control-${size}`}
                            ${rounded && ` form-control-rounded`}`}
					readOnly={readOnly}
					disabled={disabled}
					aria-describedby={`input-group-${field.name}`}
					placeholder={t(placeholder)}
					minLength={minLength}
					maxLength={maxLength}
					{...{ type: type === "password" ? (show ? "text" : "password") : type }}
					{...field}
					{...otherProps}
				/>
				{type === "password" ? (
					<span id="show" onClick={() => setShow(!show)}>
						<Icon name={show ? "eye" : "eye-off"} />
					</span>
				) : null}
				{append && (
					<div id={`input-group-${field.name}`} className="input-group-text">
						{append}
					</div>
				)}
			</div>

			{touched[field.name] && errors[field.name] && (
				<div className="text-theme-24 absolute left-0">
					<span>{t(errors[field.name])}</span>
				</div>
			)}

			{help && <div className="form-help absolute left-0">{t(help)}</div>}

			{warning && <div className="text-theme-23 absolute left-0">{t(warning)}</div>}

			{type === "password" && typeof field.value === "string" && registration && (
				<>
					{field.value.length > 0 && field.value.length < 7 && (
						<>
							<div className="w-full grid grid-cols-12 gap-5 h-1 mt-3 block">
								<div className="col-span-4 h-full rounded bg-theme-24"></div>
								<div className="col-span-4 h-full rounded bg-gray-200 dark:bg-dark-1"></div>
								<div className="col-span-4 h-full rounded bg-gray-200 dark:bg-dark-1"></div>
							</div>
							<div className="text-theme-24 mt-2">{t("Weak password")}</div>
						</>
					)}
					{field.value.length >= 7 && field.value.length < 13 && (
						<>
							<div className="w-full grid grid-cols-12 gap-5 h-1 mt-3 block">
								<div className="col-span-4 h-full rounded bg-theme-23"></div>
								<div className="col-span-4 h-full rounded bg-theme-23"></div>
								<div className="col-span-4 h-full rounded bg-gray-200 dark:bg-dark-1"></div>
							</div>
							<div className="text-theme-23 mt-2">{t("Normal password")}</div>
						</>
					)}
					{field.value.length >= 13 && (
						<>
							<div className="w-full grid grid-cols-12 gap-5 h-1 mt-3 block">
								<div className="col-span-4 h-full rounded bg-theme-10"></div>
								<div className="col-span-4 h-full rounded bg-theme-10"></div>
								<div className="col-span-4 h-full rounded bg-theme-10"></div>
							</div>
							<div className="text-theme-10 mt-2">{t("Strong password")}</div>
						</>
					)}
				</>
			)}
		</div>
	);
};

export default InputComponent;
