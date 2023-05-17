import React, { useEffect, useState } from "react";

import Timer from "react-timer-wrapper";
import Timecode from "react-timecode";

import Modal from "components/Modal";
import Button from "components/Button";
import { Icon } from "components";
import { storage } from "services";
import { ReactComponent as ReloadIcon } from "assets/images/icons/reload.svg";

import "./style.scss";

function TimeCounter() {
	const workTime = JSON.parse(storage.get("workTime"));
	const oneDay = 24 * 60 * 60 * 1000;

	const [active, setActive] = useState(workTime ? workTime.active : false);
	const [modal, setModal] = useState(workTime ? (workTime.time >= oneDay ? true : !workTime.active) : true);

	function handleModal() {
		setModal(!modal);
	}

	function handleTime() {
		if (!active) handleModal();
		setActive(!active);
	}

	function refreshTime() {
		setModal(false);
		setActive(true);
		storage.set("workTime", JSON.stringify({ active: true, time: 0 }));
	}

	function updateTime() {
		const timeEl = document.querySelector(".time-counter span").innerHTML;
		const [hour, minut, second] = timeEl.split(":");

		const hourToMmSecond = hour * 60 * 60 * 1000;
		const minutToMmSecond = minut * 60 * 1000;
		const secondToMmSecond = second * 1000;

		const mmSecond = hourToMmSecond + minutToMmSecond + secondToMmSecond;

		if (mmSecond >= oneDay) {
			setModal(true);
			setActive(false);
			storage.set("workTime", JSON.stringify({ active: false, time: mmSecond }));
		} else storage.set("workTime", JSON.stringify({ active: true, time: mmSecond }));
	}

	useEffect(() => {
		const timer = setInterval(updateTime, 5000);

		return () => {
			clearTimeout(timer);
		};
	}, []);

	if (!workTime) return "";

	return (
		<>
			<Modal.Default
				className="time-modal"
				toggle={modal}
				setToggle={() => {
					if (active) handleModal();
				}}>
				<div className="time-counter">
					<Timer
						duration={oneDay}
						active={active}
						time={workTime.time}
						onStart={({ time }) => storage.set("workTime", JSON.stringify({ active: true, time }))}
						onStop={({ time }) => storage.set("workTime", JSON.stringify({ active: false, time }))}>
						<Timecode format={"HH:mm:ss"} />
					</Timer>

					{oneDay <= workTime.time ? (
						<Button.Default className="reload" onClick={refreshTime}>
							<ReloadIcon />
						</Button.Default>
					) : (
						<Button.Default type="primary" onClick={handleTime}>
							{active ? "PAUSE" : "START"}
							<Icon name={active ? "pause" : "play"} />
						</Button.Default>
					)}
				</div>
			</Modal.Default>

			<div className="time-counter" onClick={handleModal}>
				<Timer
					duration={oneDay}
					active={active}
					time={workTime.time}
					onStart={({ time }) => storage.set("workTime", JSON.stringify({ active: true, time }))}
					onStop={({ time }) => storage.set("workTime", JSON.stringify({ active: false, time }))}>
					<Timecode format={"HH:mm:ss"} />
				</Timer>
			</div>
		</>
	);
}

export default TimeCounter;
