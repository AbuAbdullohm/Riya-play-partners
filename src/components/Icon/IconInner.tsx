import React, { Component } from "react";
import { icons } from "./icons";

type TIconInnerProps = {
	name: string;
};

type TIconsProps = { key: string; value: string };

class IconInner extends Component<TIconInnerProps> {
	createMarkup(markup: string) {
		return { __html: markup };
	}

	render() {
		const { name } = this.props;
		const iconMarkup = icons.filter(
			(icon: TIconsProps) => icon.key === name
		)[0];

		if (iconMarkup) {
			return (
				<g
					dangerouslySetInnerHTML={this.createMarkup(
						iconMarkup.value
					)}
				/>
			);
		}
		return null;
	}
}

export default IconInner;
