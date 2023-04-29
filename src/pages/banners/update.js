import React, { useState } from "react";
import EntityForm from "modules/entity/forms";
import EntityContainer from "modules/entity/containers";
import { Tabs, Typography } from "components";
import Form from "./components/form";
import { useNotification } from "hooks";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import qs from "query-string";
import config from "config";

const Update = ({ location, history, match }) => {
	const { notification } = useNotification();
	const { t } = useTranslation();
	const query = qs.parse(location.search);
	const { lang } = query;
	const { id } = match.params;
	const [tabLang, setTabLang] = useState(lang);
	const isOwn = lang === tabLang;

	const changeTab = (langCode, translations) => {
		const hasLangItem = translations.filter(({ lang }) => lang === langCode);
		if (hasLangItem.length > 0) {
			history.push(`/banners/update/${hasLangItem[0].id}?lang=${hasLangItem[0].lang}`);
		}
	};
	return (
		<EntityContainer.One
			entity="banners"
			name={`banners`}
			url={`/banners/${id}`}
			primaryKey="id"
			id={id}
			params={{
				include: "files,translations,film"
			}}>
			{({ item, isFetched }) => {
				return (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							{t("Изменить баннер")}
						</Typography.Heading>

						<Tabs
							items={config.API_LANGUAGES}
							onTabChange={value => {
								setTabLang(value);
								changeTab(value, Array.isArray(item.translations) ? item.translations : []);
							}}
							activeItem={tabLang}
							className={"mt-5 mb-5 intro-y"}
						/>

						<EntityForm.Main
							method={isOwn ? "put" : "post"}
							entity="banners"
							name={`banners`}
							url={isOwn ? `/banners/${get(item, "id")}` : "/banners"}
							primaryKey="id"
							normalizeData={data => data}
							id={id}
							onSuccess={() => {
								notification("Успешно обновлено", {
									type: "success"
								});
								history.push(`/banners?lang=${tabLang}`);
							}}
							onError={() => {
								notification("Что-то пошло не так", {
									type: "danger"
								});
							}}
							fields={[
								{
									name: "title",
									required: true,
									value: isOwn ? get(item, "title") : ""
								},
								{
									name: "link",
									type: "object",
									value: isOwn ? get(item, "link") : ""
								},
								{
									name: "type",
									value: isOwn ? get(item, "type") : ""
								},
								{
									name: "film_id",
									type: "object",
									value: isOwn ? get(item, "film") : "",
									onSubmitValue: field => (field ? field.id : null)
								},
								{
									name: "file_id",
									value: Array.isArray(get(item, "files")) ? get(item, "files", []) : [],
									onSubmitValue: value => (value.length ? value.reduce((prev, curr) => [...prev, curr.id], []).join(",") : "")
								},
								{
									name: "status",
									value: get(item, "status") === 1,
									onSubmitValue: value => (value ? 1 : 0)
								},
								{
									name: "lang_hash",
									value: get(item, "lang_hash")
								},
								{
									name: "expected_view_count",
									type: "number",
									value: get(item, "expected_view_count"),
									onSubmitValue: value => Number(value)
								},
								{
									name: "view_type",
									value: get(item, "view_type") === 1 ? 1 : get(item, "view_type") === 2 ? 2 : ""
								},

								{
									name: "end_date",
									type: "string",
									value: get(item, "end_date") ? get(item, "end_date") : null,
									onSubmitValue: value => value && value
								}
							]}
							params={{
								extra: { _l: tabLang },
								include: "translations,files,film"
							}}>
							{({ isSubmitting, values, setFieldValue, errors }) => {
								return (
									<>
										<Form
											{...{
												isFetched,
												values,

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
					</>
				);
			}}
		</EntityContainer.One>
	);
};

export default Update;
