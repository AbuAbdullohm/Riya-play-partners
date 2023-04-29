import React, { useState } from "react";

import EntityForm from "modules/entity/forms";
import EntityContainer from "modules/entity/containers";
import { Typography, Tabs } from "components";
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
			history.push(`/pages/update/${hasLangItem[0].id}?lang=${hasLangItem[0].lang}`);
		}
	};

	return (
		<EntityContainer.One
			entity="pages"
			name={`pages-${id}`}
			url={`/pages/${id}`}
			primaryKey="id"
			id={id}
			params={{
				extra: { _l: tabLang },
				include: "files,description,photo"
			}}>
			{({ item, isFetched }) => {
				return (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							{t("Изменить страницу")}
						</Typography.Heading>

						<Tabs
							items={config.API_LANGUAGES}
							onTabChange={value => {
								setTabLang(value);
								changeTab(value, Array.isArray(item.translations) ? item.translations : []);
							}}
							activeItem={tabLang}
							className={"mt-5 intro-y"}
						/>

						<EntityForm.Main
							method={isOwn ? "put" : "post"}
							entity="pages"
							name={`pages-${tabLang}`}
							url={isOwn ? `/pages/${get(item, "id")}` : "/pages"}
							primaryKey="id"
							normalizeData={data => data}
							id={id}
							onSuccess={() => {
								notification("Успешно обновлено", {
									type: "success"
								});
								history.push(`/pages?lang=${tabLang}`);
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
									name: "slug",
									value: isOwn ? get(item, "slug") : ""
								},
								{
									name: "description",
									value: isOwn ? get(item, "description") : ""
								},
								{
									name: "content",
									value: isOwn ? get(item, "content") : ""
								},
								{
									name: "photo",
									value: get(item, "files") ? get(item, "files", []) : [],
									onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
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
								extra: { _l: tabLang },
								include: "files,description,photo"
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
