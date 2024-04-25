import React from "react";
import EntityForm from "modules/entity/forms";
import EntityContainer from "modules/entity/containers";
import { Typography, Loader } from "components";
import { useNotification } from "hooks";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import Form from "./components/form";
import { useDispatch } from "react-redux";
import Actions from "store/actions";

const Update = ({ location, history, match }) => {
	const { notification } = useNotification();
	const { t } = useTranslation();
	const { id } = match.params;
	const dispatch = useDispatch();

	const updateState = data => {
		dispatch(
			Actions.entities.Update.success({
				entity: "payment-method",
				entityId: id,
				data
			})
		);
	};

	return (
		<EntityContainer.One
			entity="payment-method"
			name={`payment-method-${id}`}
			version="v3"
			url={`/payment-method/${id}`}
			primaryKey="id"
			id={id}
			params={{
				include: "logo"
			}}>
			{({ item, isFetched }) => {
				return isFetched ? (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							{t("Изменить способ оплата")}
						</Typography.Heading>

						<EntityForm.Main
							method={"put"}
							entity="payment-method"
							name={"payment-method"}
							version="v3"
							url={`/payment-method/${get(item, "id")}`}
							updateData={true}
							primaryKey="id"
							normalizeData={data => data}
							onSuccess={(data, resetForm) => {
								updateState(data);
								history.push("/payment-method");
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
									name: "name_uz",
									required: true,
									value: get(item, "name_uz")
								},
								{
									name: "name_ru",
									required: true,
									value: get(item, "name_ru")
								},
								{
									name: "name_en",
									required: true,
									value: get(item, "name_en")
								},

								{
									name: "description_uz",
									required: true,
									value: get(item, "description_uz")
								},

								{
									name: "description_ru",
									required: true,
									value: get(item, "description_ru")
								},

								{
									name: "description_en",
									required: true,
									value: get(item, "description_en")
								},
								{
									name: "logo_id",
									required: true,
									value: get(item, "logo") ? [get(item, "logo", [])] : [],
									onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
								},
								{
									name: "is_redirectable",
									value: get(item, "is_redirectable"),
									onSubmitValue: value => (value ? 1 : 0)
								},
								{
									name: "url",
									value: get(item, "url"),
									onSubmitValue: value => value
								},
								{
									name: "status",
									value: get(item, "status") === 1,
									onSubmitValue: value => (value ? 1 : 0)
								}
							]}
							params={{
								sort: "id",
								include: "logo"
							}}>
							{({ isSubmitting, values, setFieldValue, setFieldTouched, validateForm }) => {
								return (
									<>
										<Form
											{...{
												isFetched,
												values,
												setFieldValue,
												isSubmitting,
												setFieldTouched,
												isUpdate: true,
												validateForm
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
