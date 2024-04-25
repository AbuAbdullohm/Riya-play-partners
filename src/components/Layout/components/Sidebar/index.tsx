import React, { FC, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { menu } from "./menu";
import { get } from "lodash";
import Icon from "components/Icon";

import useOutsideClick from "hooks/useOutsideClick";
import Actions from "store/actions/system";
import { Loader } from "components";

interface ISubmenu {
	id: string;
	title: string;
	link: string;
	icon?: string;
}

interface IMenu {
	id: string;
	title: string;
	link?: string;
	icon?: string;
	submenu?: ISubmenu[];
}

export interface ISideBar {
	menu: IMenu[];
}

const Sidebar: FC<ISideBar> = (props): JSX.Element => {
	// const langCode = useSelector(state => get(state, "system.currentLangCode", "ru"));
	const user = useSelector(state => get(state, "auth.data"));
	const auth = useSelector(state => get(state, "auth.isFetched"));

	const { t } = useTranslation();
	const { pathname } = useLocation();
	const currPath = pathname.split("/")[1];
	const { isVisible, setIsVisible, ref } = useOutsideClick();
	const dispatch = useDispatch();

	const toggleSubmenu = (id: any) => {
		if (id === isVisible) {
			setIsVisible(null);
		} else {
			setIsVisible(id);
		}
	};

	useEffect(() => {
		dispatch(Actions.GetRates());
	}, [auth]);

	const admin = (menu: any) => menu.filter((m: any) => m.access.includes("admin"));
	const super_admin = (menu: any) => menu.filter((m: any) => m.access.includes("super_admin"));
	const moderator = (menu: any) => menu.filter((m: any) => m.access.includes("moderator"));
	const bookkeeping = (menu: any) => menu.filter((m: any) => m.access.includes("bookkeeping"));
	const redactor = (menu: any) => menu.filter((m: any) => m.access.includes("redactor"));

	const getAccess = (role: string, menu: any) => {
		if (role === "admin") return admin(menu);
		else if (role === "super_admin") return super_admin(menu);
		else if (role === "bookkeeping") return bookkeeping(menu);
		else if (role === "redactor") return redactor(menu);
		else if (role === "moderator") return moderator(menu);
		else return [];
	};

	return (
		<nav className="side-nav primary opened">
			{/* <div className="side-nav__header">
				<div className="intro-x dropdown">
					<div className="dropdown-toggle notification notification--bullet cursor-pointer">
						<Icon name="bell" className="notification__icon w-5 h-5 dark:text-gray-300" />
					</div>
				</div>
			</div> */}

			{user && Object.keys(user).length === 0 ? (
				<Loader color="#fff" />
			) : (
				<ul className="mt-10 list" ref={ref}>
					{getAccess(get(user, "role", ""), menu).map((m: any, i: number) => {
						if (get(m, "submenu")) {
							return (
								<li key={get(m, "id")}>
									<div
										className={`side-menu cursor-pointer${"/" + currPath === get(m, "link") ? " side-menu--active" : ""}`}
										onClick={() => toggleSubmenu(get(m, "id"))}>
										<div className="side-menu__icon">
											<Icon name={get(m, "icon")} />
										</div>
										<div className="side-menu__title">
											{t(get(m, "title"))}
											<div className={`side-menu__sub-icon${isVisible === get(m, "id") ? " transform rotate-180" : ""}`}>
												<Icon name="chevron-down" />
											</div>
										</div>
									</div>
									<ul className={isVisible === get(m, "id") ? "side-menu__sub-open" : ""}>
										{getAccess(get(user, "role", ""), get(m, "submenu", [])).map((sm: any) => (
											<li key={get(sm, "id")}>
												<NavLink
													key={get(sm, "id")}
													to={`${get(sm, "link")}${get(sm, "lang") ? `?lang=ru` : ""}`}
													className={`side-menu ${pathname === get(sm, "link") ? "side-menu--active" : ""}`}>
													<div className="side-menu__icon mr-2">
														<Icon name={get(sm, "icon")} />
													</div>

													<div className="side-menu__title">{t(get(sm, "title"))}</div>
												</NavLink>
											</li>
										))}
									</ul>
								</li>
							);
						} else
							return (
								<li key={get(m, "id")}>
									<NavLink
										to={`${get(m, "link")}${get(m, "lang") ? `?lang=ru` : ""}` || "/films"}
										className={`side-menu ${"/" + currPath === get(m, "link") ? "side-menu--active" : ""}`}>
										<div className="side-menu__icon">
											<Icon name={get(m, "icon")} />
										</div>
										<div className="side-menu__title">{t(get(m, "title"))}</div>
									</NavLink>
								</li>
							);
					})}
				</ul>
			)}
		</nav>
	);
};

export default Sidebar;
