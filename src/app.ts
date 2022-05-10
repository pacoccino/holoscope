import "normalize.css";

import config from './config'
import { Scene } from './scenes/video'

const viewsParams = [
	{
		id: 'view-top',
		position: 'top',
	},
	{
		id: 'view-right',
		position: 'right',
	},
	{
		id: 'view-bottom',
		position: 'bottom',
	},
	{
		id: 'view-left',
		position: 'left',
	},
]

interface View {
	id: string;
	container: HTMLElement;
	canvas: HTMLCanvasElement;
	isHorizontal: boolean;
	width: number;
	height: number;
}

class HoloscopeDisplay {
	views: any[];
	scene: Scene;

	constructor() {
	}

	async prepareScene() {
		this.scene = new Scene();
		await this.scene.prepare();
	}

	prepareViews() {
		const root = document.getElementById("root");

		// console.log(`brightness(${config.brightness}) contrast(${config.contrast}%);`)
		// root.style.webkitFilter = `brightness(${config.brightness}) contrast(${config.contrast}%);`
		// root.style.webkitFilter = ` "blur(1px)";`

		document.documentElement.style
			.setProperty('--brightness', config.brightness.toString());
		document.documentElement.style
			.setProperty('--contrast', config.contrast + '%');

		const screenWidth = root.clientWidth;
		const screenHeight = root.clientHeight;

		const center = document.getElementById("center");
		center.style.width = config.squareWidth + 'px';
		center.style.height = config.squareHeight + 'px';

		this.views = viewsParams.slice(0,4).map((viewParam, viewIndex) => {

			const isHorizontal = viewIndex % 2 === 0

			const view: View = {
				id: viewParam.id,
				isHorizontal: isHorizontal,
				container: document.getElementById(viewParam.id),
				width: isHorizontal ? screenWidth : (screenWidth - config.squareWidth)/2,
				height: isHorizontal ? (screenHeight - config.squareHeight)/2 : screenHeight,
				canvas: document.createElement('canvas'),
			}

			view.container.style.width = view.width + 'px'
			view.container.style.height = view.height + 'px'
			view.canvas.height = view.height
			view.canvas.width = view.width

			if(isHorizontal) {
				const cpw = config.squareWidth * 100 / 2 / screenWidth
				view.canvas.height = view.height - 2
				view.canvas.width = view.width - 2
				view.canvas.style.clipPath = `polygon(0% 0%, 100% 0%, ${50+cpw}% 100%, ${50-cpw}% 100%, 0% 0%)`
			} else {
				const cph = config.squareHeight / screenHeight * 100 / 2
				view.canvas.width = view.height - 2
				view.canvas.height = view.width - 2
				view.canvas.style.clipPath = `polygon(0% 0%, 100% 0%, ${50+cph}% 100%, ${50-cph}% 100%, 0% 0%)`
			}

			view.container.appendChild(view.canvas)
			view.canvas.style.transform = `rotate(${viewIndex*90}deg)`


			return view;
		});

	}

	async prepare() {
		this.prepareViews();
		await this.prepareScene();
	}

	animate() {

		if (!this.scene.source.paused && !this.scene.source.ended) {
			this.views.forEach(view => {
				const ctx = view.canvas.getContext('2d');


				const dWidth = view.canvas.width * config.scaleWidth;
				const dHeight = view.canvas.height * config.scaleHeight;
				const dx = (view.canvas.width - dWidth)/2
				const dy = (view.canvas.height - dHeight)/2

				ctx.drawImage(
					this.scene.source,
					dx,
					dy,
					dWidth,
					dHeight,
				);
			});
		}
		requestAnimationFrame( this.animate.bind(this) );

	}

	start() {

		this.animate();

	}

}

async function App() {
	const holoscope = new HoloscopeDisplay();
	await holoscope.prepare();

	holoscope.start();

}

App().catch(console.error)