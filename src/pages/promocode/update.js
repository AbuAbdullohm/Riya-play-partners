import React from "react";
import EntityForm from "modules/entity/forms";
import EntityContainer from "modules/entity/containers";
import { Typography, Grid } from "components";
import { useNotification } from "hooks";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import Form from "./components/form";

const Update = ({ location, history, match }) => {
	const { notification } = useNotification();
	const { t } = useTranslation();
	const { id } = match.params;
	return (
		<EntityContainer.One
			entity="promo-code"
			name={`promo-code-${id}`}
			url={`/promo-code/${id}`}
			primaryKey="id"
			id={id}
			params={{
				include: "copy,rates"
			}}>
			{({ item, isFetched }) => {
				return (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							<Grid.Row>
								<Grid.Column xs={12} xl={8}>
									{t("Изменить промокод")}
								</Grid.Column>
								<Grid.Column xs={12} xl={4}>
									<h1>Сортировка группы пользователей</h1>
								</Grid.Column>
							</Grid.Row>
						</Typography.Heading>
						<EntityForm.Main
							method={"put"}
							entity="promo-code"
							name={`promo-code`}
							url={`/promo-code/${get(item, "id")}`}
							updateData={true}
							primaryKey="id"
							normalizeData={data => data}
							onSuccess={(data, resetForm) => {
								resetForm();
								notification("Успешно обновлено", {
									type: "success"
								});
								history.goBack();
							}}
							onError={() => {
								notification("Что-то пошло не так", {
									type: "danger"
								});
							}}
							fields={[
								{
									name: "title_uz",
									value: get(item, "title_uz"),
									required: true
								},
								{
									name: "title_ru",
									value: get(item, "title_ru"),
									required: true
								},

								{
									name: "type",
									value: 1,
									required: true
								},
								{
									name: "code",
									value: get(item, "code"),
									required: true
								},
								{
									name: "copy",
									value: get(item, "copy")
								},
								{
									name: "users_count",
									value: get(item, "users_count", null),
									onSubmitValue: value => (value ? value * 1 : null)
								},
								{
									name: "rates_id",
									required: true,
									type: "array",
									value: get(item, "rates"),
									onSubmitValue: value => (value ? value.map(v => v.id) : null)
								},
								{
									name: "expire_of",
									value: get(item, "expire_of", 1),
									onSubmitValue: value => value * 1,
									required: true
								},
								{
									name: "expire_at",
									type: "number",
									required: true,
									value: get(item, "expire_at"),
									onSubmitValue: value => (value ? value : null)
								},
								{
									name: "start_at",
									type: "number",
									value: get(item, "start_at"),
									onSubmitValue: value => (value[0] ? value[0] : null)
								},
								{
									name: "end_at",
									type: "number",
									value: get(item, "end_at"),
									onSubmitValue: value => (value[1] ? value[1] : null)
								}
							]}
							params={{
								include: "translations,expire_of"
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
