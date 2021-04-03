import BaseRecorder from './baseRecorder';

declare global {
    interface Window { CCapture: any; }
}

export default class CCaptureRecorder implements BaseRecorder{

    capturer: any;
    canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;

        this.capturer = new window.CCapture( { 
            name: 'render',
            format: 'gif', 
            workersPath: 'libs/ccapture/' 
        });
    }

    public start() {
        this.capturer.start();
    }

    public stop() {
        this.capturer.stop();
        this.capturer.save();
    }

    public update() {
        this.capturer.capture( this.canvas );
    }

}