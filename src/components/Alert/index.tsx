import React, { FC, ReactNode, useEffect, useState } from "react";
import cx from "classnames";
import Icon from "../Icon";

interface IAlertProps {
	children: string | ReactNode;
	type?: "primary" | "secondary" | "success" | "warning" | "danger" | "dark";
	toggle: boolean;
	duration: number;
	icon?: string | ReactNode;
	closable?: boolean;
	outlined: boolean;
	softColor?: boolean;
	className?: string;
	[x: string]: any;
}

const AlertComponent: FC<IAlertProps> = ({
	children,
	toggle = false,
	className,
	duration = 3000,
	icon,
	type = "primary",
	outlined = false,
	closable = false,
	softColor = false,
	...otherProps
}): JSX.Element => {
	const [show, setShow] = useState<boolean>(toggle);

	useEffect(() => {
		const toggleAlert = () =>
			setInterval(() => {
				setShow(false);
			}, duration);
		if (toggle) {
			toggleAlert();
		}

		return () => {
			toggleAlert();
		};
	}, []);

	const classNames = cx(
		`alert mt-2 alert-${outlined ? `outline-` : ""}${type}${
			softColor ? "-soft" : ""
		} flex items-center`,
		show ? "show" : "",
		closable ? "alert-dismissible" : "",
		className && className
	);

	return (
		<div className={classNames} {...otherProps}>
			{icon &&
				(typeof icon === "string" ? (
					<Icon name={icon} className="w-6 h-6 mr-2" />
				) : (
					<>{icon}</>
				))}
			<>{children}</>
			{closable && (
				<button className="btn-close" onClick={() => setShow(false)}>
					<Icon name="x" className="w-4 h-4"></Icon>
				</button>
			)}
		</div>
	);
};

export default AlertComponent;
