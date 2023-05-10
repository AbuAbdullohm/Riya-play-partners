import React from "react";
import EntityForm from "modules/entity/forms";
import EntityContainer from "modules/entity/containers";
import { Typography, Loader } from "../../components";
import { useNotification } from "hooks";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import Form from "./components/form";
import moment from "moment";
// import config from "config";
// import qs from "query-string";
// import { useSelector } from "react-redux";

const Update = ({ location, history, match }) => {
	const { notification } = useNotification();
	const { t } = useTranslation();
	const { id } = match.params;

	// const changeTab = (langCode, translations) => {
	// 	const hasLangItem = translations.filter(
	// 		({ lang }) => lang === langCode
	// 	);

	// 	if (hasLangItem.length > 0) {
	// 		history.push(`/advertising/update/${hasLangItem[0].id}}`);
	// 		// history.push(
	// 		// 	`/advertising/update/${hasLangItem[0].id}?lang=${hasLangItem[0].lang}`
	// 		// );
	// 	}
	// };

	return (
		<EntityContainer.One
			entity="advertising"
			name={`advertising-${id}`}
			url={`/advertising/${id}`}
			primaryKey="id"
			id={id}
			params={{
				include: "translations,files,file_id"
			}}>
			{({ item, isFetched }) => {
				return isFetched ? (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							{t("Изменить реклама")}
						</Typography.Heading>

						<EntityForm.Main
							method={"put"}
							entity="advertising"
							name={`advertising`}
							url={`/advertising/${get(item, "id")}`}
							updateData={true}
							primaryKey="id"
							normalizeData={data => data}
							onSuccess={(data, resetForm) => {
								resetForm();
								history.push("/advertising");
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
									required: true,
									value: get(item, "title_uz")
								},
								{
									name: "title_ru",
									required: true,
									value: get(item, "title_ru")
								},

								{
									name: "link",
									value: get(item, "link")
								},
								{
									name: "file_id",
									value: Array.isArray(get(item, "files")) ? get(item, "files") : [get(item, "files")],
									onSubmitValue: value => (value.length ? value.reduce((prev, curr) => [...prev, curr.id], []).join(",") : "")
								},
								{
									name: "type",
									value: get(item, "type"),
									onSubmitValue: value => Number(value),
									reqired: true
								},
								{
									name: "expire_at",
									value: moment.unix(get(item, "expire_at", null)),
									onSubmitValue: value => (!!value ? moment(value).unix() : "")
								},
								{
									name: "max_views_count",
									value: get(item, "max_views_count", null),
									onSubmitValue: value => Number(value)
								},
								{
									name: "status",
									value: get(item, "status") === 1,
									onSubmitValue: value => (value ? 1 : 0)
								},
								{
									name: "lang_hash",
									value: get(item, "lang_hash")
								}
							]}
							params={{
								sort: "id",
								include: "translations,files,tracks"
							}}>
							{({ isSubmitting, values, setFieldValue }) => {
								return (
									<>
										<Form
											{...{
												isFetched,
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
				) : (
					<Loader />
				);
			}}
		</EntityContainer.One>
	);
};

export default Update;
