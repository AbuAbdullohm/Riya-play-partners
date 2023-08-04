import React from "react";
import EntityForm from "modules/entity/forms";
import { Grid, Panel, Button } from "components";
import { useNotification } from "hooks";

import "../style.scss";

export default function DaysForm({ data, history }) {
	const { notification } = useNotification();

	const onChange = (values, day, inc, value, setFieldValue) => {
		const key = Object.keys(day)[0];
		if (value) {
			setFieldValue(
				"days",
				values.days.map(d => {
					if (d[key] === day[key]) {
						return {
							[key]: {
								people: d[key].people,
								extra_day: value
							}
						};
					} else return d;
				})
			);
		} else if (inc) {
			setFieldValue(
				"days",
				values.days.map(d => {
					if (d[key] === day[key]) {
						return {
							[key]: {
								people: d[key].people,
								extra_day: parseInt(d[key].extra_day) + 1
							}
						};
					} else return d;
				})
			);
		} else {
			setFieldValue(
				"days",
				values.days.map(d => {
					if (d[key] === day[key]) {
						return {
							[key]: {
								people: d[key].people,
								extra_day: d[key].extra_day - 1 < 1 ? 0 : d[key].extra_day - 1
							}
						};
					} else return d;
				})
			);
		}
	};

	return (
		<EntityForm.Main
			method="post"
			entity="user/add-extra-time"
			name={`user/add-extra-time`}
			url="/user/add-extra-time"
			prependData
			primaryKey="id"
			normalizeData={data => data}
			onSuccess={(data, resetForm) => {
				resetForm();
				history.push(`/user/add-extra-time`);
				notification("Успешно добавлено", {
					type: "success"
				});
			}}
			onError={() => {
				notification("Что-то пошло не так", {
					type: "danger"
				});
			}}
			params={{
				include: "translations,files"
			}}
			fields={[
				{
					name: "days",
					required: true,
					value: [
						{
							["10-10-2020"]: {
								people: 55,
								extra_day: 1
							}
						},
						{
							["11-10-2020"]: {
								people: 55,
								extra_day: 1
							}
						},
						{
							["12-10-2020"]: {
								people: 55,
								extra_day: 1
							}
						},
						{
							["13-10-2020"]: {
								people: 55,
								extra_day: 1
							}
						}
					],
					onSubmitValue: values => {
						return values.map(v => {
							const key = Object.keys(v)[0];
							return { [key]: v[key].extra_day };
						});
					}
				}
			]}>
			{({ isSubmitting, values, setFieldValue }) => {
				return (
					<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
						<Grid.Column lg={3}></Grid.Column>

						<Grid.Column lg={6} gutter={10}>
							<Panel className="days_list">
								<h1>Пользователи, срок действия тарифа которых истекает в этот период</h1>
								{values.days.map((day, i) => {
									const key = Object.keys(day)[0];

									return (
										<div key={i} className="days_list-item">
											<div>{key}</div>
											<div className="border"></div>
											<div>{day[key].people}</div>
											<div className="counter">
												<span onClick={() => onChange(values, day, false, false, setFieldValue)}>-</span>
												<input
													onChange={e => {
														onChange(values, day, false, e.target.value, setFieldValue);
													}}
													type="number"
													className="form-control"
													value={day[key].extra_day}
												/>
												<span onClick={() => onChange(values, day, true, false, setFieldValue)}>+</span>
											</div>
										</div>
									);
								})}
								<Button.Default
									type="primary"
									buttonType="submit"
									style={{
										width: "100%"
									}}
									loading={isSubmitting}>
									Добавлять
								</Button.Default>
							</Panel>
						</Grid.Column>

						<Grid.Column lg={3}></Grid.Column>
					</Grid.Row>
				);
			}}
		</EntityForm.Main>
	);
}
