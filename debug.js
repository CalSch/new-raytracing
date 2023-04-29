const DEBUG_CAM_GRID_SIZE=11;
const DEBUG_AXES_SIZE=3;

const axisX=new Vec3(DEBUG_AXES_SIZE,0,0);
const axisY=new Vec3(0,DEBUG_AXES_SIZE,0);
const axisZ=new Vec3(0,0,DEBUG_AXES_SIZE);

let debugEl=document.getElementById("debug");
function updateDebugData(d) {
    debugEl.innerText=JSON.stringify(d,(k,v)=>{
        if (typeof v==="number") {
            return v.toFixed(5);
        }
        return v;
    },4);
}

function debugClear() {
    debugEl.innerText="";
}

function debugLog(t) {
    debugEl.innerHTML+=t+"\n";
}

/** @type {HTMLCanvasElement} */
let debugCanvas=document.getElementById("debug-screen");
debugCanvas.width=300;
debugCanvas.height=300;
let dbg=debugCanvas.getContext('2d');

let debugMouse=new MouseListener();
debugMouse.attach(debugCanvas);

let points=[];
for (let i=0;i<10000;i++) {
    points.push(randomDirection());
}

// let debugCam=new Camera(300,300,new CameraTransform(new Vec3(1,1,1).scale(5),new Vec3(-1,-1,-1).normalize()));
let debugCam={
    pos: new Vec3(0,0,-10),
    width:  debugCanvas.width,
    height: debugCanvas.height,
    yaw:   Math.PI,
    pitch: 0,
    roll:  Math.PI,
    perspective: 700
}

function rotate(a, b, angle) {
    return [
        Math.cos(angle) * a - Math.sin(angle) * b,
        Math.sin(angle) * a + Math.cos(angle) * b
    ];
};

/**
 * 
 * @param {Vec3} point
 * @returns {Vec3 | false}
 */
function projectPoint(point) {
    let p=point.clone();
    [p.x,p.z] = rotate(p.x, p.z, debugCam.yaw);
    [p.y,p.z] = rotate(p.y, p.z, debugCam.pitch);
    [p.x,p.y] = rotate(p.x, p.y, debugCam.roll);

    p=p.sub(debugCam.pos);

    if (p.z > 0 ) {
        let X = debugCam.width/2 + p.x / p.z * debugCam.perspective;
        let Y = debugCam.height/2 + p.y / p.z * debugCam.perspective;
        p.x=X;
        p.y=Y;
        p.z=p.z * debugCam.perspective
        return p;
    } else {
        return false;
    }
}

/**
 * @param {Vec3} p 
 * @param {string} c
 */
function drawDebugPoint(p,c,r) {
    c=c || "black";
    r=r || 1;
    let projectedPoint=projectPoint(p);

    if (projectedPoint) {
        dbg.beginPath();
        dbg.fillStyle=c;
        dbg.arc(projectedPoint.x,projectedPoint.y,r,0,Math.PI*2);
        dbg.fill();
    }

    return projectedPoint;
}

function drawDebugAxes(scale) {
    // let c=new Vec3(0,0,0);
    
    // dbg.lineWidth=0.5;

    // dbg.strokeStyle="red";
    // dbg.beginPath();
    // dbg.moveTo(c.x,c.y);
    // dbg.lineTo(x.x,x.y);
    // dbg.stroke();
    drawDebugLine(vec0,axisX,0.5,"red");
    drawDebugLine(vec0,axisY,0.5,"green");
    drawDebugLine(vec0,axisZ,0.5,"blue");
}

function drawDebugPixels() {
    for (let i=0;i<screenHeight/DEBUG_CAM_GRID_SIZE;i++) {
        for (let j=0;j<screenWidth/DEBUG_CAM_GRID_SIZE;j++) {
            let x=j*DEBUG_CAM_GRID_SIZE;
            let y=i*DEBUG_CAM_GRID_SIZE;
            let dir=cam.getPixelDir(x,y);
            let color=getPixelColor(x,y);
            drawDebugPoint(dir,`rgb(${color.x},${color.y},${color.z})`,2);
        }
    }
}

/**
 * 
 * @param {Vec3} p1 
 * @param {Vec3} p2 
 * @param {number} s
 * @param {string} c
 */
function drawDebugLine(p1,p2,s,c) {
    let a=projectPoint(p1);
    let b=projectPoint(p2);
    if (a&&b) {
        dbg.lineWidth=s||2;
        dbg.strokeStyle=c||"black";
        dbg.beginPath();
        dbg.moveTo(a.x+0.5,a.y+0.5);
        dbg.lineTo(b.x+0.5,b.y+0.5);
        dbg.stroke();
    }
}

/**
 * 
 * @param {CameraTransform} t 
 */
function drawTransform(t) {
    drawDebugLine(vec0,t.forwards, 2,"red");
    drawDebugLine(vec0,t.backwards,1,"red");
    drawDebugLine(vec0,t.left,     1,"green");
    drawDebugLine(vec0,t.right,    1,"green");
    drawDebugLine(vec0,t.up,       1,"blue");
    drawDebugLine(vec0,t.down,     1,"blue");
}

function drawDebug() {
    dbg.clearRect(0,0,debugCanvas.width,debugCanvas.height);

    drawDebugPixels();
    drawTransform(cam.transform);
    
    drawDebugPoint(vec0,"rgba(0,0,0,0.3)",3);

    // for (let p of points) {
    //     drawDebugPoint(p,"black",1)
    // }

    drawDebugAxes(3);
}


debugCanvas.onmousemove=(ev)=>{
    if (!debugMouse.leftButtonDown) return;
    // debugCam.yaw = lerp(-2,2,ev.offsetX/debugCanvas.width);
    // debugCam.pitch=lerp(-2,2,ev.offsetY/debugCanvas.height);
    debugCam.yaw   -= ev.movementX/60;
    debugCam.pitch += ev.movementY/60;
    
    drawDebug();
    // debugMouse.afterUpdate();
}

debugCanvas.onwheel=(ev)=>{
    debugCam.perspective-=ev.deltaY/2
    drawDebug();
}