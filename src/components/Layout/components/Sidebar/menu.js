export const menu = [
	{ id: "dashboard", title: "Статистика", link: "/", icon: "home", lang: false, access: ["super_admin"] },
	{
		id: "buggalter",
		title: "Бухгалтерия",
		link: "/buggalter",
		icon: "printer",
		lang: false,
		access: ["bookkeeping", "super_admin"]
	},
	{
		id: "users",
		title: "Пользователи",
		icon: "users",
		access: ["admin", "super_admin"],
		submenu: [
			{ id: "foreingUser", title: "Глобальные", link: "/foreign-user", icon: "user-x", access: ["admin", "moderator", "super_admin"] },

			{ id: "contact", title: "Локальные", link: "/users", icon: "user-x", access: ["admin", "moderator", "super_admin"] }
		]
	},
	{
		id: "spisalice",
		title: "Специалисты",
		icon: "user",
		access: ["admin", "super_admin"],
		submenu: [{ link: "/spisalice", id: "spisalice", lang: false, title: "Специалисты Riya Play", icon: "user", access: ["admin", "super_admin"] }]
	},
	{
		id: "films",
		icon: "film",
		title: "Медиаконтент",
		access: ["admin", "moderator", "super_admin"],
		submenu: [
			{ id: "films", title: "Фильмы", link: "/films", icon: "play-circle", lang: false },
			{ id: "series", title: "Серия (эпизоды)", link: "/series", icon: "tv", lang: false, access: ["admin", "moderator", "super_admin"] },
			{
				id: "review",
				title: "Комментарии",
				link: "/review",
				icon: "message-square",
				lang: false,
				access: ["moderator", "super_admin", "admin", "redactor"]
			}
		]
	},
	{
		id: "stats",
		icon: "film",
		title: "Медиа статистика",
		access: ["admin", "moderator", "super_admin"],
		submenu: [
			{ id: "films", title: "Фильмы", link: "/films/stats", icon: "play-circle", lang: false },
			{ id: "series", title: "Серия (эпизоды)", link: "/series/stats", icon: "tv", lang: false, access: ["admin", "moderator", "super_admin"] }
		]
	},

	{
		id: "ads",
		title: "Реклама",
		icon: "shopping-bag",
		access: ["admin", "super_admin"],
		submenu: [
			{ id: "banners", title: "Баннер", link: "/banners", icon: "image", lang: true, access: ["admin", "super_admin"] },
			{
				id: "reklamaSettings",
				title: "Пакет рекламы",
				link: "/reklamaSettings",
				icon: "shopping-bag",
				lang: false,
				access: ["admin", "super_admin"]
			},
			{
				id: "reklama",
				title: "Рекламные ролики",
				link: "/reklama",
				icon: "youtube",
				lang: false,
				access: ["admin", "super_admin"]
			}
		]
	},
	{ id: "posts", title: "Новости", link: "/posts", icon: "layers", lang: true, access: ["admin", "super_admin", "redactor"] },

	{ id: "notifications", title: "Уведомления", link: "/notifications", icon: "bell", lang: false, access: ["super_admin", "admin"] },
	{
		id: "review",
		title: "Комментарии",
		link: "/review",
		icon: "message-square",
		lang: false,
		access: ["moderator", "super_admin", "admin", "redactor"]
	},
	{
		id: "plans",
		title: "Подписки",
		icon: "hard-drive",
		access: ["super_admin", "bookkeeping"],
		submenu: [
			{ id: "rates", title: "Тариф", link: "/rates", icon: "hard-drive", lang: false, access: ["super_admin", "bookkeeping"] },
			{ id: "promo-code", title: "Промокод", link: "/promo-code", icon: "gift", lang: false, access: ["super_admin"] },
			{ id: "premium-status", title: "Дни премиум-статуса", link: "/rates", icon: "gift", lang: false, access: ["super_admin"] }
		]
	},
	{
		id: "settings-media-content",
		title: "Медиа настройки",
		icon: "settings",
		access: ["admin", "super_admin", "moderator"],
		submenu: [
			{ id: "channel", title: "Телеканалы", link: "/channel", icon: "tv", lang: false, access: ["admin", "super_admin"] },
			{ id: "story-trailer", title: "Трейлер историй", link: "/story-trailer", icon: "play-circle", lang: false, access: ["admin", "super_admin"] },
			{ id: "holder", title: "Правообладатель", link: "/holder", icon: "link", lang: false, access: ["admin", "super_admin"] },
			{ id: "types", title: "Типы медиаконтента", link: "/types", icon: "type", lang: false, access: ["admin"] },
			{ id: "categories", title: "Категории медиаконтента", link: "/categories", icon: "list", lang: false, access: ["admin"] },
			{ id: "genres", title: "Жанры медиаконтента", link: "/genres", icon: "compass", lang: false, access: ["admin", "moderator", "super_admin"] },
			{ id: "tags", title: "Форматы медиаконтента", link: "/tags", icon: "grid", lang: false, access: ["admin"] },
			{ id: "seasons", title: "Сезоны для сериалов", link: "/seasons", icon: "cast", lang: false, access: ["admin"] },
			{ id: "company", title: "Медиа-компании", link: "/company", icon: "menu", lang: false, access: ["admin", "super_admin"] },
			{
				id: "reklamaSettings",
				title: "Пакеты медиаконтента",
				link: "/reklamaSettings",
				icon: "shopping-bag",
				lang: false,
				access: ["admin", "super_admin"]
			},
			{ id: "makers", title: "Режиссеры", link: "/makers", icon: "user-check", lang: false, access: ["admin", "moderator", "super_admin"] },
			{ id: "actors", title: "Актеры", link: "/actors", icon: "users", lang: false, access: ["admin", "moderator", "super_admin"] }
		]
	},

	{
		id: "settings",
		title: "Настройки",
		icon: "settings",
		access: ["admin", "moderator", "super_admin"],
		submenu: [
			{
				id: "payment-methods",
				link: "/payment-methods",
				title: "Способ оплаты",
				icon: "dollar-sign",
				lang: false,
				access: ["super_admin", "bookkeeping"]
			},
			{ id: "version", title: "Версия", link: "/version", icon: "smartphone", lang: false, access: ["super_admin", "bookkeeping"] },
			{ id: "pages", title: "Страницы", link: "/pages", icon: "link", lang: true, access: ["super_admin"] },
			{
				id: "menu",
				title: "Меню",
				link: "/menu",
				icon: "menu",
				access: ["super_admin", "admin"]
			},
			{
				id: "reasonforblocking",
				title: "Причины",
				link: "/reason-for-blocking-user",
				icon: "lock",
				lang: false,
				access: ["admin", "moderator", "super_admin"]
			},
			{ id: "translation", title: "Переводы", link: "/translation", icon: "menu", lang: false, access: ["admin", "super_admin"] },
			{ id: "settings", title: "Настройки", link: "/settings", icon: "file", lang: true, access: ["admin", "super_admin"] },
			{ id: "tasix", title: "TAS-IX", link: "/tas-ix", icon: "globe", lang: false, access: ["admin", "super_admin"] },
			{ id: "banned", title: "Запрещенные устройства", link: "/banned", icon: "lock", lang: false, access: ["admin", "super_admin"] }
		]
	},

	// { id: "advertising", title: "Рекламы", link: "/advertising", icon: "pocket", lang: false, access: ["admin"] },

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
	}
];
