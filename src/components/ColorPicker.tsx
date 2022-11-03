import { useEffect, useRef, useState } from "react";
import { HexAlphaColorPicker, HexColorInput } from "react-colorful";
import { styled } from "@stitches/react";

type ColorPickerProps = {
	showHexInputField?: boolean;
	onSelectColor?: (value: string) => void;
};

export default function ColorPicker({ ...props }: ColorPickerProps) {
	const [color, setColor] = useState("#FFFFFF");
	const [hasAlpha, setHasAlpha] = useState(true);
	const [opacityPercentage, setOpacityPercentage] = useState(100);
	const hexInputRef = useRef(null);

	useEffect(() => {
		let hexWithoutPond = color.replace(/#/g, "");
		if (hexWithoutPond.length === 8) {
			let y = hexWithoutPond[6] as string;
			let z = hexWithoutPond[7] as string;
			let q = y.concat(z);

			let x = parseInt(q, 16);
			let max = 255;

			setOpacityPercentage(Math.floor(Math.round((x / max) * 100)));
		} else {
			setOpacityPercentage(100);
		}
	}, [color]);

	useEffect(() => {
		if (props.onSelectColor) props.onSelectColor(color);
	}, [color]);

	const fixDigitEntryToLongerForm = (value: string) => {
		let hexWithoutPound = value.replace(/#/g, "");
		const isShortFormatHex = hexWithoutPound.length === 3;
		const hasOpacitySpecified = hexWithoutPound.length === 4;

		if (isShortFormatHex || hasOpacitySpecified) {
			hexWithoutPound = hexWithoutPound
				.split("")
				.map((hex) => hex + hex)
				.join("");
		}

		setColor(`#${hexWithoutPound.toLocaleUpperCase()}`);
	};

	const onColorInputChange = (value: string) => {
		setColor(value);
	};

	return (
		<ColorPickerCard>
			<HexAlphaColorPickerStyled color={color} onChange={setColor} has_alpha={hasAlpha} />
			{props.showHexInputField ? (
				<>
					<InputsContainer>
						<HexColorInputStyled
							color={color.toLocaleUpperCase()}
							onChange={onColorInputChange}
							onBlur={() => fixDigitEntryToLongerForm(color.toLocaleUpperCase())}
							onKeyDown={() => fixDigitEntryToLongerForm(color.toLocaleUpperCase())}
							placeholder="Type a color"
							prefixed
							alpha={hasAlpha}
						/>
						{hasAlpha && (
							<OpacityPercentage
								value={opacityPercentage}
								onChange={(e) => {
									setOpacityPercentage(parseInt(e.target.value));
								}}
							/>
						)}
					</InputsContainer>
					<button
						onClick={() => navigator.clipboard.writeText(color.toLocaleUpperCase())}
					>
						copy hex
					</button>
				</>
			) : null}
		</ColorPickerCard>
	);
}

const InputsContainer = styled("div", {
	display: "flex",
});
const OpacityPercentage = styled("input", {
	width: "5rem",
	height: "2rem",
	border: "none",
	boxShadow: "0px 0px 1px 0.5px rgba(0,0,0,0.5)",
	borderRadius: "5px",
	outline: "none",
	margin: "5px",
});

const HexColorInputStyled = styled(HexColorInput, {
	width: "5rem",
	height: "2rem",
	border: "none",
	boxShadow: "0px 0px 1px 0.5px rgba(0,0,0,0.5)",
	borderRadius: "5px",
	outline: "none",
	margin: "5px",
});

const HexAlphaColorPickerStyled = styled(HexAlphaColorPicker, {
	variants: {
		has_alpha: {
			true: {
				"&.react-colorful .react-colorful__alpha  .react-colorful__alpha-pointer": {
					width: "16px",
					height: "16px",
				},
				"&.react-colorful .react-colorful__alpha": {
					height: "8px",
					borderRadius: "4px",
					margin: "1rem 0 1rem 0",
				},
				"&.react-colorful .react-colorful__alpha-gradient": {
					height: "8px",
					borderRadius: "4px",
				},
			},
			false: {
				"&.react-colorful .react-colorful__alpha  .react-colorful__alpha-pointer": {
					display: "none",
				},
				"&.react-colorful .react-colorful__alpha": {
					display: "none",
				},
				"&.react-colorful .react-colorful__alpha-gradient": {
					display: "none",
				},
			},
		},
	},
	"&.react-colorful": {
		width: "100%",
	},
	"&.react-colorful .react-colorful__hue": {
		height: "8px",
		borderRadius: "4px",
		margin: "1rem 0 1rem 0",
	},

	"&.react-colorful .react-colorful__hue .react-colorful__interactive .react-colorful__hue-pointer":
		{
			width: "16px",
			height: "16px",
		},
});

const ColorPickerCard = styled("div", {
	// width: "100%",
});
