import React, { FC, ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import cx from "classnames";
import Icon from "../../Icon";
import "../style.scss";
import { Button } from "../../index";
import ReactDOM from "react-dom";

interface IModalConfirmProps {
	type: "delete" | "success" | "warning";
	title?: string | ReactNode;
	toggle: boolean;
	className?: string;
	okText: string | ReactNode;
	cancelText: string;
	exitBtn?: boolean;
	closable?: boolean;
	isSubmitting?: boolean;
	onOk: () => any;
	setToggle: Function;
}

// monition

const getConfirmType = (type: string, t: any, title: string | ReactNode) => {
	switch (type) {
		case "success":
			return (
				<div className="p-5 text-center">
					<Icon name="check-circle" className="w-16 h-16 text-theme-10 mx-auto mt-3" />
					<div className="text-gray-600 mt-2">{title && title}</div>
				</div>
			);
		case "monition":
			return (
				<div className="p-5 text-center">
					<div className="my-5">
						<span className="monition_modal">!</span>
					</div>
					<div className="text-gray-600 mt-2">{title && title}</div>
					<div>{t("Этот процесс нельзя отменить")}</div>
				</div>
			);
		case "warning":
			return (
				<div className="p-5 text-center">
					<Icon name="x-circle" className="w-16 h-16 text-theme-23 mx-auto mt-3" />
					{/*<div className="text-3xl mt-5">{t("Oops")}...</div>*/}
					<div className="text-gray-600 mt-2">{title && title}</div>
				</div>
			);
		case "delete":
		default:
			return (
				<div className="p-5 text-center">
					<Icon name="x-circle" className="w-16 h-16 text-theme-24 mx-auto mt-3" />
					<div className="text-gray-600 mt-2">
						<div>{title && title}</div>
						<div>{t("Этот процесс нельзя отменить")}</div>
					</div>
				</div>
			);
	}
};

const ModalConfirmComponent: FC<IModalConfirmProps> = ({
	type = "delete",
	toggle,
	className,
	okText = null,
	cancelText = null,
	closable = true,
	exitBtn = false,
	isSubmitting = false,
	title,
	onOk,
	setToggle
}) => {
	const { t } = useTranslation();
	useEffect(() => {
		document.body.className = `main ${toggle ? "overflow-y-hidden" : ""}`;
	}, [toggle]);

	const classNames = cx(`modal`, toggle ? "show" : "", className && className);

	const content = (
		<div className={classNames}>
			<div className="modal-overlap" onClick={() => (closable ? setToggle(false) : () => {})} />
			<div className="modal-dialog">
				<div className="modal-content">
					{exitBtn && <Icon name="x" class="w-8 h-8 text-gray-500" onClick={() => setToggle(false)} />}
					<div className="modal-body p-0">
						{getConfirmType(type, t, title)}
						<div className="px-5 pb-8 text-center">
							{cancelText && (
								<button
									type="button"
									className="btn btn-outline-secondary w-24 dark:border-dark-5 dark:text-gray-300 mr-1"
									onClick={() => setToggle(false)}>
									{t(cancelText)}
								</button>
							)}
							{okText && (
								<Button.Default
									loading={isSubmitting}
									onClick={onOk}
									type="primary"
									buttonType="button"
									className={`btn w-24 btn-${type === "delete" ? "danger" : type === "success" ? "primary" : "warning"}`}>
									{t(okText)}
								</Button.Default>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
	const modalsContainer = document.getElementById("modals-container") as HTMLFormElement;

	return ReactDOM.createPortal(content, modalsContainer);
};

export default ModalConfirmComponent;
