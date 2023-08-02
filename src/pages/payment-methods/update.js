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
				entity: "payment-methods",
				entityId: id,
				data
			})
		);
	};

	return (
		<EntityContainer.One
			entity="payment-methods"
			name={`payment-methods-${id}`}
			version="v2"
			url={`/payment-methods/${id}`}
			primaryKey="id"
			id={id}
			params={{
				include: "files"
			}}>
			{({ item, isFetched }) => {
				return isFetched ? (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							{t("Изменить способ оплата")}
						</Typography.Heading>

						<EntityForm.Main
							method={"put"}
							entity="payment-methods"
							name={"payment-methods"}
							version="v2"
							url={`/payment-methods/${get(item, "id")}`}
							updateData={true}
							primaryKey="id"
							normalizeData={data => data}
							onSuccess={(data, resetForm) => {
								updateState(data);
								history.push("/payment-methods");
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
									name: "title",
									required: true,
									value: get(item, "title")
								},

								{
									name: "description",
									required: true,
									value: get(item, "description")
								},
								{
									name: "photo_id",
									required: true,
									value: get(item, "files") ? get(item, "files", []) : [],
									onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
								},
								{
									name: "slug",
									value: get(item, "slug"),
									required: true
								},
								{
									name: "status",
									value: get(item, "status") === 1,
									onSubmitValue: value => (value ? 1 : 0)
								}
							]}
							params={{
								sort: "id",
								include: "files"
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
