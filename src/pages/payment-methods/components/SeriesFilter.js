import React, { useState, useEffect } from "react";
import Actions from "modules/entity/actions";
import { Formik, Form, Field } from "formik";
import { Fields, Button } from "components";
import { useDispatch } from "react-redux";
import moment from "moment";
import { get } from "lodash";
const SeriesFilter = ({ film, seriesFilter }) => {
	const dispatch = useDispatch();
	const [seriesValue, setSeriesValue] = useState();
	const [data, setData] = useState();
	const [click, setClick] = useState(false);

	useEffect(() => {
		if (seriesFilter === false) {
			setData(null);
		}
		if (click) {
			setClick(!click);
			dispatch(
				Actions.LoadDefault.request({
					url: `films/count-statistics`,
					version: "v2",
					params: {
						extra: {
							series_id: film ? film.id : "",
							start: seriesValue ? seriesValue.start[0] : "",
							end: seriesValue ? seriesValue.start[1] : ""
						}
					},

					cb: {
						success: data => {
							setData(data);
						},
						error: () => {},
						finally: () => {}
					}
				})
			);
		}
	}, [click, seriesFilter]);

	return (
		<Formik
			initialValues={{
				start: []
			}}
			onSubmit={value => value}
			render={({ values, setFieldValue, handleSubmit }) => {
				if (seriesFilter === false) {
					values.start = [];
					if (seriesValue) {
						seriesValue.start = [];
					}
				}

				return (
					<div className="d-flex align-center justify-between">
						<Form className="mr-5 d-flex ">
							<Field
								component={Fields.NewDatePicker}
								name="start"
								type="range"
								isClearable={true}
								label="Дата"
								maxDate={moment().toDate()}
								onChange={value => {
									setData(undefined);
									setFieldValue("start", value);
								}}
							/>

							{get(values, "start", []).length > 0 && (
								<div style={{ marginTop: "27px" }}>
									<Button.Default
										className="ml-5"
										buttonType="submit"
										onClick={() => {
											setSeriesValue({ start: [...values.start.slice(0, 1), values.start[1] + 86399] });
											setClick(!click);
										}}>
										Выбрать
									</Button.Default>
								</div>
							)}
						</Form>
						{values.start.length >= 2 && data >= 0 && (
							<div className="filmFilter">
								<p>{`Количество просмотров между выбранными днями: ${data}`}</p>
							</div>
						)}
					</div>
				);
			}}
		/>
	);
};

export default SeriesFilter;
