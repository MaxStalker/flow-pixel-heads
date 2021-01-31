import React, { useEffect, useState } from "react";
import { parseGIF, decompressFrames } from "gifuct-js";
import Canvas from "./components/Canvas";
import { drawBuffer, transparentPurple } from "./utils/image";
import baseSet from "./images/pixelheads-set.gif";

function App() {
	const [sprites, setSpriteSet] = useState(null);
	const [hat, setHat] = useState("");
	const [beard, setBeard] = useState("");
	const [googles, setGoogles] = useState("");
	const [pipe, setPipe] = useState("");

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
				pirateHat,
				cyborgHat,
				googles,
				smallBeard,
				bigBeard,
				pipe
			] = frames.map(frame => {
				console.log({ frame });
				frame.transparentFrame = transparentPurple(frame.patch);
				return frame;
			});

			setSpriteSet({
				base,
				coat,
				wizardHat,
				pirateHat,
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
			{sprites && (
				<div class={"canvas-container"}>
					<Canvas
						width={24}
						height={24}
						draw={context => {
							context.width = 24;
							context.height = 24;
							context.scale = 1;

							context.clearRect(0, 0, 24, 24);

							drawBuffer(sprites.base, context);
							hat && drawBuffer(sprites[hat], context);
							googles && drawBuffer(sprites.googles, context);
							beard && drawBuffer(sprites[beard], context);
							pipe && drawBuffer(sprites.pipe, context);
						}}
					/>
				</div>
			)}
			<div style={{ display: "flex", flexDirection: "column" }}>
				<select
					onChange={e => {
						const { value } = e.target;
						setHat(value);
					}}
				>
					<option value={""}>No Hat</option>
					<option value={"wizardHat"}>Wizard Hat</option>
					<option value={"pirateHat"}>Pirate Hat</option>
				</select>

				<select
					onChange={e => {
						const { value } = e.target;
						setBeard(value);
					}}
				>
					<option value={""}>No Beard</option>
					<option value={"smallBeard"}>Small Beard</option>
					<option value={"bigBeard"}>Big Beard</option>
				</select>

				<select
					onChange={e => {
						const { value } = e.target;
						setPipe(value !== "");
					}}
				>
					<option value={""}>No pipe</option>
					<option value={"pipe"}>With Pipe</option>
				</select>

				<select
					onChange={e => {
						const { value } = e.target;
						setGoogles(value !== "");
					}}
				>
					<option value={""}>No googles</option>
					<option value={"googles"}>With Googles</option>
				</select>
			</div>
		</div>
	);
}

export default App;
