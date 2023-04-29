import React, { useEffect, useState } from "react";
import { Fields, Grid, Button, Spinner } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import storage from "services/storage";
import config from "config";

const TracksList = ({ values, setFieldValue }) => {
	const { t } = useTranslation();
	const [inputFields, setInputFields] = useState(values.tracks ? values.tracks : [{ name: "", path: null, name_select: "" }]);

	const [loading, setLoading] = useState(true);
	const [options, setOptions] = useState([]);
	const [isFetchedSelect, setIsFetchedSelect] = useState(false);

	useEffect(() => {
		getData();
	}, []);

	const getData = () => {
		let token = storage.get("token");

		fetch(`${config.API_ROOT}/films/files`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error("Something went wrong");
				}
			})
			.then(data => {
				setOptions(data.reduce((prev, curr) => [...prev, { value: curr, name: curr }], []));
				setIsFetchedSelect(true);
				setLoading(false);
			})
			.catch(error => {
				setLoading(false);
				setIsFetchedSelect(false);
			});
	};

	useEffect(() => {
		setFieldValue("tracks", inputFields);
	}, [inputFields, setInputFields]);

	const removeMultiBox = index => {
		if (inputFields.length > 1) {
			if (index === 0 && values.tracks.length > 1) {
				const newArray = [...values.tracks.slice(index + 1)];
				setInputFields(newArray);
			} else if (index === inputFields.length - 1) {
				const newArray = [...values.tracks.slice(0, -1)];
				setInputFields(newArray);
			} else {
				const newArray = [...values.tracks.slice(0, index), ...values.tracks.slice(index + 1)];
				setInputFields(newArray);
			}
		}
	};

	const addMultiBox = index => {
		if ((index === 0 && values.tracks.length === 1) || index === values.tracks.length - 1) {
			const newArray = [...values.tracks, { name: "", path: null, name_select: "" }];
			setInputFields(newArray);
		} else {
			const newArray = [...values.tracks.slice(0, index + 1), { name: "", path: null, name_select: "" }, ...values.tracks.slice(index + 1)];
			setInputFields(newArray);
		}
	};

	return (
		<div className={`tracks-list`}>
			{!loading && isFetchedSelect ? (
				[...inputFields].map((item, index) => (
					<Grid.Row key={index} gutter={10} gutterX={4} className={"mb-5 align-items-end"}>
						<Grid.Column xs={12} lg={4}>
							<Field label="Формат" component={Fields.Input} name={`tracks[${index}].name`} type="text" placeholder={t("Формат")} />
						</Grid.Column>
						<Grid.Column xs={12} lg={6}>
							<Field
								label="Дорожка"
								component={Fields.Select}
								name={`tracks[${index}].path`}
								isSearchable={true}
								isClearable={true}
								optionLabel="name"
								optionValue="value"
								placeholder={t("Поиск")}
								options={options}
							/>
						</Grid.Column>
						<Grid.Column xs={12} lg={2}>
							<div className="d-flex mb-5">
								{values.tracks.length > 1 ? (
									<Button.Outline
										onClick={() => removeMultiBox(index)}
										style={{ width: "100%" }}
										buttonType="button"
										className="mr-4"
										type="danger">
										-
									</Button.Outline>
								) : null}
								<Button.Outline onClick={() => addMultiBox(index)} style={{ width: "100%" }} buttonType="button" type="success">
									+
								</Button.Outline>
							</div>
						</Grid.Column>
					</Grid.Row>
				))
			) : (
				<Spinner />
			)}
		</div>
	);
};

export default TracksList;
