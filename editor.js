function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? new Vec3(
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ).scale(1/255) : null;
}
/**
 * @param {Vec3} c 
 * @returns {string}
 */
function rgbToHex(c) {
    let r=c.x;
    let g=c.y;
    let b=c.z;
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

let targetShapeIndex=-1;

canvas.onclick=(ev)=>{
    let x=ev.offsetX;
    let y=ev.offsetY;
    let ray=new Ray(cam.transform.pos,cam.getPixelDir(x,y));
    let cast=castRay(ray);
    if (cast.hit.hasHit) {
        targetShapeIndex=scene.indexOf(cast.obj);
    } else {
        targetShapeIndex=-1;
    }

    debugLog(`${ev.offsetX},${ev.offsetY}`);
    debugLog(`${getPixelColor(ev.offsetX,ev.offsetY)}  <span class="color" style="background-color: ${rgbToHex(getPixelColor(ev.offsetX,ev.offsetY))}"></span>`);

    // updateEditor();
}


let colorEl=document.getElementById('matColor');
let emissionColorEl=document.getElementById('matEmissionColor');
let emissionStrengthEl=document.getElementById('matEmissionStrength');
let noTargetEl=document.getElementById('noTarget');

function updateEditor() {
    if (targetShapeIndex==-1) {
        noTargetEl.hidden=false;
    } else {
        noTargetEl.hidden=true;
        let target=scene[targetShapeIndex];
        colorEl.value            = rgbToHex(target.mat.color(emptyHitInfo));
        emissionColorEl.value    = rgbToHex(target.mat.emissionColor);
        emissionStrengthEl.value = target.mat.emissionStrength;
    }
}

colorEl.onchange=emissionColorEl.onchange=emissionStrengthEl.onchange=(ev)=>{
    // scene[targetShapeIndex].mat.color=hexToRgb(colorEl.value);
    scene[targetShapeIndex].mat.emissionColor=hexToRgb(emissionColorEl.value);
    scene[targetShapeIndex].mat.emissionStrength=parseFloat(emissionStrengthEl.value);
}


