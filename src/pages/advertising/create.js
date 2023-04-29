import React from "react";
import EntityForm from "modules/entity/forms";
import { Typography } from "../../components";
import { useTranslation } from "react-i18next";
import Form from "./components/form";
import { useNotification } from "hooks";
import moment from "moment";
// import qs from "query-string";

const Create = ({ history, location }) => {
	const { t } = useTranslation();
	const { notification } = useNotification();

	// const query = qs.parse(location.search);
	// const { lang } = query;

	return (
		<EntityForm.Main
			method="post"
			entity="advertising"
			name={`advertising`}
			url="/advertising"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push(`/advertising`);
				// history.push(`/series?lang=${lang}`);
				notification("Успешно добавлено", {
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
					name: "title_uz",
					value: "",
					required: true
				},
				{
					name: "title_ru",
					value: "",
					required: true
				},
				{
					name: "views",
					onSubmitValue: value => Number(value)
				},
				{
					name: "link",
					value: "",
					required: true,
					onSubmitValue: value => value
				},
				{
					name: "file_id",
					value: [],
					onSubmitValue: value => value.length && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
				},
				{
					name: "type",
					value: 1,
					onSubmitValue: value => Number(value),
					required: true
				},
				{
					name: "expire_at",
					onSubmitValue: value => (!!value ? moment(value).unix() : ""),
					value: moment()
				},
				{
					name: "max_views_count",
					value: 0,
					onSubmitValue: value => Number(value)
				},
				{
					name: "status",
					value: true,
					onSubmitValue: value => (value ? 1 : 0)
				}
			]}
			params={{
				// extra: { _l: lang },
				include: "translations,files,file_id,expire_at,views"
			}}>
			{({ isSubmitting, values, setFieldValue }) => {
				return (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							{t("Создать реклама")}
						</Typography.Heading>
						<Form {...{ isFetched: true, values, setFieldValue, isSubmitting }} />
					</>
				);
			}}
		</EntityForm.Main>
	);
};

export default Create;
