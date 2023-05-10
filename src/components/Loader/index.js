import React from "react";
import { ThreeDots } from "react-loader-spinner";

import "./style.scss";

export default function Loader({ color = "#071a50", isFull = false }) {
	return (
		<div className={`loader ${isFull ? "full" : ""}`}>
			<ThreeDots color={color} height={80} width={80} />
		</div>
	);
}
