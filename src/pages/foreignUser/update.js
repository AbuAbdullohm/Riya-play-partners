import React from "react";
import EntityForm from "modules/entity/forms";
import EntityContainer from "modules/entity/containers";
import { useDispatch } from "react-redux";
import { useNotification } from "hooks";
import { get } from "lodash";
import Form from "./components/form";
import { Spinner, Typography } from "components";
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
							version="v2"
							primaryKey="id"
							normalizeData={data => data}
							id={get(item, "id")}
							updateData
							onSuccess={data => {
								UpdateUser(data);
								notification("Успешно обновлено", {
									type: "success"
								});
								history.push("/foreign-user");
							}}
							onError={error => {
								let message = get(error, "message");
								notification(message, {
									type: "danger"
								});
							}}
							params={{}}
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
									name: "code",
									required: true,
									min: 4,
									max: 4,
									value: get(item, "code")
								},
								{
									name: "phone",
									required: true,
									value: get(item, "phone"),
									min: 12
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
									name: "role",
									required: true,
									value: "user"
								},
								{
									name: "foreign_user",
									value: 1
								}
							]}>
							{({ values, setFieldValue, isSubmitting, errors }) => {
								return (
									<>
										{(!isFetched || isSubmitting) && (
											<div className="spinner-overlay">
												<Spinner tips="Загрузка..." />
											</div>
										)}
										<Typography.Heading type={5} className="intro-y mt-10 mb-5">
											Создать пользователей
										</Typography.Heading>
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
