const setTransparent = trasnparentColor => frame => {
	const [tr, tg, tb] = trasnparentColor;

	let transparentFrame = [...frame];

	for (let i = 0; i < transparentFrame.length; i += 4) {
		const r = transparentFrame[i];
		const g = transparentFrame[i + 1];
		const b = transparentFrame[i + 2];

		if (r === tr && g === tg && b === tb) {
			transparentFrame[i + 3] = 0;
		}
	}

	return transparentFrame;
};

export const transparentPurple = setTransparent([255, 0, 255]);

export const frameCanvas = document.createElement("canvas");
let _ctx = frameCanvas.getContext("2d");

export const drawBuffer = (frame, parentContext) => {
	const { dims, transparentFrame } = frame;
	const imageWidth = dims.width;
	const imageHeight = dims.height;

	frameCanvas.width = imageWidth;
	frameCanvas.height = imageHeight;
	frameCanvas.scale = 1;
	let frameImageData = _ctx.createImageData(imageWidth, imageHeight);

	// Render actual image here
	frameImageData.data.set(transparentFrame);

	_ctx.putImageData(frameImageData, 0, 0);

	if (parentContext) {
		const { dims } = frame;
		parentContext.drawImage(frameCanvas, dims.left, dims.top);
	}
};
