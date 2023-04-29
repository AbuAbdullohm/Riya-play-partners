import { get, round } from "lodash";
import moment from "moment";

const formatBytes = (bytes, decimals = 2) => {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const formatDate = (date, format) => {
	let dt = new Date(date);
	let month = ("00" + (dt.getMonth() + 1)).slice(-2);
	let day = ("00" + dt.getDate()).slice(-2);
	let year = dt.getFullYear();
	let hours = ("00" + dt.getHours()).slice(-2);
	let minutes = ("00" + dt.getMinutes()).slice(-2);
	let seconds = ("00" + dt.getSeconds()).slice(-2);

	switch (format) {
		case "DD-MM-YYYY":
			return day + "-" + month + "-" + year;
		case "DD.MM.YYYY / HH:mm:ss":
			return day + "." + month + "." + year + " / " + hours + ":" + minutes + ":" + seconds;
		case "MM-YYYY":
			return month + "." + year;

		default:
			return day + "." + month + "." + year;
	}
};

const isEnableLang = lang => {
	switch (lang) {
		case "ru":
			return true;
		case "uz":
			return true;
		default:
			return false;
	}
};

const stringToCode = element => {
	const content = element.textContent;

	function toNode(iframeString) {
		const div = document.createElement("div");
		div.innerHTML = iframeString;
		return div;
	}
	const parent = element.parentNode;
	const childOembed = parent.querySelector("code");
	childOembed.replaceWith(toNode(content));
};

const companyTypes = [
	{ name: "Производитель", value: 1 },
	{ name: "Партнеры", value: 2 }
];

const getCompanyType = type => {
	switch (type) {
		case 1:
			return "Производитель";
		case 2:
			return "Партнеры";
		default:
			return "";
	}
};
const getUserRoleLabel = role => {
	switch (role) {
		case "admin":
			return "Админ";
		case "moderator":
			return "Модератор";
		case "super_admin":
			return "Cупер администратор";
		case "bookkeeping":
			return "Бухгалтер";
		case "redactor":
			return "Редактор";
		default:
			return "-";
	}
};

const userRoles = [
	{ value: "admin", label: "Админ", num: 0 },
	{ value: "moderator", label: "Модератор", num: 1 },
	{ value: "super_admin", label: "Cупер администратор", num: 2 },
	{ value: "bookkeeping", label: "Бухгалтер", num: 3 },
	{ value: "redactor", label: "Редактор", num: 4 }
];

const adminRoles = [
	{ value: "redactor", label: "Редактор" },
	{ value: "moderator", label: "Модератор" }
];

const momentUtf = (date, format) => {
	switch (format) {
		case "DD.MM.YYYY":
			return moment.unix(date).format("DD.MM.YYYY");
		case "DD.MM.YYYY / HH:mm:ss":
			return moment
				.unix(date)
				.utcOffset(0)
				.format("DD.MM.YYYY / HH:mm:ss");
		case "MM.YYYY":
			return moment.unix(date).format("DD/MM/YYYY");

		default:
			return date;
	}
};

const dashboardCostumizeData = (data, setAllSumm, setRatesSum) => {
	const allSummLocale = get(data, "incomes").reduce((total, count) => (total += Number(count.amount)), 0);
	setAllSumm(allSummLocale);
	const summaExpenses = get(data, "expenses").reduce((total, count) => (total += Number(count.amount)), 0);
	setRatesSum(summaExpenses);
	const procentsExpenses = get(data, "expenses").map(item => round((Number(item.amount) / summaExpenses) * 100, 1) + "%");
	const color = ["blue", "pie", "orange", "green", "brown", "lightInfo", "blue2", "darkbluedark", "violet", "greenWhite", "orangeWhite"];
	let newExpenses = data.expenses.map((item, idx) => {
		return {
			...item,
			procent: procentsExpenses[idx],
			color: color[idx]
		};
	});

	const summaIncomes = get(data, "incomes").reduce((total, count) => (total += Number(count.amount)), 0);
	const procentsIncomes = get(data, "incomes").map(item => round((Number(item.amount) / summaIncomes) * 100, 1) + "%");
	const colorIncomes = { apelsin: "#F25F2E", payme: "#33CCCC", paynet: "#00B427", click: "#3F8CFF", cash: "#333", apelsin_frame: "#83190b" };
	let newIncomes = data.incomes.map((item, idx) => {
		return {
			...item,
			procent: procentsIncomes[idx],
			colorIncomes: colorIncomes[item.payment_method]
		};
	});

	return { newExpenses, newIncomes };
};

var invalidChars = ["-", "+", "e", ".", ","];
const onKeyDownInvalidChars = e => {
	if (invalidChars.includes(e.key)) {
		e.preventDefault();
	}
};

export default {
	formatDate,
	stringToCode,
	isEnableLang,
	formatBytes,
	companyTypes,
	getCompanyType,
	getUserRoleLabel,
	userRoles,
	adminRoles,
	momentUtf,
	dashboardCostumizeData,
	onKeyDownInvalidChars
};
