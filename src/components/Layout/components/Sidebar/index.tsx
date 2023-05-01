import React, { FC, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import logoImage from "assets/images/logo.svg";
import { menu } from "./menu";
import { get } from "lodash";
import Icon from "components/Icon";
import Profile from "components/Profile";
import useOutsideClick from "hooks/useOutsideClick";
import Actions from "store/actions/system";

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

	const toggleSubmenu = (id: string) => {
		if (id === isVisible) {
			setIsVisible(null);
		} else {
			setIsVisible(id);
		}
	};

	useEffect(() => {
		dispatch(Actions.GetRates());
	}, [auth]);

	const admin = menu.filter(m => m.access.includes("admin"));
	const super_admin = menu.filter(m => m.access.includes("super_admin"));
	const moderator = menu.filter(m => m.access.includes("moderator"));
	const bookkeeping = menu.filter(m => m.access.includes("bookkeeping"));
	const redactor = menu.filter(m => m.access.includes("redactor"));

	const getAccess = (role: string) => {
		if (role === "admin") return admin;
		else if (role === "super_admin") return super_admin;
		else if (role === "bookkeeping") return bookkeeping;
		else if (role === "redactor") return redactor;
		else return moderator;
	};

	return (
		<nav className="side-nav">
			<div className="side-nav__header">
				{/* <div className="intro-x dropdown">
					<div className="dropdown-toggle notification notification--bullet cursor-pointer">
						<Icon
							name="bell"
							className="notification__icon w-5 h-5 dark:text-gray-300"
						/>
					</div>
				</div> */}
			</div>

			<ul className="mt-10" ref={ref}>
				{getAccess(get(user, "role", "moderator")).map((m: object, i: number) => {
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
									{get(m, "submenu", []).map((sm: object) => (
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
			<Profile />
		</nav>
	);
};

export default Sidebar;
