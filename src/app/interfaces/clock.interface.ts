export interface IClock {
	state: string,	// paused or active
	startingTimeLeft: number,
	font: string,
	isSoundEnabled: boolean
}
