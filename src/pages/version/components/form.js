import React, { useEffect, useState } from "react";
import { Fields, Grid, Panel, Button } from "components";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import Actions from "modules/entity/actions";
import "../style.scss";
import Android from "assets/images/icons/android.svg";
import AndroidTv from "assets/images/icons/tv-monitor.svg";
import Apple from "assets/images/icons/apple.svg";
import AppleTv from "assets/images/icons/apple-tv.svg";
import { get } from "lodash";

const Form = ({ isUpdate, isSubmitting, setFieldValue, values }) => {
	const { t } = useTranslation();
	const history = useHistory();
	const dispatch = useDispatch();
	const [dataVersion, setDataVersion] = useState([]);
	useEffect(() => {
		dispatch(
			Actions.LoadDefault.request({
				url: "/versions/check",
				version: "v2",
				cb: {
					success: data => {
						setDataVersion(data);
					},
					error: error => {
						console.log(error);
					}
				}
			})
		);
	}, []);
	return (
		<Grid.Row gutter={10} gutterX={4} className={"mb-10"}>
			<Grid.Column md={8} gutter={10}>
				<Panel>
					<Field
						component={Fields.Select}
						label="Тип операционной системы"
						name="type"
						placeholder="Введите тип операционной системы"
						options={[
							{
								name: (
									<div className="d-flex align-center">
										<img className="box-none" style={{ width: "30px", marginRight: "10px" }} src={Android} alt="" /> ANDROID
									</div>
								),
								id: 1
							},
							{
								name: (
									<div className="d-flex align-center">
										<img className="box-none" style={{ width: "30px", marginRight: "10px" }} src={Apple} alt="" /> IOS
									</div>
								),
								id: 2
							},
							{
								name: (
									<div className="d-flex align-center">
										<img className="box-none" style={{ width: "30px", marginRight: "10px" }} src={AndroidTv} alt="" /> ANDROID TV
									</div>
								),
								id: 3
							},
							{
								name: (
									<div className="d-flex align-center">
										<img className="box-none" style={{ width: "30px", marginRight: "10px" }} src={AppleTv} alt="" /> IOS TV
									</div>
								),
								id: 4
							}
						]}
						optionValue="id"
						optionLabel="name"
					/>

					<Field
						component={Fields.InputMask}
						name="version"
						size="large"
						format="#.#.#"
						style={{ width: "100%" }}
						placeholder="Введите версии"
						label="Версия"
					/>
					<Field
						component={Fields.Textarea}
						name="comment_app"
						type="text"
						label="Сообщение для пользователя"
						placeholder="Введите сообщение для пользователя"
					/>
					<Field component={Fields.Textarea} name="dev_report" type="text" label="Отчет разработчика" placeholder="Введите отчет разработчика" />

					<div className="flex justify-end">
						<Button.Default type="secondary" buttonType="button" onClick={() => history.goBack()}>
							{t("Отменить")}
						</Button.Default>
						<Button.Default type="primary" buttonType="submit" loading={isSubmitting}>
							{isUpdate ? t("Сохранить") : t("Добавить")}
						</Button.Default>
					</div>
				</Panel>
			</Grid.Column>

			<Grid.Column md={4} gutter={10}>
				<Panel className="mb-4 text-center">Активная версия</Panel>
				{dataVersion.length > 0 ? (
					dataVersion.map(item => {
						return (
							<Panel key={get(item, "id", "")} className="mb-4 ">
								<div className="d-flex justify-content-between">
									<div>
										<div className="d-flex align-center ">
											{get(item, "type") === 1 ? (
												<div className="d-flex align-center ">
													<img className="box-none" style={{ width: "30px", marginRight: "10px" }} src={Android} alt="" /> ANDROID
												</div>
											) : get(item, "type") === 2 ? (
												<div className="d-flex align-center">
													<img className="box-none" style={{ width: "30px", marginRight: "10px" }} src={Apple} alt="" /> IOS
												</div>
											) : get(item, "type") === 3 ? (
												<div className="d-flex align-center">
													<img className="box-none" style={{ width: "30px", marginRight: "10px" }} src={AndroidTv} alt="" /> ANDROID
													TV
												</div>
											) : get(item, "type") === 4 ? (
												<div className="d-flex align-center">
													<img className="box-none" style={{ width: "30px", marginRight: "10px" }} src={AppleTv} alt="" /> IOS TV
												</div>
											) : (
												"Ma'lumot yo'q"
											)}{" "}
											<span className="ml-3 font-bold">{get(item, "version")}</span>
										</div>
									</div>
									<div className="versionActive">
										<div className="spinner-version">
											<div className="double-bounce1" />
											<div className="double-bounce2" />
										</div>
									</div>
								</div>
							</Panel>
						);
					})
				) : (
					<h1 className="font-bold text-center">Malumot yuklanmoqda</h1>
				)}
			</Grid.Column>
		</Grid.Row>
	);
};

export default Form;
