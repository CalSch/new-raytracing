class Ray {
    /**
     * 
     * @param {Vec3} origin 
     * @param {Vec3} dir 
     */
    constructor(origin, dir) {
        this.origin = origin;
        this.dir = dir.clone();
    }
}

class HitInfo {
    /** @type {Vec3 | null} */
    hitPoint;
    /** @type {Vec3 | null} */
    hitNormal;

    /**
     * @param {Ray} ray
     * @param {boolean} hasHit
     * @param {Vec3 | null} hitPoint 
     * @param {Vec3 | null} hitNormal 
     */
    constructor(ray, hasHit=false, hitPoint=null, hitNormal=null) {
        this.ray = ray;
        this.hasHit = hasHit;
        this.hitPoint = hitPoint;
        this.hitNormal = hitNormal;
    }
    get distance() {
        if (this.hitPoint===null) return null;
        this.hitPoint.subS(this.ray.origin); // use subS and addS to save memory
        let l=this.hitPoint.length();
        this.hitPoint.addS(this.ray.origin);
        return l;
    }

    // set distance(x) {

    // }
}

function randWithNormalDist() {
    // return Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random())
    let theta = 2 * 3.1415926 * Math.random();
    let rho = Math.sqrt(-2 * Math.log(Math.random()));
    return rho * Math.cos(theta);
}

function randomDirection() {
    temp.x=randWithNormalDist();
    temp.y=randWithNormalDist();
    temp.z=randWithNormalDist();
    temp.normalizeS();
    return temp.clone();
}

/**
 * 
 * @param {Ray} ray 
 * @param {Vec3} boxMin 
 * @param {Vec3} boxMax 
 */
function rayBoundingBox(ray,boxMin,boxMax) {
    let tMin=new Vec3(
        (boxMin.x - ray.origin.x) / ray.dir.x,
        (boxMin.y - ray.origin.y) / ray.dir.y,
        (boxMin.z - ray.origin.z) / ray.dir.z,
    );
    let tMax=new Vec3(
        (boxMax.x - ray.origin.x) / ray.dir.x,
        (boxMax.y - ray.origin.y) / ray.dir.y,
        (boxMax.z - ray.origin.z) / ray.dir.z,
    );
    let t1=vecFunc(tMin,tMax,Math.min);
    let t2=vecFunc(tMin,tMax,Math.max);
    let tNear=Math.max(t1.x,t1.y,t1.z);
    let tFar=Math.min(t2.x,t2.y,t2.z);
    return tNear <= tFar;
}