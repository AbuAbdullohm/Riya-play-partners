import React from "react";

export default function UserInfo({ title, text, style }) {
	return (
		<div className={`userInfo`} style={style}>
			<h1 className="viewTitle">{title}</h1>
			<div className="viewText">{text}</div>
		</div>
	);
}
