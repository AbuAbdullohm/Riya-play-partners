const externalTypes = [
	{ label: "Кинопоиск", value: 1 },
	{ label: "Riya Play", value: 2 }
];

const channelTypes = [
	{ label: "Новости", value: 1 },
	{
		label: "Фильм",
		value: 2
	}
];

const DEVICE_ACTIVE = 10;
const DEVICE_INACTIVE = 9;
const DEVICE_DELETED = 0;

const deviceStatus = [
	{
		label: "Активный",
		value: DEVICE_ACTIVE
	},
	{
		label: "Неактивный",
		value: DEVICE_INACTIVE
	},
	{
		label: "Удалено",
		value: DEVICE_DELETED
	}
];

const deviceTypes = [
	{
		label: "Web",
		value: "web"
	},
	{
		label: "TV",
		value: "tv"
	},
	{
		label: "Mobile",
		value: "mobile"
	}
];

const notificationTypes = [
	{
		label: "Новости",
		value: 1
	},
	{
		label: "Фильмы",
		value: 2
	},
	{
		label: "Уведомление",
		value: 3
	},
	{
		label: "По тарифу",
		value: 4
	}
];

const constants = {
	notificationTypes,
	deviceTypes,
	externalTypes,
	channelTypes,
	deviceStatus
};

export default constants;
