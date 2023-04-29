import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { get, truncate } from "lodash";
import { Icon, Typography } from "../";
import { helpers } from "services";
import useOutsideClick from "../../hooks/useOutsideClick";
import "./style.scss";
import DefaultPhoto from "assets/images/user.svg";

interface ILinkProps {
	id: number;
	url: string;
	title: string;
	icon?: string;
	className?: string;
}

const className: string = "flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 dark:hover:bg-dark-3 rounded-md";

const links = [
	{
		id: 1,
		url: "/profile",
		title: "Профиль",
		icon: "user",
		className: className
	}
	// {
	// 	id: 2,
	// 	url: "/add-account",
	// 	title: "Добавить аккаунт",
	// 	icon: "edit",
	// 	className: className
	// },
	// {
	// 	id: 3,
	// 	url: "/profile/password",
	// 	title: "Сброс пароля",
	// 	icon: "lock",
	// 	className: className
	// },
	// {
	// 	id: 4,
	// 	url: "/help",
	// 	title: "Помощь",
	// 	icon: "help-circle",
	// 	className: className
	// }
];

const ProfileComponent: FC<{}> = (): JSX.Element => {
	const { t } = useTranslation();
	const { ref, isVisible, setIsVisible } = useOutsideClick();
	const profile = useSelector((state: any) => state.auth.data);
	const photo = get(profile, "image.thumbnails.normal.src");

	return (
		<div className="side-nav__footer">
			<Typography.Link url="/logout" className="intro-x">
				<div className="logout font-bold">
					<Icon name="log-out" className="w-6 h-6 mr-2 mb-1" />
					<div className="logout__title">{t("Выход")}</div>
				</div>
			</Typography.Link>
			<div className="profile-component intro-x dropdown w-8 h-8 cursor-pointer" ref={ref}>
				<div className="profile-component__header" onClick={() => setIsVisible(!isVisible)}>
					<div className="dropdown-toggle w-8 h-8 rounded-full overflow-hidden shadow-lg image-fit zoom-in scale-110">
						<img alt="" src={get(profile, "photo") ? photo : DefaultPhoto} />
					</div>
					<div className="user border-theme-12 dark:border-dark-3">
						<div className="font-medium">{truncate(get(profile, "username"), { length: 22 })}</div>
						<div className="text-xs text-theme-13 dark:text-gray-600">
							{truncate(get(profile, "role") ? get(profile, "role") : get(profile, "username"), { length: 22 })}
						</div>
					</div>
				</div>
				<div className={`dropdown-menu${isVisible ? " show" : ""} w-54`}>
					<div className="dropdown-menu__content box bg-theme-11 dark:bg-dark-6 text-white">
						<div className="p-2">
							{links.map(link => (
								<Typography.Link key={link.id} url={link.url} className={link.className}>
									<Icon name={link.icon} className="w-4 h-4 mr-2 mb-1" />
									{t(link.title)}
								</Typography.Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileComponent;
