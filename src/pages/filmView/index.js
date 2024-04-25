import React, { useState } from "react";
import { useParams } from "react-router";
import { get } from "lodash";
import { Loader, Panel } from "components";
import EntityContainer from "modules/entity/containers";
import FilmInfo from "./components/filmInfo";
import SeriesTable from "./components/seriesTable";

import "./style.scss";

export default function FilmView() {
	const { id } = useParams();
	const [activeTab, setActiveTab] = useState("");
	const [page, setPage] = useState(1);

	return (
		<EntityContainer.One
			entity="films"
			name={`films-${id}`}
			url={`/films/${id}`}
			primaryKey="id"
			id={id}
			params={{
				include:
					"translations,files,actors.photo,thriller,tags,categories,paid,country,maker.photo,date,type,gallery,genres,season,screenshots,company,holder"
			}}>
			{({ item, isFetched }) => {
				if (!isFetched) return <Loader />;

				return (
					<EntityContainer.All
						entity="seasons"
						name={`seasons`}
						url="/seasons"
						version="v1"
						primaryKey="id"
						params={{
							sort: "id",
							limit: 1000
						}}>
						{({ items: seasons }) => {
							return (
								<EntityContainer.All
									entity="series"
									name={`series`}
									url="/series"
									version="v2"
									primaryKey="id"
									params={{
										sort: "-id",
										page: page,
										limit: 10,
										filter: {
											film_id: get(item, "id"),
											season_id: activeTab
										},
										include: "translations,files,film,season,track,screenshots.file"
									}}>
									{({ items: series, meta }) => {
										return (
											<>
												<Panel className="film_view">
													<FilmInfo item={item} seriesTotalCount={get(meta, "totalCount")} />
												</Panel>

												<SeriesTable
													activeTab={activeTab}
													setActiveTab={setActiveTab}
													page={page}
													setPage={setPage}
													series={series}
													seasons={seasons}
													isFetched={isFetched}
													meta={meta}
													item={item}
												/>
											</>
										);
									}}
								</EntityContainer.All>
							);
						}}
					</EntityContainer.All>
				);
			}}
		</EntityContainer.One>
	);
}
