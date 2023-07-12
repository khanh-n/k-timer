import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { CountdownComponent, CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { IClock } from './interfaces/clock.interface';
import { ISettings } from './interfaces/settings.interface';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	ngOnInit(): void {
		throw new Error('Method not implemented.');
	}

	title = 'k-timer';

	@ViewChild('cd1', {static: false}) private cd1!: CountdownComponent;

	private clickSound: HTMLAudioElement = new Audio('../assets/sounds/254316__jagadamba__clock-tick.wav');
	private alarmSound: HTMLAudioElement = new Audio('../assets/sounds/426888__thisusernameis__beep4.wav');

	public settings: ISettings = {
		font: "LCDBOLD",
		isSoundEnabled: true,
		selectedPreset: "10",
	};
	public clock1: IClock = {
		state: "paused",
		startingTimeLeft: 0
	}

	public dangerZone: number = 21;
	// public showDecimalAt: number = 11;

	public custom: string = this.settings.selectedPreset;
	public config1: CountdownConfig = {
		demand: true,
		leftTime: this.clock1.startingTimeLeft,
		format: 'mm:ss.S',
		notify: [this.dangerZone - 1],
		prettyText: (text) => {
			return text.split('.')
			.map((value) => `<span class="time-item">${value}</span>`)
			.join('');
		}
	}

	ngAfterViewInit() {
		if (this.settings.clock == null) {
			this.settings.clock = this.clock1;
		}
		this.clock1 = this.settings.clock;
		this.onReset();
	}

	@HostListener('document:keypress', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent) {

		if (event.key == 'r' || event.key == 'R') {
			this.onReset();
		}

		if (event.key == 'p' || event.key == 'P' || event.key == ' ') {
			this.handleStartStop();
		}

	}

	handleEvent(event: CountdownEvent): void {

		if (event.action === 'done' && this.settings.isSoundEnabled) {
			this.alarmSound.load();
			this.alarmSound.play();
		}
	}

	onReset(): void {
		this.cd1.config.leftTime = this.clock1.startingTimeLeft;
		this.cd1.restart();
		this.clock1.state = "paused";
	}

	onAddTime(time: number): void {
		let timeleft : number = this.clock1.startingTimeLeft + time;

		if (timeleft < 0) {
			timeleft = 0;
		}

		this.clock1.startingTimeLeft = timeleft;
		this.cd1.config.leftTime = timeleft;
		this.cd1.restart();
	}

	handleStartStop(): void {
		if (this.clock1.state == "paused") {
			this.clock1.state = "active";
			this.cd1.begin();
		} else {
			this.clock1.state = "paused";
			this.cd1.pause();
		}
	}
}


