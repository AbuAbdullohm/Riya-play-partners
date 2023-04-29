import React from "react";

export default function UserInfo({ title, text, className, style }) {
	return (
		<div className={`userInfo ${className}`} style={style}>
			<h1 className="viewTitle">{title}</h1>
			<div className={`viewText`}>{text}</div>
		</div>
	);
}
