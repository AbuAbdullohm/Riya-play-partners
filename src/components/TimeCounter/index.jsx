import React, { useState } from "react";
import Timer from "react-timer-wrapper";
import Timecode from "react-timecode";

import "./style.scss";
import Modal from "components/Modal";
import Button from "components/Button";
import { Icon } from "components";

function TimeCounter() {
	const [modal, setModal] = useState(false);
	const [active, setActive] = useState(false);

	function handleModal() {
		setModal(!modal);
	}

	function handleTime() {
		if (!active) handleModal();
		setActive(!active);
	}

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
						active={active}
						onStart={e => {
							console.log("started");
							console.log(e);
						}}
						onStop={e => {
							console.log("stopped");
							console.log(e);
						}}>
						<Timecode format={"HH:mm:ss"} />
					</Timer>
					<Button.Default type="primary" onClick={handleTime}>
						{active ? "PAUSE" : "START"}
						<Icon name={active ? "pause" : "play"} />
					</Button.Default>
				</div>
			</Modal.Default>

			<div className="time-counter" onClick={handleModal}>
				<Timer
					active={active}
					onStart={e => {
						console.log("started");
						console.log(e);
					}}
					onStop={e => {
						console.log("stopped");
						console.log(e);
					}}>
					<Timecode format={"HH:mm:ss"} />
				</Timer>
			</div>
		</>
	);
}

export default TimeCounter;
