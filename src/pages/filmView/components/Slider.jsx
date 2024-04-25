import React from "react";
import { get, isArray } from "lodash";
import { Splide, SplideSlide } from "@splidejs/react-splide";

// Default theme
import "@splidejs/splide/dist/css/themes/splide-default.min.css";

export default function Slider({
	key,
	items = [],
	valueDirection,
	image = true,
	options = {
		perPage: 2.5,
		gap: 10,
		height: 170
	},
	onClick = () => {}
}) {
	return (
		<div className="slider">
			<Splide options={{ keyboard: true, pagination: false, arrows: true, focus: "left", ...options }} key={key}>
				{items &&
					isArray(items) &&
					items.map((item, i) => {
						return (
							<SplideSlide
								key={i}
								className="slider_item"
								onClick={e => {
									e.stopPropagation();
									console.log("clicked");
									onClick(items, item);
								}}>
								{image ? (
									<img src={get(item, valueDirection)} alt="" />
								) : (
									<iframe src={get(item, valueDirection, "").replace("playlist.json", "embed.html")} frameborder="0"></iframe>
								)}
							</SplideSlide>
						);
					})}
			</Splide>
		</div>
	);
}
