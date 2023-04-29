import React, { FC, ReactNode } from "react";
import cx from "classnames";

interface IOutlineButtonProps {
    title: string;
    buttonType?: "reset" | "button" | "submit";
    type?: "primary" | "secondary" | "success" | "warning" | "danger" | "dark";
    size?: "sm" | "md" | "lg";
    rounded?: boolean,
    className?: string;
    children: string | ReactNode;
    tooltip?: string,

    [x: string]: any;
}

const OutlineButtonComponent: FC<IOutlineButtonProps> = ({
    title = "",
    buttonType = "button",
    type = "primary",
    size = "md",
    className = "",
    rounded = false,
    children,
    tooltip,
    ...otherProps
}): JSX.Element => {

    const classNames = cx(
        "btn mr-2",
        rounded && ` btn-rounded btn-${type}-soft`,
        size === "md" ? "" : `btn-${size}`,
        type && `btn-outline-${type}`,
        className && className
    );

    return (
        <button type={buttonType} className={classNames} {...otherProps} title={tooltip}>
            {title && <>{title}</>} {children && <>{children}</>}
        </button>
    );
};

export default OutlineButtonComponent;
