/**
 * Linearly interpolate between `a` and `b` with a distance of `t`
 * @param {number} a
 * @param {number} b 
 * @param {number} t 
 * @returns {number}
 */
function lerp(a,b,t) {
    return a * (1 - t) + (b * t);
}

/**
 * Linearly interpolate between `a` and `b` with a distance of `t`
 * @param {Vec3} a
 * @param {Vec3} b 
 * @param {number} t 
 * @returns {Vec3}
 */
function lerpVec(a,b,t) {
    return new Vec3(
        lerp(a.x,b.x,t),
        lerp(a.y,b.y,t),
        lerp(a.z,b.z,t)
    )
}

/**
 * Linearly interpolate between `a` and `b` with a distance of `t`
 * @param {Vec3} out
 * @param {Vec3} a
 * @param {Vec3} b 
 * @param {number} t 
 */
function lerpVecCopy(out,a,b,t) {
    out.x=lerp(a.x,b.x,t),
    out.y=lerp(a.y,b.y,t),
    out.z=lerp(a.z,b.z,t)
}