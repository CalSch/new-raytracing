class SceneObject {
    /**
     * @param {string} name 
     * @param {Material} mat
     */
    constructor(name, mat) {
        this.name = name;
        this.mat = mat;
    }
    /**
     * @param {Ray} ray 
     * @returns {HitInfo}
     */
    intersect(ray) {
        return new HitInfo(ray);
    }
}

class Sphere extends SceneObject {
    /**
     * 
     * @param {string} name 
     * @param {Vec3} pos 
     * @param {number} size 
     * @param {Material} mat Material 
     */
    constructor(name, pos, size, mat) {
        super(name, mat);
        this.pos = pos;
        this.size = size;
        this._offsetRayOrigin = new Vec3();
    }

    // Adapted from https://stackoverflow.com/questions/41727704/function-to-find-point-of-intersection-between-a-ray-and-a-sphere-javascript
    /** Returns whether the ray intersects the sphere
    * @param {Ray} ray
    * @returns {HitInfo}
    */
    intersect(ray) {
        let hitInfo = new HitInfo(ray);
        // this._offsetRayOrigin = ray.origin.sub(this.pos);
        ray.origin.copyTo(this._offsetRayOrigin);
        this._offsetRayOrigin.subS(this.pos);

        // From the equation: sqrLength(rayOrigin + rayDir * dst) = radius^2
        // Solving for dst results in a quadratic equation with coefficients:
        let a = ray.dir.dot(ray.dir); // a = 1 (assuming unit vector)
        // let a = 1;
        let b = 2 * this._offsetRayOrigin.dot(ray.dir);
        let c = this._offsetRayOrigin.dot(this._offsetRayOrigin) - this.size * this.size;
        // Quadratic discriminant
        let discriminant = b * b - 4 * a * c; 

        // No solution when d < 0 (ray misses sphere)
        if (discriminant >= 0) {
            // Distance to nearest intersection point (from quadratic formula)
            let dst = (-b - Math.sqrt(discriminant)) / (2 * a);

            // Ignore intersections that occur behind the ray
            if (dst >= 0) {
                hitInfo.hasHit = true;
                // hitInfo.hitPoint = ray.origin.add(ray.dir.scale(dst));
                hitInfo.hitPoint = ray.origin.scaleAndAdd(ray.dir,dst);
                // hitInfo.hitNormal = hitInfo.hitPoint.sub(this.pos).normalize();
                hitInfo.hitNormal = new Vec3(
                    ray.origin.x + ray.dir.x * dst - this.pos.x,
                    ray.origin.y + ray.dir.y * dst - this.pos.y,
                    ray.origin.z + ray.dir.z * dst - this.pos.z
                );
                hitInfo.hitNormal.normalizeS();
            }
        }
        return hitInfo;
    }
}

class Plane extends SceneObject {
    /**
     * @param {string} name
     * @param {Vec3} pos 
     * @param {Vec3} norm 
     * @param {Material} mat 
     */
    constructor(name, pos, norm, mat) {
        super(name, mat);
        this.pos = pos;
        this.norm = norm;
        this.v0 = new Vec3(0, 0, 0)
    }

    /**
     * @param {Ray} ray
     * @returns {HitInfo}
     */
    intersect(ray) {
        let info = new HitInfo(ray);
        let dist = 100;
        let denom = ray.dir.dot(this.norm);
        if (denom !== 0) {
            let t = -(ray.origin.dot(this.norm) + dist) / denom
            if (t < 0) {
                return info;
            }
            this.v0 = ray.dir.add(new Vec3(t));
            // return add(out, ray.pos, v0)
            info.hasHit = true;
            info.hitPoint = ray.origin.add(this.v0);
            info.hitNormal = this.norm;
            return info;
        } else if (this.norm.dot(ray.origin) + dist === 0) {
            info.hasHit = true;
            info.hitPoint = ray.origin;
            info.hitNormal = this.norm;
            return info;
        } else {
            return info;
        }
    }
}