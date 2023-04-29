let colors={
    blue:   new Vec3( 83,  157, 230 ).scale(1/255),
    orange: new Vec3( 230, 157, 83  ).scale(1/255),
    purple: new Vec3( 117, 83,  230 ).scale(1/255),
    red:    new Vec3( 245, 56,  113 ).scale(1/255),
    sky:    new Vec3( 200, 200, 255 ).scale(1/255),
    sky2:   new Vec3( 107, 93,  179 ).scale(1/255),
    // sky:    new Vec3( 255, 255, 255 ).scale(1/255),
    black:  new Vec3( 0,   0,   0   ).scale(1/255),
    sun:    new Vec3( 255, 255, 200 ).scale(1/155),
    green:  new Vec3( 55,  204, 122 ).scale(1/155),
}

/** @type {SceneObject[]} */
let scene = [
    new Sphere(
        "ball1",
        new Vec3(0, 0, 10),
        1,
        new Material(
            (hit)=>{
                return colors.orange;
            },
            new Vec3(0.9,0.9,0.9),0.95,1,
        )
    ),
    new Sphere(
        "ball2",
        new Vec3(2.5, 0.5, 10),
        1.5,
        new Material(
            (hit)=>{
                return colors.green;
            },
            // colors.blue,1,0.7,
        )
    ),
    new Sphere(
        "floor",
        new Vec3(0, -201, 0),
        200,
        new Material(
            (hit)=>{
                let scale=100;
                let x=Math.floor(hit.hitNormal.x*scale);
                let y=Math.floor(hit.hitNormal.z*scale);
                if (x%2==0 ^ y%2==0)
                    return colors.purple
                else
                    return colors.red;
            },
            colors.purple,0.5,0.2
        )
    ),

    new Sphere(
        "sun",
        new Vec3(0, 0, 500),
        150,
        new Material(
            (hit)=>{
                return vec0;
            },
            vec1,0,0,
            colors.sun,30,
        )
    ),

];

/**
 * @param {Ray} ray 
 */
function getSkyColor(ray) {
    lerpVecCopy(temp,colors.sky,colors.sky2,ray.dir.y);
    return temp;
}

let skyMat=new Material(
    (_)=>{return vec0},
    vec0,0,0,
    colors.sky,0.7
)

class CastInfo {
    /**
     * 
     * @param {Ray} ray 
     * @param {SceneObject} obj 
     * @param {HitInfo} hit 
     */
    constructor(ray,obj,hit) {
        this.ray=ray;
        this.obj=obj;
        this.hit=hit;
    }
}

/**
 * Shoot a ray and get the closest SceneObject on it's path
 * @param {Ray} ray
 * @returns {CastInfo}
 */
function castRay(ray) {
    /** @type {number | null} */
    let closestDistance = null;
    /** @type {SceneObject | null} */
    let closestShape = null;
    /** @type {HitInfo} */
    let closestHit = new HitInfo();

    for (let shape of scene) {
        let hit = shape.intersect(ray);
        if (!hit.hasHit) continue;
        if (closestDistance === null || closestDistance > hit.distance) {
            closestDistance = hit.distance;
            closestShape = shape;
            closestHit = hit;
        }
    }

    return new CastInfo(ray,closestShape,closestHit);
}

/**
 * 
 * @param {Ray} ray 
 * @returns {Vec3}
 */
function Trace(ray) {
    let rayColor = new Vec3(1,1,1);
    let incomingLight = new Vec3(0,0,0);

    for (let i=0;i<RAY_BOUNCE_LIMIT;i++) {
        let cast = castRay(ray);

        if (cast.hit.hasHit) {
            let mat=cast.obj.mat;

            ray.origin=cast.hit.hitPoint;
            let diffuseDir = cast.hit.hitNormal.add(randomDirection());
            let specularDir = ray.dir.reflect(cast.hit.hitNormal);
            let isSpecularBounce = Math.random() <= mat.specularProbability;
            ray.dir = lerpVec(diffuseDir,specularDir, mat.smoothness * isSpecularBounce);
            ray.dir.normalizeS();

            let emittedLight = mat.emissionColor.scale(mat.emissionStrength);
            incomingLight.addS(emittedLight.mul(rayColor));
            
            rayColor.mulS( lerpVec( mat.color(cast.hit), mat.specularColor, isSpecularBounce ));
        } else {
            let emittedLight = getSkyColor(ray).scale(skyMat.emissionStrength);
            incomingLight.addS(emittedLight.mul(rayColor));
            // rayColor.mulS(skyMat.color(cast.hit));
            break;
        }
    }

    return incomingLight;
}

/**
 * 
 * @param {number} x
 * @param {number} y
 * @returns {Vec3} Color 
 */
function getPixelColor(x,y) {
    let ray = new Ray(
        cam.transform.pos,
        cam.getPixelDir(x,y)
    );
    return Trace(ray).scale(255);
    // return randomDirection().add(new Vec3(0.5,0.5,0.5)).scale(255);
}