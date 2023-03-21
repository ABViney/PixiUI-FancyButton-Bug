import { Application, Sprite } from 'pixi.js'

const canvas = document.getElementById("pixi-canvas") as HTMLCanvasElement;
canvas.addEventListener('contextmenu', (e) => e.preventDefault());

const app = new Application({
	view: canvas,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 640,
	height: 480
});

import { App } from './app';

new App(app);