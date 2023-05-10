import React, { useState } from "react";
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
	const [userUpdate, setUserUpdate] = useState();

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
			version="v2"
			primaryKey="id"
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
							url={`/user/update-phone`}
							primaryKey="id"
							normalizeData={data => data}
							id={get(item, "id")}
							version="v2"
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
								let phone = get(error, "phone");

								if (phone) {
									notification(phone, {
										type: "danger"
									});
								} else
									notification(message, {
										type: "danger"
									});
							}}
							params={{
								extra: {
									phone: userUpdate ? userUpdate.phone : "",
									user_id: id ? id : ""
								}
							}}
							fields={[
								{
									name: "phone",
									required: true,
									value: get(item, "phone"),
									min: 12
									// max: 12
								}
							]}>
							{({ values, setFieldValue, isSubmitting }) => {
								setUserUpdate(values);
								return (
									<>
										<Typography.Heading type={5} className="intro-y mt-10 mb-5">
											Изменение номер пользователя
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
