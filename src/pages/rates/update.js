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
				include: "files,ratesPrices,translations,sort"
			}}>
			{({ item, isFetched }) => {
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
									name: "sort",
									required: false,
									value: get(item, "sort")
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
									name: "price",
									value: get(item, "ratesPrices.price"),
									onSubmitValue: value => Number(value),
									required: true
								},
								{
									name: "days",
									value: get(item, "ratesPrices.days"),
									onSubmitValue: value => Number(value),
									required: true
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
							{({ isSubmitting, values, setFieldValue }) => {
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
