interface INotificationProps {
	type: string;
	delay?: number;
	title?: string;
}

export function useNotification() {
	function gen4() {
		return Math.random()
			.toString(16)
			.slice(-4);
	}

	function simpleUniqueId(prefix: any) {
		return (prefix || "").concat([gen4(), gen4()].join(""));
	}

	function getClassName(type: string) {
		switch (type) {
			case "success":
				return "alert-item alert-item--success";
			case "info":
				return "alert-item alert-item--info";
			case "warning":
				return "alert-item alert-item--warning";
			case "danger":
				return "alert-item alert-item--danger";
			default:
				return "alert-item alert-item--info";
		}
	}

	function getDefaultTitle(type: string) {
		switch (type) {
			case "success":
				return "Успешно";
			case "info":
				return "Информация";
			case "warning":
				return "Предупреждение";
			case "danger":
				return "Ошикба";
			default:
				return "Информация";
		}
	}

	function getDefaultText(type: string) {
		switch (type) {
			case "success":
				return "Успешно выполнено";
			case "info":
				return "Информация";
			case "warning":
				return "Что-то пошла не так";
			case "danger":
				return "Что-то пошла не так";
			default:
				return "Информация";
		}
	};

	let zone = document.getElementById("custom-alert-zone") as HTMLDivElement;
	zone.id = "custom-alert-zone"

	const notification = (text: string, props: INotificationProps) => {

		let { type = "info", delay, title } = props;

		let defaultText = getDefaultText(type);
		let defaultTitle = getDefaultTitle(type);

		let uniqId = simpleUniqueId("alert-");

		let alertItem = document.createElement("div");
		alertItem.id = uniqId;
		alertItem.className = getClassName(type);

		alertItem.innerHTML = `<div class="alert-item__close-btn"></div>
			<div class="alert-item__title">${title ? title : defaultTitle}</div>
			<div class="alert-item__text">${text ? text : defaultText}</div>`;

		zone.appendChild(alertItem);

		// let currElem = document.getElementById(uniqId) as HTMLDivElement;

		const addShowClass = () => {
			alertItem.classList.add("--show");
		};

		const removeElement = () => {
			alertItem.classList.remove("--show");

			setTimeout(() => {
				alertItem.remove();
			}, 500);
		};

		setTimeout(() => {
			addShowClass();
		}, 100);

		setTimeout(
			() => {
				removeElement();
			},
			delay ? delay : 3000
		);

		alertItem
			.querySelector(".alert-item__close-btn")!
			.addEventListener("click", () => {
				removeElement();
			});
	};

	return { notification };
}
