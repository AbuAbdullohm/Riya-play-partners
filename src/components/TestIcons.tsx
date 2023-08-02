import React from "react";
import { icons } from "components/Icon/icons";
import { Icon } from "components";

export default function TestIcons() {
	return (
		<div
			className="d-flex flex-wrap"
			style={{
				padding: "20px 0"
			}}>
			{icons.map(icon => {
				return (
					<div
						className="d-flex align-items-center"
						style={{
							width: "30%",
							marginBottom: 20
						}}>
						<span
							style={{
								marginRight: 20
							}}>
							<Icon name={icon.key} />
						</span>
						<span>{icon.key}</span>
					</div>
				);
			})}
		</div>
	);
}
