export const menu = [
	{ id: "dashboard", title: "Dashboard", link: "/", icon: "home", lang: false, access: ["super_admin"] },
	{
		id: "films",
		icon: "film",
		title: "Фильм",
		access: ["admin", "moderator", "super_admin"],
		submenu: [
			{ id: "films", title: "Фильмы", link: "/films", icon: "play-circle", lang: false },
			{ id: "types", title: "Типы", link: "/types", icon: "type", lang: false, access: ["admin"] },
			{ id: "categories", title: "Категории", link: "/categories", icon: "list", lang: false, access: ["admin"] },
			{ id: "seasons", title: "Сезоны", link: "/seasons", icon: "cast", lang: false, access: ["admin"] },
			{ id: "genres", title: "Жанры", link: "/genres", icon: "compass", lang: false, access: ["admin", "moderator", "super_admin"] },
			{ id: "tags", title: "Форматы", link: "/tags", icon: "grid", lang: false, access: ["admin"] },
			{ id: "makers", title: "Режиссеры", link: "/makers", icon: "user-check", lang: false, access: ["admin", "moderator", "super_admin"] },
			{ id: "actors", title: "Актеры", link: "/actors", icon: "users", lang: false, access: ["admin", "moderator", "super_admin"] }
		]
	},
	{ id: "series", title: "Серии", link: "/series", icon: "tv", lang: false, access: ["admin", "moderator", "super_admin"] },
	{ id: "review", title: "Отзывы", link: "/review", icon: "message-square", lang: false, access: ["moderator", "super_admin", "admin", "redactor"] },
	{
		id: "users",
		title: "Пользователи",
		icon: "users",
		access: ["admin", "super_admin"],
		submenu: [
			{ id: "spisalice", title: "Специалист", link: "/spisalice", icon: "user", access: ["admin", "super_admin"] },
			{ id: "foreingUser", title: "Иностранный пользователь", link: "/foreign-user", icon: "user-x", access: ["admin", "moderator", "super_admin"] },

			{ id: "contact", title: "Пользователи", link: "/users", icon: "user-x", access: ["admin", "moderator", "super_admin"] }
		]
	},

	{ id: "rates", title: "Тариф", link: "/rates", icon: "hard-drive", lang: false, access: ["super_admin", "bookkeeping"] },
	{ id: "version", title: "Версия", link: "/version", icon: "smartphone", lang: false, access: ["super_admin", "bookkeeping"] },
	{ id: "promo-code", title: "Промокод", link: "/promo-code", icon: "gift", lang: false, access: ["super_admin"] },
	{
		id: "buggalter",
		title: "Бухгалтерия",
		link: "/buggalter",
		icon: "printer",
		lang: false,
		access: ["bookkeeping", "super_admin"]
	},
	{ id: "banners", title: "Баннер", link: "/banners", icon: "image", lang: true, access: ["admin", "super_admin"] },
	{
		id: "reklama",
		title: "Реклама",
		link: "/reklama",
		icon: "youtube",
		lang: false,
		access: ["admin", "super_admin"]
	},
	{
		id: "reklamaSettings",
		title: "Пакет рекламы",
		link: "/reklamaSettings",
		icon: "shopping-bag",
		lang: false,
		access: ["admin", "super_admin"]
	},

	{ id: "posts", title: "Новости", link: "/posts", icon: "layers", lang: true, access: ["admin", "super_admin", "redactor"] },
	// { id: "advertising", title: "Рекламы", link: "/advertising", icon: "pocket", lang: false, access: ["admin"] },
	{ id: "pages", title: "Страницы", link: "/pages", icon: "link", lang: true, access: ["super_admin"] },
	{ id: "notifications", title: "Уведомление", link: "/notifications", icon: "bell", lang: false, access: ["super_admin", "admin"] },

	{
		id: "logs",
		title: "Логи",
		link: "/logs",
		icon: "shield",
		lang: false,
		access: ["super_admin"]
	},

	{
		id: "users-contact",
		title: "Пользователи",
		link: "/users",
		icon: "users",
		access: ["moderator"]
	},

	{
		id: "settings",
		title: "Настройки",
		icon: "settings",
		access: ["admin", "moderator", "super_admin"],
		submenu: [
			{
				id: "menu",
				title: "Меню",
				link: "/menu",
				icon: "menu",
				access: ["super_admin", "admin"]
			},
			{ id: "settings", title: "Настройки", link: "/settings", icon: "file", lang: true },
			{
				id: "reasonforblocking",
				title: "Причины блокировка",
				link: "/reason-for-blocking-user",
				icon: "lock",
				lang: false,
				access: ["admin", "moderator", "super_admin"]
			},
			{ id: "translation", title: "Переводы", link: "/translation", icon: "menu", lang: false },
			{ id: "tasix", title: "TAS-IX", link: "/tas-ix", icon: "globe", lang: false, access: ["admin", "super_admin"] },
			{ id: "company", title: "Компании", link: "/company", icon: "menu", lang: false, access: ["admin", "super_admin"] },
			{ id: "banned", title: "Запрещенные устройства", link: "/banned", icon: "lock", lang: false, access: ["admin", "super_admin"] }
		]
	}
];
