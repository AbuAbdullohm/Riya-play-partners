import React, { Fragment } from "react";

import EntityForm from "modules/entity/forms";
import { Typography } from "../../components";
import Form from "./components/form";
import { useNotification } from "hooks";
import qs from "query-string";
import moment from "moment";

const Create = ({ history, location }) => {
	const query = qs.parse(location.search);
	const { lang } = query;
	const { notification } = useNotification();

	return (
		<EntityForm.Main
			method="post"
			entity="films"
			name={`films`}
			url="/films"
			prependData
			version="v2"
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				history.goBack();
				notification("Успешно обновлено", {
					type: "success"
				});
			}}
			onError={() => {
				notification("Что-то пошло не так", {
					type: "danger"
				});
			}}
			fields={[
				{
					name: "name_uz",
					value: "",
					required: true
				},
				{
					name: "name_ru",
					value: "",
					required: true
				},
				{
					name: "description_uz",
					value: "",
					required: true
				},
				{
					name: "description_ru",
					value: "",
					required: true
				},
				{
					name: "publish_time",
					value: moment(),
					onSubmitValue: value => value && moment(value).unix()
				},
				{
					name: "playback_time",
					onSubmitValue: value => Number(value)
				},
				{
					name: "year",
					onSubmitValue: value => `${value}`,
					required: true
				},
				{
					required: true,
					name: "photo",
					value: [],
					onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
				},
				{
					required: false,
					name: "gallery",
					value: [],
					onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
				},
				{
					required: false,
					name: "thriller_id",
					value: [],
					onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
				},

				{
					name: "actors",
					value: [],
					required: false,
					onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], [])
				},
				{
					name: "maker_id",
					type: "object",
					value: [],
					required: false,
					onSubmitValue: value => (value ? value.id : null)
				},
				{
					name: "kinopoisk_id",
					type: "string",
					min: 4,
					required: true,
					onSubmitValue: value => value
				},
				{
					name: "country_id",
					value: [],
					required: true,
					type: "object",
					onSubmitValue: value => (value ? value.id : null)
				},
				{
					name: "company_id",
					required: true,
					type: "object",
					onSubmitValue: value => (value ? value.id : null)
				},
				{
					name: "foreign_status",
					value: true,
					onSubmitValue: value => (value ? 1 : 0)
				},
				{
					name: "status",
					required: true,
					value: true,
					onSubmitValue: value => (value ? 1 : 0)
				},

				{
					name: "paid",
					value: true,
					required: true,
					onSubmitValue: value => (value ? 1 : 0)
				},
				{
					name: "recommended",
					value: true,
					onSubmitValue: value => (value ? 1 : 0)
				},
				{
					name: "foreign_user_can_view",
					value: false,
					onSubmitValue: value => (value ? 1 : null)
				},
				{
					name: "enabled_watermark",
					value: false,
					onSubmitValue: value => (value ? 1 : 0)
				},
				{
					name: "categories",
					value: [],
					required: true,
					onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], [])
				},
				{
					name: "tags",
					value: [],
					required: true,
					onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], [])
				},
				{
					name: "type",
					required: true,
					onSubmitValue: value => Number(value.id)
				},
				{
					name: "genres",
					required: true,
					onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], [])
				}
			]}
			params={{
				include: "files,actors,tags,categories,genres,type,season"
			}}>
			{({ values, setFieldValue, handleSubmit, setFieldError, errors, setErrors }) => {
				return (
					<Fragment>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							Создание фильма
						</Typography.Heading>

						<Form {...{ values, setFieldValue, isFetched: true, handleSubmit, setFieldError, errors, setErrors }} lang={lang} />
					</Fragment>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
