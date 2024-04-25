import React, { Fragment, useState } from "react";
import { get } from "lodash";
import { Tabs, Table, Icon, Pagination, Panel, Modal } from "components";
import { time } from "services";
import { useTranslation } from "react-i18next";
import Slider from "./Slider";

export default function SeriesTable({ activeTab, setActiveTab, seasons, series, page, setPage, isFetched, meta, item }) {
	const { t } = useTranslation();
	const [sliderModal, setSliderModal] = useState({ open: false, items: [] });

	return (
		<Fragment>
			<Modal.Default className="slider_modal" key={"slider-modal"} toggle={sliderModal.open} setToggle={() => setSliderModal({ open: false, items: [] })}>
				<div className="close-icon" onClick={() => setSliderModal({ open: false, items: [] })}>
					<Icon name="x" />
				</div>
				<Slider
					key={"media"}
					items={sliderModal.items}
					valueDirection={"media_info_url"}
					image={false}
					options={{
						arrows: false,
						perPage: 1,
						padding: 100,
						gap: 100,
						height: "90vh"
					}}
				/>
			</Modal.Default>
			<h2 className="series_title">{get(item, "type.has_season") ? "Серии" : "Фильм"}</h2>
			<Panel className="series_list">
				{get(item, "type.has_season") ? (
					<Tabs
						activeItem={activeTab ? activeTab : get(seasons, "[0].id")}
						items={seasons.map(season => ({ code: season.id, title: season.name_ru }))}
						onTabChange={code => setActiveTab(code)}
					/>
				) : null}

				<Table
					items={series}
					isFetched={isFetched}
					rowKey="id"
					className="mt-5"
					emptyUiText="Список пусто"
					columns={[
						{
							title: t("ID"),
							dataIndex: "id",
							className: "w-4",
							render: value => <>{value}</>
						},
						{
							title: t("Фильм"),
							dataIndex: "files",
							className: "w-8",
							render: (value, row) => (
								<div
									className="seria_stream"
									onClick={() => {
										setSliderModal({ open: true, items: [get(row, "track").at(-1)] });
									}}>
									<span className="play">
										<Icon name="play" />
									</span>
									<img src={get(value, "[0].thumbnails.small.src")} />
								</div>
							)
						},
						{
							title: t("Название фильм"),
							dataIndex: "film",
							render: value => <>{get(value, "name_ru")}</>
						},
						{
							title: t("Дата публикации"),
							dataIndex: "published_at",
							render: value => time.to(get(item, "publish_time"), "DD.MM.YYYY HH:mm:ss")
						},
						{
							title: t("Количество просмотров"),
							dataIndex: "viewed",
							render: value => value
						},
						{
							title: t("Статус"),
							dataIndex: "season",
							render: value => (value === 1 ? "Активный" : "Неактивный")
						}
					]}
				/>
				{get(meta, "pageCount", 1) > 1 && (
					<Pagination
						className="pagination"
						pageCount={get(meta, "pageCount", 1)}
						currentPage={page ? Number(page) : 1}
						handlePageClick={next => setPage(next + 1)}
					/>
				)}
			</Panel>
		</Fragment>
	);
}
