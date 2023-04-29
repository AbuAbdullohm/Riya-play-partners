import React, { FC, ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import cx from "classnames";
import Icon from "components/Icon";
import "../style.scss";

interface IModalDefaultProps {
	size?: "sm" | "md" | "lg" | "xl";
	toggle: boolean;
	className?: string;
	okText: string | ReactNode;
	cancelText: string;
	alignBtns: "left" | "right" | "center";
	alignExitBtn: "left" | "right";
	exitBtn?: boolean;
	backdrop?: boolean;
	header?: string | ReactNode;
	children: string | ReactNode;
	footer?: string | ReactNode;
	onOk: () => any;
	setToggle: Function;
	[x: string]: any;
}

const ModalDefaultComponent: FC<IModalDefaultProps> = ({
	size = "md",
	toggle,
	className,
	okText = null,
	cancelText = null,
	exitBtn = false,
	backdrop = true,
	alignBtns = "right",
	alignExitBtn = "right",
	header,
	footer,
	onOk,
	setToggle,
	children,
	...otherProps
}): JSX.Element => {
	const { t } = useTranslation();

	useEffect(() => {
		document.body.className = `main ${
			toggle ? "overflow-y-hidden" : ""
		}`;
	}, [toggle]);

	const classNames = cx(
		`modal ${!backdrop ? "modal-static" : ""}`,
		toggle ? "show" : "",
		className && className
	);

	const content = <div className={classNames} {...otherProps}>
		<div
			className="modal-overlap"
			onClick={()=> {
				if(backdrop){
					setToggle(false)
				}else {

				}
			}}
		/>
		<div
			className={`modal-dialog ${
				size === "md" ? "" : `modal-${size}`
			}`}>
			<div className="modal-content">
				{(header || exitBtn) && (
					<div
						className="modal-header"
						style={{ display: `${header ? "flex" : "block"}` }}>
						{typeof header === "string" ? (
							<h2 className="font-medium text-base mr-auto">
								{header}
							</h2>
						) : (
							<div className="mr-auto">{header}</div>
						)}
						{exitBtn && (
							<div className={`text-${alignExitBtn}`}>
								<Icon
									name="x"
									className="w-6 h-6 text-gray-500"
									onClick={() => setToggle(false)}
								/>
							</div>
						)}
					</div>
				)}
				<div className="modal-body">{children}</div>
				{(footer || okText || cancelText) && (
					<div className="modal-footer">
						{footer ? (
							<>{footer}</>
						) : (
							<div className={`text-${alignBtns}`}>
								{cancelText && (
									<button
										type="button"
										className="btn btn-outline-secondary w-24 dark:border-dark-5 dark:text-gray-300 mr-3"
										onClick={() => setToggle(false)}>
										{t(cancelText)}
									</button>
								)}
								{okText && (
									<button
										type="button"
										className={`btn w-24 btn-primary`}
										onClick={onOk}>
										{t(okText)}
									</button>
								)}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	</div>
	const modalsContainer = document.getElementById("modals-container") as HTMLFormElement

	return ReactDOM.createPortal(
		content,
		modalsContainer
	);
};

export default ModalDefaultComponent;
