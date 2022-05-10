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
	aspectRatio: number;

	constructor() {
	}

	async prepareScene() {
		this.scene = new Scene();
		await this.scene.prepare();
	}

	prepareViews() {
		const root = document.getElementById("root");

		document.documentElement.style
			.setProperty('--brightness', config.brightness.toString());
		document.documentElement.style
			.setProperty('--contrast', config.contrast + '%');

		const screenWidth = root.clientWidth;
		const screenHeight = root.clientHeight;
		this.aspectRatio = screenWidth / screenHeight

		const center = document.getElementById("center");
		center.style.width = config.squareWidth + 'px';
		center.style.height = config.squareHeight + 'px';

		this.views = viewsParams.slice(0,4).map((viewParam, viewIndex) => {

			const isHorizontal = viewIndex % 2 === 0

			const view: View = {
				id: viewParam.id,
				isHorizontal: isHorizontal,
				container: document.getElementById(viewParam.id),
				width: isHorizontal ? screenWidth : screenHeight,
				height: isHorizontal ? (screenHeight - config.squareHeight)/2 : (screenWidth - config.squareWidth)/2,
				canvas: document.createElement('canvas'),
			}
			view.container.appendChild(view.canvas)

			view.canvas.height = view.height
			view.canvas.width = view.width
			view.canvas.style.transform = `rotate(${viewIndex*90}deg)`

			if(isHorizontal) {
				view.container.style.width = view.width + 'px'
				view.container.style.height = view.height + 'px'

				const cpw = config.squareWidth * 100 / 2 / screenWidth
				view.canvas.style.clipPath = `polygon(0% 0%, 100% 0%, ${50+cpw}% 100%, ${50-cpw}% 100%, 0% 0%)`
			} else {
				view.container.style.width = view.height + 'px'
				view.container.style.height = view.width + 'px'

				const cph = config.squareHeight / screenHeight * 100 / 2
				view.canvas.style.clipPath = `polygon(0% 0%, 100% 0%, ${50+cph}% 100%, ${50-cph}% 100%, 0% 0%)`
			}

			return view;
		});

	}

	preparePostProcess() {
		document.documentElement.style
			.setProperty('--brightness', config.brightness.toString());
		document.documentElement.style
			.setProperty('--contrast', config.contrast + '%');
	}

	async prepare() {
		this.prepareViews();
		this.preparePostProcess();
		await this.prepareScene();
	}

	animate() {

		if (!this.scene.source.paused && !this.scene.source.ended) {
			this.views.forEach(view => {
				const ctx = view.canvas.getContext('2d');

				const dWidth = view.width * config.scaleWidth;
				const dHeight = view.height * config.scaleHeight;
				const dx = (view.width - dWidth)/2
				const dy = (view.height - dHeight)/2

				// todo keep video aspect ratio

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