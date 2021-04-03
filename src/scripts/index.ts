import './index.less';
import * as seedrandom from 'seedrandom';
import gsap from 'gsap';

import BaseRecorder from './recorders/baseRecorder';
import Recorder from './recorders/mediaRecorder';
import CCaptureRecorder from './recorders/ccaptureRecorder';
import saveThumbnail from './recorders/thumbnailCapture';

//import ThreeRenderer from './renderers/threeRenderer';
import CanvasRenderer from './renderers/canvasRenderer';

interface CanvasElement extends HTMLCanvasElement {               
    captureStream(int): MediaStream;             
}

const DEBUG: boolean = true;
const THUMBNAIL: boolean = false;

const srandom = seedrandom('a');

let tl;
let items = [];

class App {
    canvas: CanvasElement;
    renderer: CanvasRenderer;
    recorder: BaseRecorder;

    animating: boolean = true;

    constructor() {
        this.canvas = <CanvasElement> document.getElementById('canvas');

        this.recorder = new CCaptureRecorder(this.canvas);
        if (!DEBUG) {
            this.recorder.start();
        }

        this.renderer = new CanvasRenderer(this.canvas);

        this.createTimeline();

        this.animation();

        if (THUMBNAIL) {
            saveThumbnail(this.canvas);
        }
    }

    createTimeline() {
        items = this.renderer.items;

        tl = gsap.timeline({
            delay: 0.1,             // delay to capture first frame
            repeat: DEBUG ? -1 : 1, // if debug repeat forever
            yoyo: true, 
            paused: THUMBNAIL,
            onComplete: () => this.handleTLComplete()
        });

        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let out = srandom();

            for (let j = 0; j < item.children.length; j++) {
                let child = item.children[j];
                let time = out + srandom();

                tl.to(child, {
                    color: this.renderer.randomColor(),
                    duration: 0.2
                }, time);

                tl.to(child, {
                    size: 0, 
                    line: 0, 
                    duration: 0.7,
                    ease: "power2.in"
                }, time);

                tl.to(child, {
                    size: this.renderer.randomSize(),
                    line: this.renderer.randomLine(),
                    color: this.renderer.randomColor(),
                }, time + 1)
            }
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

    animation() {
        this.renderer.render();
        if (!DEBUG) {
            this.recorder.update();
        }
        if (this.animating) {
            requestAnimationFrame(() => this.animation());
        }
    }
    
}

new App();