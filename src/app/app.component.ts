import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { CountdownComponent, CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { IClock } from './interfaces/clock.interface';
import { TitleStrategy } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	ngOnInit(): void {
	}

	title = 'k-timer';

	@ViewChild('cd1', {static: false}) private cd1!: CountdownComponent;

	private clickSound: HTMLAudioElement = new Audio('../assets/sounds/254316__jagadamba__clock-tick.wav');
	private alarmSound: HTMLAudioElement = new Audio('../assets/sounds/426888__thisusernameis__beep4.wav');

	public clock1: IClock = {
		state: "paused",
		startingTimeLeft: 0,
		font: "LCDBOLD",
		isSoundEnabled: true
	}

	public dangerZone: number = 21;
	public progress: number = 0;

	public config1: CountdownConfig = {
		demand: true,
		leftTime: this.clock1.startingTimeLeft,
		format: 'HH:mm:ss.S',
		notify: 0,
		prettyText: (text) => {
			return text.split('.')
			.map((value) => `<span class="time-item">${value}</span>`)
			.join('');
		}
	}

	constructor() {
		this.clock1 = JSON.parse(localStorage.getItem('userSettings') || JSON.stringify(this.clock1));
	}

	ngAfterViewInit() {
		// Timeout prevents this error https://angular.io/errors/NG0100
		setTimeout(()=>this.onReset(), 0);
	}

	@HostListener('document:keypress', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent) {

		if (event.key == 'r' || event.key == 'R') {
			this.onReset();
		}

		if (event.key == 'p' || event.key == 'P' || event.key == ' ') {
			this.onStartStop();
		}

	}

	handleEvent(event: CountdownEvent): void {
		// console.log(event);

		if (event.action === 'notify') {
			this.progress = 100 - (((event.left / 1000) / this.clock1.startingTimeLeft) * 100);
			// console.log(this.progress);
		}

		if (event.action === 'done' && this.clock1.isSoundEnabled) {
			this.alarmSound.load();
			this.alarmSound.play();
		}
	}

	onResetBtn(event: Event) {
		let button : HTMLButtonElement = event.currentTarget as HTMLButtonElement;
		button.blur();
		this.onReset();
	}

	onReset(): void {
		this.cd1.config.leftTime = this.clock1.startingTimeLeft;
		this.cd1.restart();
		this.clock1.state = "paused";
	}

	onSetToZero(event: Event): void {
		let button : HTMLButtonElement = event.currentTarget as HTMLButtonElement;
		button.blur();

		this.clock1.startingTimeLeft = 0;
		this.onSaveSettings();
		this.onReset();
	}

	onAddTime(event: Event, time: number): void {

		let button : HTMLButtonElement = event.currentTarget as HTMLButtonElement;
		button.blur();

		let timeleft : number = this.clock1.startingTimeLeft + time;

		if (timeleft < 0) {
			timeleft = 0;
		}

		this.clock1.startingTimeLeft = timeleft;
		this.cd1.config.leftTime = timeleft;
		this.onSaveSettings();
		this.cd1.restart();
		if (this.clock1.state == "active") {
			this.cd1.begin();
		}
		if (this.clock1.state == "paused") {
			this.cd1.pause();
		}
	}

	onStartStop(): void {
		console.log("onStartStop() -- " + this.clock1.state);
		if (this.clock1.state == "paused") {
			this.clock1.state = "active";
			this.cd1.begin();
		} else {
			this.clock1.state = "paused";
			this.cd1.pause();
		}
	}

	onSaveSettings(): void {
		localStorage.setItem('userSettings', JSON.stringify(this.clock1));
	}

}


