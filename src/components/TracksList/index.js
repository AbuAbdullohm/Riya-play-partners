import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Field } from "formik";
import { Fields, Grid, Button } from "components";
import { get } from "lodash";

const TracksList = ({ values, setFieldValue }) => {
	const { t } = useTranslation();
	const [inputFields, setInputFields] = useState(get(values, "track") ? get(values, "track") : [{ name: "", name_select: "", path: null }]);
	useEffect(() => {
		setFieldValue("track", inputFields);
	}, [inputFields, setInputFields]);

	const removeMultiBox = index => {
		if (inputFields.length > 1) {
			if (index === 0 && get(values, "track").length > 1) {
				const newArray = [...get(values, "track").slice(index + 1)];

				setInputFields(newArray);
			} else if (index === inputFields.length - 1) {
				const newArray = [...get(values, "track").slice(0, -1)];

				setInputFields(newArray);
			} else {
				const newArray = [...get(values, "track").slice(0, index), ...get(values, "track").slice(index + 1)];
				setInputFields(newArray);
			}
		}
	};

	const addMultiBox = index => {
		if ((index === 0 && get(values, "track").length === 1) || index === get(values, "track").length - 1) {
			const newArray = [...get(values, "track"), { name: "", path: null, name_select: "" }];
			setInputFields(newArray);
		} else {
			const newArray = [...get(values, "track").slice(0, index + 1), { name: "", name_select: "", path: null }, ...get(values, "track").slice(index + 1)];
			setInputFields(newArray);
		}
	};

	return (
		<div className="tracks-list">
			{[...inputFields].map((item, index) => (
				<Grid.Row key={index} gutter={6} gutterX={4} className={" align-items-end"}>
					<Grid.Column xs={12} lg={6}>
						<Grid.Row className="gap-y-2">
							<Grid.Column xs={12} lg={6}>
								<Field
									label="Формат"
									component={Fields.Select}
									name={`track[${index}].name_select`}
									type="text"
									placeholder={t("Формат")}
									optionValue="value"
									optionLabel="name"
									options={[
										{ id: 1, value: 360, name: "360" },
										{ id: 2, value: 480, name: "480" },
										{ id: 3, value: 720, name: "720" },
										{ id: 4, value: 1080, name: "1080" },
										{ id: 5, value: 2160, name: "2160" }
									]}
								/>
							</Grid.Column>
							<Grid.Column xs={12} lg={6}>
								<Field label="Формат" component={Fields.Input} name={`track[${index}].name`} type="text" placeholder={t("Формат")} />
							</Grid.Column>
						</Grid.Row>
					</Grid.Column>
					<Grid.Column xs={12} lg={6}>
						<Grid.Row gutterX={2}>
							<Grid.Column xs={12} lg={9}>
								<Field label="Дорожка" component={Fields.Input} name={`track[${index}].path`} type="text" placeholder={t("Ссылка дорожки")} />
							</Grid.Column>
							<Grid.Column lg={3}>
								<div className="d-flex mt-7">
									{get(values, "track", []).length > 1 ? (
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
					</Grid.Column>
				</Grid.Row>
			))}
		</div>
	);
};

export default TracksList;
