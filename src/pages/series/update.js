import React from "react";
import EntityForm from "modules/entity/forms";
import EntityContainer from "modules/entity/containers";
import { Typography, Spinner } from "components";
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
				entity: "series",
				entityId: id,
				data
			})
		);
	};

	return (
		<EntityContainer.One
			entity="series"
			name={`series-${id}`}
			version="v2"
			url={`/series/${id}`}
			primaryKey="id"
			id={id}
			params={{
				include: "translations,files,film,season,tracks"
			}}>
			{({ item, isFetched }) => {
				return isFetched ? (
					<>
						<Typography.Heading type={5} className="intro-y mt-10 mb-5">
							{t("Изменить актер")}
						</Typography.Heading>

						<EntityForm.Main
							method={"put"}
							entity="series"
							name={"series"}
							version="v2"
							url={`/series/${get(item, "id")}`}
							updateData={true}
							primaryKey="id"
							normalizeData={data => data}
							onSuccess={(data, resetForm) => {
								updateState(data);
								history.push("/series");
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
									name: "tracks",
									required: true,
									value: get(item, "tracks", []).length
										? get(item, "tracks", []).reduce(
												(prev, curr) => [
													...prev,
													{
														name: get(curr, "name", ""),
														name_select: get(curr, "name_select", ""),
														path: get(curr, "path", "")
													}
												],
												[]
										  )
										: [{ name: "", path: null }],
									onSubmitValue: value => {
										return value.reduce(
											(prev, curr) => [
												...prev,
												{
													name: get(curr, "name"),
													name_select: get(curr, "name_select", ""),
													path: get(curr, "path")
												}
											],
											[]
										);
									}
								},
								{
									name: "photo",
									required: true,
									value: get(item, "files") ? get(item, "files", []) : [],
									onSubmitValue: value => value && value.reduce((prev, curr) => [...prev, curr.id], []).join(",")
								},
								{
									name: "film_id",
									value: get(item, "film"),
									required: true,
									onSubmitValue: field => (field ? field.id : null)
								},
								{
									name: "season_id",
									type: "object",
									value: get(item, "season") ? get(item, "season") : "",
									required: false,
									onSubmitValue: field => (field && field.id ? field.id : "")
								},
								{
									name: "sort",
									value: get(item, "sort"),
									required: true,
									onSubmitValue: field => Number(field)
								},
								{
									name: "status",
									value: get(item, "status") === 1,
									onSubmitValue: value => (value ? 1 : 0)
								}
							]}
							params={{
								sort: "id",
								include: "translations,files,tracks,films"
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
					<Spinner position="center" className="mt-5" />
				);
			}}
		</EntityContainer.One>
	);
};

export default Update;
