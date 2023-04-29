import React, { useState } from "react";
import { Fields, Grid, Button } from "components";
import { Field } from "formik";
import UserIcon from "assets/images/icons/icons-reklama/User.svg";
import FilmIcon from "assets/images/icons/icons-reklama/Film.svg";
import AdsIcon from "assets/images/icons/icons-reklama/Ads.svg";
const RekalamaSettingsForm = ({ isSubmitting }) => {
	const [clikcButton, setClickButton] = useState(false);
	return (
		<Grid.Row gutter={6} className="align-center">
			<Grid.Column xl={12} lg={12} className="d-flex justify-content-between">
				<div className="d-flex align-center">
					<img src={AdsIcon} alt="" className="reklamaIcon" />
					<Field component={Fields.Input} name="count" label="Количество реклами" />
				</div>
				<div className="d-flex align-center">
					<img src={UserIcon} className="reklamaIcon" alt="" />
					<Field
						component={Fields.Select}
						name="type_users"
						optionLabel={"name"}
						isClearable
						optionValue="id"
						options={[
							{ id: "1", name: "Премиум аккаунт" },
							{ id: "0", name: "Простой аккаунт" }
						]}
						placeholder="Тип пользователя"
						label="Тип пользователя"
					/>
				</div>
				<div className="d-flex align-center">
					<img src={FilmIcon} alt="" className="reklamaIcon" />

					<Field
						component={Fields.Select}
						name="paid"
						optionLabel={"name"}
						isClearable
						optionValue="id"
						options={[
							{ id: "1", name: "Платные" },
							{ id: "0", name: "Бесплатные" }
						]}
						placeholder="Типы фильмов"
						label="Типы фильмов"
					/>
				</div>

				<div className="flex justify-end">
					<Button.Default
						type="primary"
						className="reklamaSettingsBtn"
						onClick={() => {
							setClickButton(!clikcButton);
						}}
						buttonType={clikcButton ? "submit" : "button"}
						loading={isSubmitting}>
						Сохранить
					</Button.Default>
				</div>
			</Grid.Column>
		</Grid.Row>
	);
};

export default RekalamaSettingsForm;
