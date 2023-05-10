import React from "react";
import EntityForm from "modules/entity/forms";
import ModalForm from "./formSeriesModal";
import get from "lodash/get";
import { Loader } from "components";
import { useNotification } from "hooks";

const UpdateSeriesModal = ({ item, selected, showUpdateModal, updateSeries = () => {}, canUpdate, setCanUpdate }) => {
	const { notification } = useNotification();

	return (
		<EntityForm.Main
			method={"put"}
			entity="series"
			name={`series`}
			url={`/series/${get(selected, "id")}`}
			updateData={true}
			primaryKey="id"
			version="v2"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				updateSeries(data, get(selected, "id"));
				showUpdateModal(false);
				notification("Успешно добавлено", {
					type: "success"
				});
				setCanUpdate(!canUpdate);
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
					value: get(selected, "name_uz")
				},
				{
					name: "name_ru",
					required: true,
					value: get(selected, "name_ru")
				},
				{
					name: "track",
					value: get(selected, "track", []).length
						? get(selected, "track").reduce(
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
						: [{ name: "", name_select: "", path: null }],
					onSubmitValue: value =>
						value.reduce(
							(prev, curr) => [
								...prev,
								{
									name_select: get(curr, "name_select"),
									name: get(curr, "name"),
									path: get(curr, "path")
								}
							],
							[]
						)
				},
				{
					name: "photo",
					value: get(selected, "files") ? get(selected, "files", []) : [],
					onSubmitValue: value => (value ? value.reduce((prev, curr) => [...prev, curr.id], []).join(",") : "")
				},
				{
					name: "film_id",
					value: get(selected, "film"),
					required: true,
					onSubmitValue: field => (field ? field.id : null)
				},
				{
					name: "season_id",
					value: get(selected, "season") ? get(selected, "season") : "",
					required: false,
					type: "object",
					onSubmitValue: field => (field && field.id ? field.id : "")
				},
				{
					name: "sort",
					value: get(selected, "sort"),
					required: false,
					onSubmitValue: field => Number(field)
				},
				{
					name: "status",
					value: get(selected, "status") === 1,
					onSubmitValue: value => (value ? 1 : 0)
				}
			]}
			params={{
				sort: "id",
				include: "translations,files,track,film,season"
			}}>
			{({ isSubmitting, values, setFieldValue }) => {
				return isSubmitting ? <Loader /> : <ModalForm {...{ item, values, setFieldValue, isUpdate: true }} />;
			}}
		</EntityForm.Main>
	);
};

export default UpdateSeriesModal;
