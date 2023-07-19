import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { get } from "lodash";
import qs from "qs";
import useOutsideClick from "hooks/useOutsideClick";
import { Button, Dropdown, Icon } from "..";

import "./style.scss";
import IconComponent from "components/Icon";

const PageHeaderComponent = ({
	title = "",
	buttonName = "Add",
	buttonClick,
	meta,
	filter = false,
	textLeft = false,
	setFilter,
	hasButton = true,
	sort = {
		value: false,
		title: ""
	},
	addDay = false,
	hasFilter = false,
	hasExport = false,
	hasSearch = false,
	filterLang = false,
	btnClassName,
	exportUrls = [],
	filterDay,
	children,
	...otherProps
}) => {
	const history = useHistory();
	const { pathname } = useLocation();
	const { t } = useTranslation();
	const location = useLocation();
	const params = qs.parse(location.search, { ignoreQueryPrefix: true });
	const to = get(meta, "currentPage", 0) * Number(get(meta, "perPage", 0));
	const from = to - Number(get(meta, "perPage", 0)) + 1;
	const total = get(meta, "totalCount", 0);

	const { ref, isVisible, setIsVisible } = useOutsideClick();
	const [name, setName] = useState();
	const [sortIcon, setSortIcon] = useState("arrow-up");

	const handleKeypress = e => {
		if (e.key === "Enter") {
			history.push({
				pathname: pathname,
				search: qs.stringify(
					name
						? {
								q: name
						  }
						: {}
				)
			});
		}
	};

	const clearForm = () => {
		setName("");
		let newQs = {};
		for (const key in params) {
			if (Object.hasOwnProperty.call(params, key)) {
				const element = params[key];
				if (params.lang) {
					if (key !== "lang=uz" && key !== "lang=ru") {
						newQs = { [key]: element };
					}
				} else if (key !== "pageLimit" && key !== "page") {
				} else {
					newQs = {};
				}
			}
		}
		history.push({
			search: qs.stringify(newQs, { encode: false })
		});
	};
	const viewClearBtn = () => {
		if ((Object.keys(params).length === 1 && Object.keys(params).includes("lang")) || Object.keys(params).includes("pageLimit")) {
			return false;
		} else if (Object.keys(params).length === 0) {
			return false;
		} else {
			return true;
		}
	};
	const el = document.createElement("div");

	useEffect(() => {
		const modalRoot = document.getElementById("modal-root");
		if (filter) modalRoot.appendChild(el);
	}, [filter]);

	return (
		<>
			<div>
				<h2 className="intro-y text-lg font-medium mt-5">{t(title)}</h2>
				<div className={`intro-y col-span-12 flex flex-wrap justify-end lg:justify-between sm:flex-nowrap items-center mt-5 `} {...otherProps}>
					<div className="sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
						{textLeft && <>{textLeft ? textLeft : ""}</>}

						{hasSearch && (
							<div className="w-64 relative text-gray-700 dark:text-gray-300">
								<input
									type="text"
									className="w-64 form-control box pr-10 placeholder-theme-8"
									placeholder="Search..."
									onChange={e => setName(e.target.value)}
									onKeyPress={handleKeypress}
									defaultValue={name}
								/>
								<Icon name="search" className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" />
							</div>
						)}
					</div>
					{meta && (
						<div className="hidden lg:block mx-auto text-gray-600">
							Отображение от {from} до {to < total ? to : total} из {total} записей
						</div>
					)}

					{sort.value ? (
						<div>
							<Button.Default
								className="mr-2"
								onClick={() => {
									const values = qs.parse(history.location.search.replace("?", ""));
									const haveSort = values.sort === sort.value;
									setSortIcon(haveSort ? "arrow-up" : "arrow-down");
									history.push({
										...history.location,
										search: qs.stringify({ ...values, sort: haveSort ? `-${sort.value}` : sort.value })
									});
								}}>
								<span className="mr-1">{sort.title}</span>
								<IconComponent name={sortIcon} size={18} />
							</Button.Default>
						</div>
					) : null}

					<div className="flex items-center">
						{filterDay && <>{filterDay}</>}
						{addDay && <>{addDay ? addDay : ""}</>}
						{hasButton && (
							<Button.Default className={`shadow-md ml-4 ${btnClassName}`} onClick={buttonClick}>
								{t(buttonName)}
							</Button.Default>
						)}
						{hasExport && (
							<div className="relative export-table ml-2" ref={ref}>
								<button className="dropdown-toggle btn px-2 box text-gray-700 dark:text-gray-300" onClick={() => setIsVisible(!isVisible)}>
									<span className="w-5 h-5 flex items-center justify-center">
										<Icon name="file-text" className="w-4 h-4" />
									</span>
								</button>
								<Dropdown toggle={isVisible} position="bottom-start">
									{exportUrls.length > 0 &&
										exportUrls.map(item => (
											<a
												href={item.url}
												key={item.id}
												className="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md">
												<Icon name={item.icon} className="w-4 h-4 mr-2" />
												{t(item.title)}
											</a>
										))}
								</Dropdown>
							</div>
						)}
						{hasFilter ? (
							<div className={`ml-2`}>
								{viewClearBtn() && (
									<button className="dropdown-toggle btn px-2 box text-gray-700 dark:text-gray-300 mr-3" onClick={() => clearForm()}>
										<span className="w-5 h-5 flex items-center justify-center">
											<Icon name={"x"} className="w-4 h-4" />
										</span>
									</button>
								)}
								<button className="dropdown-toggle btn px-2 box text-gray-700 dark:text-gray-300" onClick={() => setFilter(!filter)}>
									<span className="w-5 h-5 flex items-center justify-center">
										<Icon name={"filter"} className="w-4 h-4" />
									</span>
								</button>
							</div>
						) : null}
					</div>
				</div>
				{filter &&
					ReactDOM.createPortal(
						<div className={`filter-container`}>
							<div className="filter-container__overlay" onClick={() => setFilter(false)} />
							<div className="filter overflow-y-auto dark:bg-dark-3">
								<Icon name="x-circle" className="close-btn" strokeColor="#fff" onClick={() => setFilter(!filter)} />
								<div className="p-10">{children}</div>
							</div>
						</div>,
						el
					)}
			</div>
		</>
	);
};

export default PageHeaderComponent;
