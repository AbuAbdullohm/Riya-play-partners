import React, { Fragment, useState } from "react";
import { Grid, Modal, Icon } from "components";
import { get } from "lodash";
import { time } from "services";
import Slider from "./Slider";

export default function FilmInfo({ item, seriesTotalCount }) {
	const [sliderModal, setSliderModal] = useState({ open: false, items: [] });

	return (
		<>
			<Modal.Default className="slider_modal" key={"slider-modal"} toggle={sliderModal.open} setToggle={() => setSliderModal({ open: false, items: [] })}>
				<div className="close-icon" onClick={() => setSliderModal({ open: false, items: [] })}>
					<Icon name="x" />
				</div>
				<Slider
					key={"images"}
					items={sliderModal.items}
					valueDirection={"thumbnails.normal.src"}
					options={{
						perPage: 1,
						padding: 200,
						gap: 200,
						height: "100vh"
					}}
				/>
			</Modal.Default>

			<Grid.Row gutterX={40}>
				<Grid.Column lg={3}>
					<div className="film_view-image">
						<img src={get(item, "files[0].thumbnails.normal.src")} alt={get(item, "files[0].title")} />
					</div>
					{get(item, "thriller[0].link") ? (
						<div className="film_view-thriller">
							<p className="film_view-thriller-title">Treyler</p>
							<video controls>
								<source src={get(item, "thriller[0].link")} alt={get(item, "thriller[0].title")} />
							</video>
						</div>
					) : null}
				</Grid.Column>

				{/* // */}

				<Grid.Column lg={6} className="film_view-content">
					<h1 className="title">{get(item, "name_uz")}</h1>
					<p className="title_2">
						{get(item, "name_ru")} <b>{get(item, "age_limit")}</b>
					</p>
					<p className="about_film">О фильме</p>
					<p className="description">
						<b>UZ:</b> {get(item, "description_uz")}
					</p>
					<p className="description">
						<b>RU:</b> {get(item, "description_ru")}
					</p>

					<p className="actors_title">Режиссер и Актеры:</p>
					<div className="actors_list">
						{[get(item, "maker"), ...get(item, "actors")].map((actor, i) => {
							return (
								<div
									key={i}
									className="actor"
									onMouseLeave={() => {
										document.querySelector(`#actor_info_${i}`).setAttribute("style", "opacity: 0; z-index: 0");
									}}>
									<div
										className="actor_title"
										onMouseEnter={() => {
											document.querySelector(`#actor_info_${i}`).setAttribute("style", "opacity: 1; z-index: 1");
										}}>
										{get(actor, "name_uz")},
									</div>
									<div className="actor_info" id={`actor_info_${i}`}>
										<img src={get(actor, "photo[0].thumbnails.normal.src")} alt={get(actor, "name_uz")} />
										<div>
											<p className="name">{get(actor, "name_uz")}</p>
											<p className="type">{i === 0 ? "Режиссер" : "Актер"}</p>
											<p className="bio">{get(actor, "bio_uz")}</p>
										</div>
									</div>
								</div>
							);
						})}
					</div>

					<div className="gallery">
						<h2 className="title">Галлерея</h2>
						<Slider
							items={get(item, "gallery")}
							valueDirection={"thumbnails.normal.src"}
							onClick={items => setSliderModal({ open: true, items })}
							options={{
								arrows: true,
								perPage: 2.5,
								gap: 10,
								height: 170,
								pagination: false,
								focus: "center"
							}}
						/>
					</div>
				</Grid.Column>

				{/* // */}

				<Grid.Column lg={3} className="film_view-about">
					<h2 className="title">О фильме</h2>
					<div className="about-item">
						<span>Год производства:</span>
						<span>{get(item, "year")}</span>
					</div>
					<div className="about-item">
						<span>Продолжительность:</span>
						<span>{get(item, "playback_time")} мин</span>
					</div>
					<div className="about-item">
						<span>Страна:</span>
						<span>{get(item, "country.name_ru")}</span>
					</div>
					<div className="about-item">
						<span>Жанр:</span>
						<span>
							{get(item, "genres").map((item, i) => (
								<Fragment key={i}>{get(item, "name_ru")}, </Fragment>
							))}
						</span>
					</div>
					<div className="about-item">
						<span>Кино компания:</span>
						<span>{get(item, "company.title")}</span>
					</div>
					<div className="about-item">
						<span>Правообладатель:</span>
						<span>{get(item, "holder.title_ru")}</span>
					</div>
					<div className="about-item">
						<span>Категория:</span>
						<span>
							{get(item, "categories").map((item, i) => (
								<Fragment key={i}>{get(item, "title_ru")}, </Fragment>
							))}
						</span>
					</div>
					<div className="about-item">
						<span>Формат:</span>
						<span>
							{get(item, "tags").map((item, i) => (
								<Fragment key={i}>{get(item, "title_ru")}, </Fragment>
							))}
						</span>
					</div>
					<div className="about-item">
						<span>Возрастное ограничение:</span>
						<span>{get(item, "age_limit")}</span>
					</div>
					<div className="about-item">
						<span>Тип контент:</span>
						<span>{get(item, "type.name_ru")}</span>
					</div>
					<div className="about-item">
						<span>Кинопоиск ID:</span>
						<span>{get(item, "kinopoisk_id")}</span>
					</div>
					<div className="about-item">
						<span>RiyaPlay рейтинг:</span>
						<span>{get(item, "riyaplay_rating")}</span>
					</div>
					<div className="about-item">
						<span>Кинопоиск рейтинг:</span>
						<span>{get(item, "kinopoisk_rating")}</span>
					</div>
					<div className="about-item">
						<span>IMDB рейтинг:</span>
						<span>{get(item, "imdb_rating")}</span>
					</div>
					<div className="about-item">
						<span>Смотреть на:</span>
						<span>
							{item.visible_web ? "Web, " : ""}
							{item.visible_tv ? "TV, " : ""}
							{item.visible_mobile ? "Mobile" : ""}
						</span>
					</div>
					<div className="about-item">
						<span>Тип:</span>
						<span>
							{item.paid ? "Платный, " : ""}
							{item.recommended ? "Рекомендуемые, " : ""}
							{item.enabled_watermark ? "Ватермарк" : ""}
						</span>
					</div>
					<div className="about-item">
						<span>Тип просмотрена:</span>
						<span>
							Смотреть за границей,
							{item.foreign_user_can_view ? " Иностранные пользователи" : ""}
						</span>
					</div>
					<div className="about-item">
						<span>Статус:</span>
						<span className={item.status ? "green" : "red"}>{item.status ? "Активный" : "Неактивный"}</span>
					</div>

					<div className="about-second-title">Инфо</div>

					<div className="about-item">
						<span>Количество просмотров:</span>
						<span>{get(item, "viewed")}</span>
					</div>
					<div className="about-item">
						<span>Серии:</span>
						<span>{seriesTotalCount}</span>
					</div>
					<div className="about-item">
						<span>Сезоны:</span>
						<span>{get(item, "", "-")}</span>
					</div>
					<div className="about-item">
						<span>Дата публикации:</span>
						<span>{time.to(get(item, "publish_time"), "DD.MM.YYYY HH:mm:ss")}</span>
					</div>
					<div className="about-item">
						<span>Дата обновлено:</span>
						<span>{time.to(get(item, "updated_at"), "DD.MM.YYYY HH:mm:ss")}</span>
					</div>
					<div className="about-item">
						<span>Дата добавления последней части:</span>
						<span>{time.to(get(item, "updated_at"), "DD.MM.YYYY HH:mm:ss")}</span>
					</div>
				</Grid.Column>
			</Grid.Row>
		</>
	);
}
