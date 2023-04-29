/** @type {HTMLCanvasElement} */
let canvas=document.getElementById("screen");
let ctx=canvas.getContext('2d');

let screenWidth =600;
let screenHeight=400;
let forwards = new Vec3(0,0,1).normalize();
let up       = new Vec3(0,-1,0).normalize();
let cam=new Camera(
    50,
    screenWidth,
    screenHeight,
    new CameraTransform(
        new Vec3(6.6416, 3.0271, 1.9986), // pos
        new Vec3(-0.2902, -0.1464, 0.9457), // forwards
        new Vec3(0.0264, -0.9866, -0.1608), // up
    )
); // Camera at (0,0,0) facing positive Z (forwards) and down

// cam.transform.rotate(10,cam.transform.right);

let imgData=ctx.createImageData(screenWidth,screenHeight);
let frame=0;
let sampleInterval=-1;
let startSampleTimeout=-1;

canvas.width=screenWidth;
canvas.height=screenHeight;

let mouse=new MouseListener();
mouse.attach(canvas);

let times=[]

canvas.onmousemove=(ev)=>{
    if (!mouse.leftButtonDown) return;
    let rx=ev.movementX/2;
    let ry=ev.movementY/2;
    if (rx+ry==0) return;
    // let axis = cam.transform.up.scale(rx)
    //         .add(
    //             cam.transform.right.scale(ry)
    //         )
    //         .normalize();
    let axis = new Vec3(
        cam.transform.up.x * rx  +  cam.transform.right.x * ry,
        cam.transform.up.y * rx  +  cam.transform.right.y * ry,
        cam.transform.up.z * rx  +  cam.transform.right.z * ry,
    ).normalize();
    cam.transform.rotate(Math.sqrt(rx ** 2 + ry ** 2) / 1,axis);
    draw();
    drawDebugLine(axis.scale(-1),axis,1,"orange");
}

canvas.onkeydown=(ev)=>{
    if (ev.key=="w")      cam.transform.pos.addS(cam.transform.forwards);
    else if (ev.key=="s") cam.transform.pos.addS(cam.transform.backwards);
    else if (ev.key=="d") cam.transform.pos.addS(cam.transform.left);
    else if (ev.key=="a") cam.transform.pos.addS(cam.transform.right);
    draw();
}

// /**
//  * 
//  * @param {MouseEvent} ev 
//  */
// canvas.onscroll=(ev)=>{
//     ev.
//     draw();
// }

function draw() {
    debugClear();
    frame = 0;
    clearInterval(sampleInterval);
    clearTimeout(startSampleTimeout);
    cam.cache=[];
    let start=Date.now();
    let lastColor=vec0.clone();
    for (let y=0;y<screenHeight;y++) {
        for (let x=0;x<screenWidth;x++) {
            let i=( y * screenWidth + x ) * 4;

            // Every other pixel is skipped
            let color= (( y * screenWidth + x ) % previewPixSkip > 0)  ?  lastColor : getPixelColor(x,y);

            imgData.data[ i + 0 ]=color.x;
            imgData.data[ i + 1 ]=color.y;
            imgData.data[ i + 2 ]=color.z;
            imgData.data[ i + 3 ]=255;

            lastColor=color;
        }
    }
    ctx.putImageData(imgData,0,0);


    // updateData({
    //     cam,
    // })

    drawDebug();

    let end=Date.now();

    debugLog(`Took ${end-start}ms, ${(1000/(end-start)).toFixed(2)}fps`)
    let avg=0;
    for (let t of times) {
        avg+=t/times.length;
    }
    debugLog(`Average ${avg.toFixed(2)}ms, ${(1000/avg).toFixed(2)}fps`)
    times.push(end-start);

    startSampleTimeout=setTimeout(()=>{
        sampleInterval=setInterval(()=>{
            if (frame+1 >= MAX_SAMPLES) {
                clearInterval(sampleInterval);
                console.log("stop sampling")
            }
            if (!(frame%5))
            console.log(`sample #${frame}`)

            let weight = 1/(frame+1);

            for (let y=0;y<screenHeight;y++) {
                for (let x=0;x<screenWidth;x++) {
                    let i=( y * screenWidth + x ) * 4;
    
                    let prevColor=new Vec3(
                        imgData.data[ i + 0 ],
                        imgData.data[ i + 1 ],
                        imgData.data[ i + 2 ],
                    );
                    let color=getPixelColor(x,y);
    
                    let newColor = lerpVec(prevColor,color,weight);
    
                    imgData.data[ i + 0 ]=newColor.x;
                    imgData.data[ i + 1 ]=newColor.y;
                    imgData.data[ i + 2 ]=newColor.z;
                    imgData.data[ i + 3 ]=255;
                }
            }
        
            ctx.putImageData(imgData,0,0);

            frame++;
        });
    },1000);
}

draw();

// setInterval(draw,1000/60)