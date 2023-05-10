import React from "react";
import EntityForm from "modules/entity/forms";
import EntityContainer from "modules/entity/containers";
import { useDispatch } from "react-redux";
import { useNotification } from "hooks";
import { get } from "lodash";
import Form from "./components/form";
import { Loader, Typography } from "components";
import Actions from "store/actions";

const Update = ({ history, match }) => {
	const dispatch = useDispatch();
	const { notification } = useNotification();
	const { id } = match.params;
	const UpdateUser = data => {
		dispatch(
			Actions.entities.Update.success({
				entity: "user",
				entityId: id,
				data
			})
		);
	};

	return (
		<EntityContainer.One
			entity="user"
			name={`all-${id}`}
			url={`/user/${id}`}
			primaryKey="id"
			version="v2"
			id={id}
			params={{
				include: "department,roles",
				extra: {
					append: "prev_id,next_id"
				}
			}}>
			{({ item, isFetched }) => {
				return (
					<div className="page-container">
						<EntityForm.Main
							method="put"
							entity="user"
							name={`user`}
							url={`/user/${get(item, "id")}`}
							primaryKey="id"
							version="v2"
							normalizeData={data => data}
							id={get(item, "id")}
							updateData
							onSuccess={data => {
								UpdateUser(data);
								notification("Успешно обновлено", {
									type: "success"
								});
								history.goBack();
							}}
							onError={error => {
								let message = get(error, "message");
								notification(message, {
									type: "danger"
								});
							}}
							params={{
								include: "organization"
							}}
							fields={[
								{
									name: "username",
									required: true,
									value: get(item, "username")
								},
								{
									name: "full_name",
									required: true,
									value: get(item, "full_name")
								},
								{
									name: "password",
									value: get(item, "code"),
									onSubmitValue: value => value && value
								},
								{
									name: "phone",
									required: true,
									min: 12,
									value: get(item, "phone")
								},
								{
									name: "email",
									required: true,
									value: get(item, "email"),
									onSubmitValue: value => value && value
								},
								{
									name: "photo",
									value: get(item, "files", []) ? get(item, "files", []) : [],
									onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
								},
								{
									name: "status",
									required: true,
									value: get(item, "status") === 10,
									onSubmitValue: value => (value ? 10 : 1)
								},
								{
									name: "is_provider",
									value: get(item, "is_provider") === 1,
									onSubmitValue: value => (value ? 1 : 0)
								},
								{
									name: "organization_id",
									value: get(item, "organization"),
									onSubmitValue: value => (value ? value.id : null)
								},
								{
									name: "role",
									required: true,
									value: get(item, "role") ? get(item, "role") : "admin"
								}
							]}>
							{({ values, setFieldValue, isSubmitting }) => {
								return (
									<>
										<Typography.Heading type={5} className="intro-y mt-10 mb-5">
											Измененит пользовател
										</Typography.Heading>
										{!isFetched ? (
											<Loader />
										) : (
											<Form
												{...{
													isUpdate: true,
													isFetched,
													values,
													setFieldValue,
													isSubmitting,
													item
												}}
											/>
										)}
									</>
								);
							}}
						</EntityForm.Main>
					</div>
				);
			}}
		</EntityContainer.One>
	);
};

export default Update;
