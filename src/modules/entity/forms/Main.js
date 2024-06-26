import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withFormik } from "formik";
import * as Yup from "yup";
import get from "lodash/get";
import isArray from "lodash/isArray";
import objectToFormData from "object-to-formdata";
import PropTypes from "prop-types";
// import { notification } from "antd";
import Actions from "../actions";
import i18next from "i18next";
import { isFunction } from "lodash";

const Main = ({ children, handleSubmit, submitForm, values, errors, isSubmitting, setFieldValue, setFieldError, setErrors, setFieldTouched, validateForm }) => (
	<form onSubmit={handleSubmit} autoComplete={"false"}>
		{children({ handleSubmit, submitForm, values, isSubmitting, setFieldValue, setFieldError, setErrors, setFieldTouched, errors, validateForm })}
	</form>
);

Main.propTypes = {
	id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	entity: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	url: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
	method: PropTypes.oneOf(["get", "post", "put", "delete"]).isRequired,
	primaryKey: PropTypes.string,
	fields: PropTypes.array.isRequired,
	appendData: PropTypes.bool,
	prependData: PropTypes.bool,
	updateData: PropTypes.bool,
	deleteData: PropTypes.bool,
	normalizeData: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
	sendAsFormData: PropTypes.bool,
	onSuccess: PropTypes.func,
	onError: PropTypes.func,
	isMulti: PropTypes.bool,
	version: PropTypes.string
};

Main.defaultProps = {
	primaryKey: "id",
	appendData: false,
	prependData: false,
	updateData: false,
	deleteData: false,
	normalizeData: "",
	sendAsFormData: true,
	isMulti: false,
	onSuccess: () => {},
	onError: () => {},
	version: "v1"
};

const EnhacedForm = withFormik({
	enableReinitialize: true,
	validationSchema: ({ fields }) => {
		if (!isArray(fields)) {
			return Yup.object().shape({});
		}

		let validationFields = {};

		fields.forEach(field => {
			const { lazy, type } = field;

			let validationField = {};

			switch (type) {
				case "string":
					validationField = Yup.string().typeError("Must be a string");
					break;
				case "object":
					validationField = Yup.object();
					break;
				case "number":
					validationField = Yup.number().typeError("Must be a number");
					break;
				case "array":
					validationField = Yup.array();
					break;
				case "boolean":
					validationField = Yup.boolean();
					break;
				case "date":
					validationField = Yup.date();
					break;
				default:
					validationField = Yup.string().transform((_, input) => input != null && input.toString());
			}

			if (field.required) {
				validationField = validationField.required(i18next.t("Обязательное поле"));
			}

			if (field.min) {
				validationField = validationField.min(field.min, "Too Short!");
			}

			if (field.max) {
				validationField = validationField.max(field.max, "Too Long!");
			}

			if (field.confirmPassword) {
				validationField = Yup.string().oneOf([Yup.ref("password"), null], "Пароли должны совпадать");
			}

			validationField = validationField.nullable();

			if (isFunction(lazy)) {
				validationField = lazy(Yup[type](), Yup);
			}

			validationFields[field.name] = validationField;
		});

		return Yup.object().shape(validationFields);
	},
	mapPropsToValues: ({ fields }) => {
		return isArray(fields)
			? fields.reduce(
					(prev, curr) => ({
						...prev,
						[curr.name]: curr.isAbsolute ? curr.value : get(curr, "value", "")
					}),
					{}
			  )
			: {};
	},
	handleSubmit: (values, { props, setFieldError, setSubmitting, resetForm }) => {
		let {
			id,
			entity,
			name,
			url,
			params,
			method,
			primaryKey,
			isMulti,
			fields,
			appendData,
			prependData,
			updateData,
			deleteData,
			normalizeData,
			sendAsFormData,
			onSuccess = () => {},
			onError = () => {},
			FormAction,
			selfErrorMessage,
			version
		} = props;

		values = { ...values };

		if (typeof url === "function") {
			url = url({ ...values });
		}

		fields.forEach(field => {
			if (field.hasOwnProperty("onSubmitValue")) {
				if (typeof field.onSubmitValue === "function") {
					if (field.hasOwnProperty("onSubmitKey")) {
						values[field.onSubmitKey] = field.onSubmitValue(values[field.name], values);
						delete values[field.name];
					} else {
						values[field.name] = field.onSubmitValue(values[field.name], values);
					}
				}
			}
			if (field.hasOwnProperty("disabled")) {
				delete values[field.name];
			}
		});

		if (sendAsFormData) {
			values = objectToFormData(values);
			// values.append('_method', 'PUT');
		}

		FormAction({
			id,
			entity,
			name,
			url,
			params,
			method,
			primaryKey,
			values,
			isMulti,
			appendData,
			prependData,
			updateData,
			deleteData,
			normalizeData,
			version,
			cb: {
				success: data => {
					// notification["success"]({
					//   message: "Успешно",
					//   duration: 2
					// });
					onSuccess(data, resetForm);
				},
				error: (errors = []) => {
					const errorsE = get(errors, "errors");

					if (!selfErrorMessage) {
						// notification["error"]({
						//   message: "Что-то пошло не так",
						//   duration: 3
						// });
					}

					if (errors instanceof Array) {
						errors.map(({ field, message }) => setFieldError(field, message));
					} else if (errorsE instanceof Object) {
						Object.keys(errorsE).map(field => {
							const error = errorsE[field][0];
							return setFieldError(field, error);
						});
					}

					onError(errors, setFieldError);
				},
				finally: () => {
					setSubmitting(false);
				}
			}
		});
	}
})(Main);

const mapDispatchToProps = dispatch =>
	bindActionCreators(
		{
			FormAction: Actions.Form.request
		},
		dispatch
	);

export default connect(null, mapDispatchToProps)(EnhacedForm);
