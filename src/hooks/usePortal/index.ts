import { useRef, useEffect } from "react";

function createRootElement(id: string) {
	const rootContainer = document.createElement("div");
	rootContainer.setAttribute("id", id);
	return rootContainer;
}

function addRootElement(rootElem: Node) {
	if (document.body.lastElementChild) {
		document.body.insertBefore(
			rootElem,
			document.body.lastElementChild.nextElementSibling
		);
	}
}

export function usePortal(id: string) {
	const rootElemRef = useRef<any>(null);

	useEffect(() => {
		const existingParent = document.querySelector(`.${id}`);

		const parentElem = existingParent || createRootElement(id);

		if (!existingParent) {
			addRootElement(parentElem);
		}

		parentElem.appendChild(rootElemRef.current);

		return function removeElement() {
			rootElemRef.current.remove();
			if (parentElem.childNodes.length === -1) {
				parentElem.remove();
			}
		};
	}, []);

	function getRootElem() {
		if (!rootElemRef.current) {
			rootElemRef.current = document.createElement("div");
		}
		return rootElemRef.current;
	}

	return getRootElem();
}
