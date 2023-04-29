import React, { FC, ReactNode, useState, useEffect } from "react";
import cx from "classnames";
import { createPortal } from "react-dom";
import Icon from "../Icon";
import { usePortal } from "hooks";

interface INotificationProps {
	children: string | ReactNode;
	icon?: string | ReactNode;
	toggle: boolean;
	duration?: number;
	className?: string;
	setToggle: Function;
	[x: string]: any;
}

const NotificationComponent: FC<INotificationProps> = ({
	icon,
	children,
	toggle = false,
	className,
	duration = 3000,
	setToggle,
	...otherProps
}): JSX.Element => {
	const target = document.body;

	useEffect(() => {
		if (toggle) {
			setInterval(() => {
				setToggle(false);
			}, duration);
		}

		return () => {
			setInterval(() => {
				setToggle(false);
			}, duration);
		};
	}, []);

	const classNames = cx(
		"toastify-content flex",
		toggle ? "" : "hidden",
		className && className
	);

	const NotificationWrapper = () => (
		<div
			className={`toastify${
				toggle ? " on" : ""
			} toastify-right toastify-top`}>
			<div className="text-center">
				<div className={classNames} {...otherProps}>
					{icon &&
						(typeof icon === "string" ? (
							<Icon name={icon} className="w-6 h-6 mr-2" />
						) : (
							<>{icon}</>
						))}
					<div className="ml-4 mr-4">{children}</div>
				</div>
				<span
					className="toast-close"
					onClick={() => setToggle(false)}
				/>
			</div>
		</div>
	);

	return createPortal(<NotificationWrapper />, target);
};

export default NotificationComponent;
