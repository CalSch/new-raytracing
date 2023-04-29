class MouseListener {
	mx;
	my;

    ox;
    oy;

    get dx() {
        return this.mx-this.ox;
    }

    get dy() {
        return this.my-this.oy;
    }

	leftButtonDown;
	leftButtonPressed;
	leftButtonReleased;
	
	constructor() {
		this.mx=0;
		this.my=0;
		this.leftButtonDown=false;
		this.leftButtonPressed=false;
		this.leftButtonReleased=false;
	}

	/**
	 * Attach event listeners to a canvas. You should probably only run this once per MouseListener
	 * @param {HTMLCanvasElement canvas The canvas to attach to
	 */
	attach(canvas) {
		canvas.addEventListener('mousemove',(ev)=>{
			this.mx=ev.offsetX;
			this.my=ev.offsetY;
		},true);
		canvas.addEventListener("mousedown",(ev)=>{
			this.leftButtonDown=true;
			this.leftButtonPressed=true;
		});
		window.addEventListener("mouseup",(ev)=>{
			this.leftButtonDown=false;
			this.leftButtonReleased=true;
		});
	}

	/**
	 * Run this function after one frame, this clears keysPressed, and keysReleased which depend on the current frame.
	 */
	afterUpdate() {
		this.leftButtonPressed=false;
		this.leftButtonReleased=false;
        this.ox=this.mx;
        this.oy=this.my;
	}
}