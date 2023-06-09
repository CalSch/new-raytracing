let colors = {
    blue: new Vec3(83, 157, 230).scale(1 / 255),
    orange: new Vec3(230, 157, 83).scale(1 / 255),
    purple: new Vec3(117, 83, 230).scale(1 / 255),
    red: new Vec3(245, 56, 113).scale(1 / 255),
    sky: new Vec3(184, 190, 255).scale(1 / 255),
    sky2: new Vec3(107, 93, 179).scale(1 / 255),
    // sky2: new Vec3(235, 113, 52).scale(1 / 255),
    // sky: new Vec3(185, 41, 217).scale(1 / 255),
    // sky:    new Vec3( 255, 255, 255 ).scale(1/255),
    black: new Vec3(0, 0, 0).scale(1 / 255),
    sun: new Vec3(255, 180, 130).scale(1 / 155),
    green: new Vec3(55, 204, 122).scale(1 / 155),
    white: new Vec3(250, 250, 255).scale(1 / 155),
}

/** @type {Scene} */
let scene = new Scene([
    new Sphere(
        "ball1",
        new Vec3(0, 0, 10),
        1,
        new Material(
            (hit) => {
                return colors.white;
            },
            new Vec3(0.9, 0.9, 0.9), 0.98, 1,
        )
    ),
    new Sphere(
        "ball2",
        new Vec3(3.3, 0.5, 9.5),
        1.5,
        new Material(
            (hit) => {
                return colors.green;
            },
            // colors.blue,1,0.7,
        )
    ),
    new Sphere(
        "ball3",
        new Vec3(1, -0.2, 7),
        1.2,
        new Material(
            (hit) => {
                return colors.blue;
            },
            colors.white, 0.98, 0.1,
        )
    ),
    new Sphere(
        "floor",
        new Vec3(0, -201, 0),
        200,
        new Material(
            (hit) => {
                let scale = 200;
                let x = Math.floor(hit.hitNormal.x * scale);
                let y = Math.floor(hit.hitNormal.z * scale);
                if (x % 2 == 0 ^ y % 2 == 0)
                    return colors.purple
                else
                    return colors.red;
            },
            colors.purple, 0.5, 0.3
        )
    ),

    new Sphere(
        "sun",
        new Vec3(-5, 25, 5),
        10,
        new Material(
            (hit) => {
                return vec0;
            },
            vec1, 0, 0,
            colors.sun, 3,
        )
    ),

], new Material((ray) => {
    return lerpVec(colors.sky, colors.sky2, ray.dir.y);
}, 0, 0, 0, colors.black, 0.5));

class CastInfo {
    /**
     * 
     * @param {Ray} ray 
     * @param {SceneObject} obj 
     * @param {HitInfo} hit 
     */
    constructor(ray, obj, hit) {
        this.ray = ray;
        this.obj = obj;
        this.hit = hit;
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

    for (let shape of scene.objects) {
        let hit = shape.intersect(ray);
        if (!hit.hasHit) continue;
        if (closestDistance === null || closestDistance > hit.distance) {
            closestDistance = hit.distance;
            closestShape = shape;
            closestHit = hit;
        }
    }

    return new CastInfo(ray, closestShape, closestHit);
}

/**
 * 
 * @param {Ray} ray 
 * @returns {Vec3}
 */
function Trace(ray) {
    let rayColor = new Vec3(1, 1, 1);
    let incomingLight = new Vec3(0, 0, 0);
    let distance = 0;

    let diffuseDir = new Vec3(0, 0, 0);
    let specularDir = new Vec3(0, 0, 0);

    for (let i = 0; i < RAY_BOUNCE_LIMIT; i++) {
        let cast = castRay(ray);

        if (cast.hit.hasHit) {
            distance += cast.hit.distance;
            let mat = cast.obj.mat;

            ray.origin = cast.hit.hitPoint;

            // let diffuseDir = cast.hit.hitNormal.add(randomDirection());
            cast.hit.hitNormal.copyTo(diffuseDir);
            diffuseDir.addS(randomDirection());

            // specularDir = ray.dir.reflect(cast.hit.hitNormal);
            ray.dir.copyTo(specularDir);
            specularDir.reflectS(cast.hit.hitNormal);

            let isSpecularBounce = mat.specularProbability >= Math.random();
            // ray.dir = lerpVec(diffuseDir,specularDir, mat.smoothness * isSpecularBounce);
            lerpVecCopy(ray.dir, diffuseDir, specularDir, mat.smoothness * isSpecularBounce);
            // ray.dir.normalizeS();

            let emittedLight = mat.emissionColor.scale(mat.emissionStrength);
            incomingLight.addS(emittedLight.mul(rayColor));

            rayColor.mulS(lerpVec(mat.color(cast.hit), mat.specularColor, isSpecularBounce));
            // rayColor.addS(ray.dir);

            // Random early exit if ray colour is nearly 0 (can't contribute much to final result)
            let p = Math.max(rayColor.x, Math.max(rayColor.y, rayColor.z));
            if (Math.random() >= p) {
                break;
            }
            rayColor.scaleS(1 / p);
        } else {
            // ray.dir=randomDirection();
            let emittedLight = scene.skyMat.color(ray);
            emittedLight.scaleS(scene.skyMat.emissionStrength);
            emittedLight.mulS(rayColor);
            incomingLight.addS(emittedLight);
            // rayColor.mulS(skyMat.color(cast.hit));
            break;   
        }
    }

    // return new Vec3(distance/30,distance/30,distance/30);
    return incomingLight;
}

/**
 * 
 * @param {number} x
 * @param {number} y
 * @returns {Vec3} Color 
 */
function getPixelColor(x, y) {
    let ray = new Ray(
        cam.transform.pos,
        cam.getPixelDir(
            x + Math.random(),
            y + Math.random()
        )
    );
    let cast = castRay(ray);
    // return new Vec3(cast.hit.distance*5)
    return Trace(ray).scale(255);
    // return randomDirection().add(new Vec3(0.5,0.5,0.5)).scale(255);
}