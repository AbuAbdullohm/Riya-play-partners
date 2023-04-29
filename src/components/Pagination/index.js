import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import { useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import qs from "qs";
import { Icon } from "components";
import "./style.scss";

const PaginationComponent = ({ pageCount = 1, perPage = "10", currentPage, className = "", handlePageClick }) => {
	const { t } = useTranslation();
	const history = useHistory();
	const location = useLocation();
	const [limit, setLimit] = useState(perPage);
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });

	const options = [
		{
			id: 1,
			value: "10"
		},
		{
			id: 2,
			value: "15"
		},
		{
			id: 3,
			value: "20"
		},
		{
			id: 4,
			value: "30"
		},
		{
			id: 5,
			value: "40"
		},
		{
			id: 6,
			value: "50"
		}
	];

	const handlePageLimit = e => {
		setLimit(e.target.value);
		let newQs = {};
		for (const key in params) {
			if (Object.hasOwnProperty.call(params, key)) {
				const element = params[key];
				if (key !== "pageLimit" && key !== "page") {
					newQs = { ...newQs, [key]: element };
				}
			}
		}

		history.push({
			search: qs.stringify({
				...newQs,
				pageLimit: e.target.value
			})
		});
	};

	return (
		<div className={`intro-y col-span-12 flex align-center justify-between sm:flex-row mt-10 ${className}`}>
			<div className="page-size">
				<span>{t("Page size")}</span>
				<select className="w-20 form-select box mt-3 sm:mt-0 ml-3" onChange={handlePageLimit} value={limit}>
					{options.map(option => (
						<option key={option.id} value={option.value}>
							{option.value}
						</option>
					))}
				</select>
			</div>
			<div className="flex align-center">
				<div className="pagination__link cursor-pointer" onClick={() => handlePageClick(0)}>
					<Icon name="chevrons-left" className="w-5 h-5" />
				</div>
				<ReactPaginate
					initialPage={currentPage - 1}
					forcePage={currentPage - 1}
					previousLabel={
						<div className="pagination__link">
							<Icon name="chevron-left" className="w-5 h-5" />
						</div>
					}
					nextLabel={
						<div className="pagination__link">
							<Icon name="chevron-right" className="w-5 h-5" />
						</div>
					}
					containerClassName={"pagination"}
					pageLinkClassName={"pagination__link"}
					activeLinkClassName={"pagination__link--active"}
					breakLinkClassName={"pagination__link"}
					pageCount={pageCount}
					marginPagesDisplayed={1}
					pageRangeDisplayed={2}
					onPageChange={data => handlePageClick(data.selected)}
					disableInitialCallback={true}
				/>
				<div className="pagination__link cursor-pointer" onClick={() => handlePageClick(pageCount - 1)}>
					<Icon name="chevrons-right" className="w-5 h-5" />
				</div>
			</div>
		</div>
	);
};

export default PaginationComponent;
