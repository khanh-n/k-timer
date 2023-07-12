import { IClock } from "./clock.interface";

export interface ISettings {
	font: string,
	isSoundEnabled: boolean,
	selectedPreset: string
	clock?: IClock
}
