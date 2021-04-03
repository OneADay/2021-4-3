import './index.less';
import * as MathRandom from 'seedrandom';
import gsap from 'gsap';

import BaseRecorder from './recorders/baseRecorder';
import Recorder from './recorders/mediaRecorder';
import CCaptureRecorder from './recorders/ccaptureRecorder';

import ThreeRenderer from './renderers/threerenderer';

interface CanvasElement extends HTMLCanvasElement {               
    captureStream(int): MediaStream;             
}

const DEBUG: boolean = true;
const THUMBNAIL: boolean = true;

let tl;
let items = [];

class App {
    canvas: CanvasElement;
    renderer: ThreeRenderer;
    recorder: BaseRecorder;

    animating: boolean = true;

    constructor() {
        this.canvas = <CanvasElement> document.getElementById('canvas');

        this.recorder = new CCaptureRecorder(this.canvas);
        this.recorder.start();

        this.renderer = new ThreeRenderer(this.canvas);

        this.createTimeline();

        this.animation();

        if (THUMBNAIL) {
            this.saveThumbnail();
        }
    }

    createTimeline() {
        items = this.renderer.group.children;

        tl = gsap.timeline({
            delay: 0.1,             // delay to capture first frame
            repeat: DEBUG ? -1 : 1, // if debug repeat forever
            yoyo: true, 
            paused: THUMBNAIL,
            onComplete: () => this.handleTLComplete()
        });

        for (let i = 0; i < items.length; i++) {
            let x = Math.sin(i) * 0.25;
            let y = Math.cos(i) * 0.25;

            tl.to(items[i].position, {x, y, duration: 1}, 0);

            let x2 = Math.sin(i) * 1;
            let y2 = Math.sin(i) * 1;
            tl.to(items[i].position, {x: x2, y: y2, duration: 1}, 1);

            let x3 = Math.cos(i) * 1;
            let y3 = -Math.cos(i) * 1;
            tl.to(items[i].position, {x: x3, y: y3, duration: 1}, 2);

            let x4 = Math.cos(i) * 1.4;
            let y4 = 0;
            tl.to(items[i].position, {x: x4, y: y4, duration: 1}, 3);

            let x5 = -2 + MathRandom(i)() * 4;
            let y5 = -1 + MathRandom(i / 2)() * 2;
            let scale = MathRandom(i * 5)() * 0.25;
            tl.to(items[i].position, {x: x5, y: y5, duration: 1}, 4);
            tl.to(items[i].scale, {x: scale, y: scale, z: scale, duration: 1}, 4);
        }
    }

    handleTLComplete() {
        setTimeout(() => {
            if (!DEBUG) {
                this.recorder.stop();
                this.animating = false;
            }
        }, 100); //delay to capture last frame.
    }

    saveThumbnail() {
        let url = this.canvas.toDataURL('image/jpg');

        const link = document.createElement('a');
        link.href = url;
        const date = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`;
        link.download = `OneADay_${date}_thumbnail.jpg`;
    
        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(
          new MouseEvent('click', { 
            bubbles: true, 
            cancelable: true, 
            view: window 
          })
        );
    }

    animation() {
        this.renderer.render();
        this.recorder.update();
        if (this.animating) {
            requestAnimationFrame(() => this.animation());
        }
    }
    
}

new App();