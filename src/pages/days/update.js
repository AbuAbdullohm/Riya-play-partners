import React from "react";

import EntityForm from "modules/entity/forms";
import EntityContainer from "modules/entity/containers";
import { Typography } from "components";
import Form from "./components/form";

import { useNotification } from "hooks";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import qs from "query-string";

const Update = ({ location, history, match }) => {
	const { notification } = useNotification();
	const { t } = useTranslation();
	const query = qs.parse(location.search);
	let { page } = query;

	const { id } = match.params;

	return (
		<EntityContainer.One
			entity="rates"
			name={`rates`}
			url={`/rates/${id}`}
			primaryKey="id"
			id={id}
			params={{
				include: "files,ratesPrices,translations,sort,holders"
			}}>
			{({ item }) => {
				return (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							{t("Изменить тариф")}
						</Typography.Heading>

						<EntityForm.Main
							method={"put"}
							entity="rates"
							name={`rates`}
							url={`/rates/${get(item, "id")}`}
							primaryKey="id"
							normalizeData={data => data}
							id={id}
							onSuccess={() => {
								notification("Успешно обновлено", {
									type: "success"
								});
								history.push(`/rates?page=${page}`);
							}}
							onError={() => {
								notification("Что-то пошло не так", {
									type: "danger"
								});
							}}
							fields={[
								{
									name: "logo",
									required: true,
									value: get(item, "files") ? get(item, "files", []) : [],
									onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
								},
								{
									name: "sort",
									value: get(item, "sort"),
									required: false,
									onSubmitValue: value => (value ? 1 : 0)
								},
								{
									name: "name_uz",
									required: true,
									value: get(item, "name_uz")
								},
								{
									name: "description_uz",
									value: get(item, "description_uz")
								},
								{
									name: "name_ru",
									required: true,
									value: get(item, "name_ru")
								},
								{
									name: "description_ru",
									value: get(item, "description_ru")
								},
								{
									name: "holders",
									required: true,
									type: "array",
									value: get(item, "holders"),
									onSubmitValue: value => (value ? value.map(v => v.id) : null)
								},
								{
									name: "ratesPrices",
									required: true,
									type: "array",
									value: get(item, "ratesPrices")
										? get(item, "ratesPrices").map(i => ({ ...i, top: i.top ? 1 : 0, device_count: i.device_count || 0 }))
										: [],
									onSubmitValue: values => {
										return values.map(value => ({
											id: value.id,
											days: value.days,
											price: value.price,
											device_count: value.device_count,
											top: value.top ? 1 : 0
										}));
									},

									lazy: (validator, yup) =>
										validator.of(
											yup.object().shape({
												days: yup.string().required("Обязательное поле"),
												price: yup.string().required("Обязательное поле"),
												device_count: yup.string().required("Обязательное поле")
											})
										)
								},
								{
									name: "is_foreign",
									value: get(item, "is_foreign") === 1,
									onSubmitValue: value => (value ? 1 : 0)
								},
								{
									name: "status",
									value: get(item, "status") === 1,
									onSubmitValue: value => (value ? 1 : 0)
								}
							]}
							params={{
								include: "translations,files,ratesPrices"
							}}>
							{({ isSubmitting, values, setFieldValue, errors }) => {
								return (
									<>
										<Form
											{...{
												values,
												setFieldValue,
												isSubmitting,
												isUpdate: true
											}}
										/>
									</>
								);
							}}
						</EntityForm.Main>
					</>
				);
			}}
		</EntityContainer.One>
	);
};

export default Update;
