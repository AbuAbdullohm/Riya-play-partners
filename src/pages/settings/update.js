import React, { useState } from "react";
import EntityForm from "modules/entity/forms";
import EntityContainer from "modules/entity/containers";
import { Tabs, Typography } from "components";
import { useNotification } from "hooks";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import Form from "./components/form";
import qs from "query-string";
import config from "config";

const Update = ({ history, match, location }) => {
	const query = qs.parse(location.search);
	const { notification } = useNotification();
	const { t } = useTranslation();
	const { id } = match.params;

	const { lang } = query;
	const [tabLang, setTabLang] = useState(lang);
	const isOwn = lang === tabLang;

	const changeTab = (langCode, translations) => {
		const hasLangItem = translations.filter(({ lang }) => lang === langCode);

		if (hasLangItem.length > 0) {
			history.push(`/posts/update/${hasLangItem[0].id}?lang=${hasLangItem[0].lang}`);
		}
	};

	return (
		<EntityContainer.One entity="settings" name={`settings-${id}`} url={`/settings/${id}`} primaryKey="id" id={id} params={{}}>
			{({ item, isFetched }) => {
				return (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							{t("Изменить настройку")}
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
							entity="settings"
							name="all"
							url={isOwn ? `/settings/${id}` : "/settings"}
							primaryKey="id"
							normalizeData={data => data}
							id={id}
							onSuccess={() => {
								notification("Успешно обновлено", {
									type: "success"
								});
								history.push(`/settings?lang=${lang}`);
							}}
							onError={() => {
								notification("Что-то пошло не так", {
									type: "danger"
								});
							}}
							fields={[
								{
									name: "name",
									value: isOwn ? get(item, "name") : "",
									required: true
								},
								{
									name: "value",
									value: isOwn ? (get(item, "value") ? get(item, "value") : "") : ""
								},
								{
									name: "link",
									value: isOwn ? get(item, "link") : ""
								},
								{
									name: "slug",
									value: get(item, "slug"),
									onSubmitValue: value => (value ? value : null)
								},
								{
									name: "alias",
									value: get(item, "alias") ? get(item, "alias") : ""
								},
								{
									name: "photo",
									value: get(item, "files") ? get(item, "files") : "",
									onSubmitValue: value => (value.length ? value.reduce((prev, curr) => [...prev, curr.id], []).join(",") : "")
								},
								{
									name: "status",
									value: get(item, "status") === 1,
									onSubmitValue: value => (value ? 1 : 0)
								}
							]}
							params={{
								extra: { _l: tabLang },
								include: ["translations", "files"]
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
												isUpdate: true,
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
