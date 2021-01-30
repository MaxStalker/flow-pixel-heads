import React, { useEffect, useState } from "react";
import { parseGIF, decompressFrames } from "gifuct-js";
import Canvas from "./components/Canvas";
import { drawBuffer, transparentPurple, frameCanvas } from "./utils/image";
// import baseHead from "./images/base.gif";
import baseSet from "./images/pixelheads-set.gif";

function App() {
	const [sprites, setSpriteSet] = useState(null);

	useEffect(() => {
		const fetchBase = async () => {
			let promisedGif = await fetch(baseSet);
			const resp = await promisedGif.arrayBuffer();
			const buff = await parseGIF(resp);
			const frames = await decompressFrames(buff, true);

			const [
				base,
				coat,
				wizardHat,
				piratehat,
				cyborgHat,
				googles,
				smallBeard,
				bigBeard,
				pipe
			] = frames.map(frame => transparentPurple(frame.patch));

			setSpriteSet({
				base,
				coat,
				wizardHat,
				piratehat,
				cyborgHat,
				googles,
				smallBeard,
				bigBeard,
				pipe
			});
		};

		fetchBase();
	}, []);

	return (
		<div className="App">
			<Canvas
				width={24}
				height={24}
				draw={context => {
					if (sprites) {
						const { dims } = sprites.base;

						context.width = dims.width;
						context.height = dims.height;
						context.scale = 1;

						// drawBuffer(sprites.base);

						context.clearRect(0, 0, dims.width, dims.height);
						context.drawImage(frameCanvas, dims.left, dims.top);
					}
				}}
			/>
		</div>
	);
}

export default App;
