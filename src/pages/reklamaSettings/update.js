import React, { useState } from "react";
import EntityForm from "modules/entity/forms";
import EntityContainer from "modules/entity/containers";
import { Typography, Spinner } from "components";
import Form from "./components/form";
import { useNotification } from "hooks";
import StoreEntities from "store/actions/entities";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import qs from "query-string";
import { useDispatch } from "react-redux";
const Update = ({ location, history, match }) => {
	const { notification } = useNotification();
	const { t } = useTranslation();
	const query = qs.parse(location.search);
	const { lang } = query;
	const { id } = match.params;
	const [tabLang] = useState(lang);
	const isOwn = lang === tabLang;
	const dispatch = useDispatch();

	const updateSeries = (data, id) => {
		dispatch(
			StoreEntities.Update.success({
				entity: "ads",
				entityId: id,
				data: data
			})
		);
	};

	return (
		<EntityContainer.One
			entity="ads"
			name={`ads`}
			url={`/ads/${id}`}
			primaryKey="id"
			id={id}
			params={{
				include: "advertising"
			}}>
			{({ item, isFetched }) => {
				return (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							{t("Обновление пакет рекламы")}
						</Typography.Heading>

						{isFetched ? (
							<EntityForm.Main
								method={isOwn ? "put" : "post"}
								entity="ads"
								name={`ads`}
								url={isOwn ? `/ads/${get(item, "id")}` : "/ads"}
								primaryKey="id"
								normalizeData={data => data}
								id={id}
								onSuccess={data => {
									updateSeries(data, get(item, "id"));
									notification("Успешно обновлено", {
										type: "success"
									});
									history.push(`/reklamaSettings`);
								}}
								onError={() => {
									notification("Что-то пошло не так", {
										type: "danger"
									});
								}}
								params={{
									include: "advertising"
								}}
								fields={[
									{
										name: "type",
										type: "array",
										value: get(item, "type"),
										onSubmitValue: value => value && value
									},
									{
										name: "advertising",
										required: true,
										value: get(item, "advertising", []),
										onSubmitValue: value => (value.length ? value.reduce((prev, curr) => [...prev, curr.id], []) : [])
									},
									{
										name: "status",
										value: get(item, "status"),
										onSubmitValue: value => (value ? 1 : 0)
									}
								]}>
								{({ isSubmitting, values, setFieldValue }) => {
									return (
										<>
											<Form
												{...{
													isFetched,
													values,
													item,
													setFieldValue,
													isSubmitting,
													isUpdate: isOwn,
													lang: tabLang
												}}
											/>
										</>
									);
								}}
							</EntityForm.Main>
						) : (
							<Spinner position="center" />
						)}
					</>
				);
			}}
		</EntityContainer.One>
	);
};

export default Update;
