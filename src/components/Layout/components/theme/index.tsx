import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import SystemActions from "store/actions/system";
import config from "config";
import { storage } from "services";

const ThemeComponent = () => {
	const dispatch = useDispatch();
	const theme = useSelector((state: any) => state.system.theme);
	const { t } = useTranslation();
	const darkTheme = config.THEMES[1].theme;
	const lightTheme = config.THEMES[0].theme;

	const changeTheme = () => {
		if (theme === config.DEFAULT_THEME) {
			dispatch(SystemActions.ChangeTheme(darkTheme));
			storage.set("theme", darkTheme);
			document.documentElement.className = darkTheme;
		} else {
			document.documentElement.className = lightTheme;
			storage.set("theme", lightTheme);
			dispatch(SystemActions.ChangeTheme(lightTheme));
		}
	};

	return (
		<div className="dark-mode-switcher cursor-pointer dark:bg-dark-2 w_full h-12 flex items-center mb-2 p-3" onClick={changeTheme}>
			<div className="mr-auto text-gray-700 dark:text-gray-300">{t("Dark Mode")}</div>
			<div className={`dark-mode-switcher__toggle border ${storage.get("theme") === "dark" ? "dark-mode-switcher__toggle--active" : ""}`}></div>
		</div>
	);
};

export default ThemeComponent;
