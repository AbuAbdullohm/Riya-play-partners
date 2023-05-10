import React, { useState } from "react";
import EntityForm from "modules/entity/forms";
import EntityContainer from "modules/entity/containers";
import { Typography, Loader } from "components";
import Form from "./components/form";
import { useNotification } from "hooks";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import qs from "query-string";

const Update = ({ location, history, match }) => {
	const { notification } = useNotification();
	const { t } = useTranslation();
	const query = qs.parse(location.search);
	const { lang } = query;
	const { id } = match.params;
	const [tabLang] = useState(lang);
	const isOwn = lang === tabLang;
	return (
		<EntityContainer.One
			entity="addTrack"
			name={`addTrack`}
			url={`/ads-track/${id}`}
			primaryKey="id"
			id={id}
			params={{
				include: "video"
			}}>
			{({ item, isFetched }) => {
				return (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							{t("Изменить баннер")}
						</Typography.Heading>

						{isFetched ? (
							<EntityForm.Main
								method={isOwn ? "put" : "post"}
								entity="addTrack"
								name={`addTrack`}
								url={isOwn ? `/ads-track/${get(item, "id")}` : "/ads-track"}
								primaryKey="id"
								normalizeData={data => data}
								id={id}
								onSuccess={() => {
									notification("Успешно обновлено", {
										type: "success"
									});
									history.push(`/reklama`);
								}}
								onError={() => {
									notification("Что-то пошло не так", {
										type: "danger"
									});
								}}
								fields={[
									{
										name: "name",
										required: true,
										value: isOwn ? get(item, "name") : ""
									},
									{
										name: "link",
										type: "object",
										value: isOwn ? get(item, "link") : ""
									},
									{
										name: "second",
										value: isOwn ? get(item, "second") : ""
									},
									// {
									// 	name: "user_type",
									// 	value: isOwn ? String(get(item, "user_type")) : ""
									// },
									// {
									// 	name: "paid",
									// 	value: isOwn ? String(get(item, "paid")) : ""
									// },
									{
										name: "video_id",
										type: "array",
										required: true,
										value: get(item, "video") ? [get(item, "video")] : [],
										onSubmitValue: value => (value.length > 0 ? value[0].id : [])
									},
									{
										name: "status",
										value: get(item, "status") === 1,
										onSubmitValue: value => (value ? 1 : 0)
									},
									{
										name: "expected_view_count",
										type: "number",
										value: get(item, "expected_view_count"),
										onSubmitValue: value => Number(value)
									},
									{
										name: "view_type",
										required: true,
										value: get(item, "view_type")
									},
									{
										name: "start_date",
										type: "string",
										value: get(item, "start_date") ? get(item, "start_date") : null,
										onSubmitValue: value => value && value
									},
									{
										name: "end_date",
										type: "string",
										value: get(item, "end_date") ? get(item, "end_date") : null,
										onSubmitValue: value => value && value
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
							<Loader />
						)}
					</>
				);
			}}
		</EntityContainer.One>
	);
};

export default Update;
