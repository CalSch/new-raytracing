// Rotation and Quaternion code from https://www.sololearn.com/compiler-playground/W1gA0D3VnzW5/
class Quaternion {
	constructor(r, i, j, k) {
		this.r = r;
		this.i = i;
		this.k = k;
		this.j = j;
	}
	static mult(q1, q2) {
		var r = q1.r * q2.r - q1.i * q2.i - q1.j * q2.j - q1.k * q2.k;
		var i = q1.r * q2.i + q1.i * q2.r + q1.j * q2.k - q1.k * q2.j;
		var j = q1.r * q2.j - q1.i * q2.k + q1.j * q2.r + q1.k * q2.i;
		var k = q1.r * q2.k + q1.i * q2.j - q1.j * q2.i + q1.k * q2.r;
		return new Quaternion(r, i, j, k);
	}
	static inv(q) {
		return new Quaternion(q.r, -q.i, -q.j, -q.k);
	}
}

function Rotation(angle, x, y, z) {
	const scaleFactor = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
	const c = Math.sin(angle / 2) / (scaleFactor || 1);
	return new Quaternion(Math.cos(angle / 2), c * x, c * y, c * z);
}


/**
 * A 3D vector
 */
class Vec3 {
    /** @type {number} */
    x;
    /** @type {number} */
    y;
    /** @type {number} */
    z;

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    constructor(x,y,z) {
        this.x=x;
        this.y=y;
        this.z=z;
    }

    clone() {
        return new Vec3(this.x,this.y,this.z);
    }

    copyTo(vec) {
        vec.x=this.x;
        vec.y=this.y;
        vec.z=this.z;
    }

    // #region math
    /**
     * Add vectors
     * @param {Vec3} v 
     * @returns {Vec3}
     */
    add(v) {
        return new Vec3(
            this.x + v.x,
            this.y + v.y,
            this.z + v.z
        );
    }

    /**
     * Subtract vectors
     * @param {Vec3} v 
     * @returns {Vec3}
     */
    sub(v) {
        return new Vec3(
            this.x - v.x,
            this.y - v.y,
            this.z - v.z
        );
    }

    /**
     * Multiply vectors
     * @param {Vec3} v 
     * @returns {Vec3}
     */
    mul(v) {
        return new Vec3(
            this.x * v.x,
            this.y * v.y,
            this.z * v.z
        );
    }

    /**
     * Scale a vector
     * @param {number} v 
     * @returns {Vec3}
     */
    scale(v) {
        return new Vec3(
            this.x * v,
            this.y * v,
            this.z * v
        );
    }

    /**
     * Divide vectors
     * @param {Vec3} v 
     * @returns {Vec3}
     */
    div(v) {
        return new Vec3(
            this.x / v.x,
            this.y / v.y,
            this.z / v.z
        );
    }

    /**
     * Get the dot product of 2 vectors
     * @param {Vec3} v 
     * @returns {number}
     */
    dot(v) {
        return this.x * v.x +
               this.y * v.y +
               this.z * v.z;
    }

    /**
     * Cross 2 vectors
     * @param {Vec3} v 
     * @returns {Vec3}
     */
    cross(v) {
        return new Vec3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    /**
     * Get this vector's length
     * @returns {number}
     */
    length() {
        return Math.sqrt(this.x * this.x +
                         this.y * this.y +
                         this.z * this.z);
    }

    /**
     * Normalize this vector
     * @returns {Vec3}
     */
    normalize() {
        let len = this.length();
        return new Vec3(
            this.x / len,
            this.y / len,
            this.z / len
        );
    }

    /**
     * Scale and add vector
     * @param {Vec3} v 
     * @param {number} s 
     * @returns {Vec3}
     */
    scaleAndAdd(v,s) {
        return new Vec3(
            this.x + ( v.x * s),
            this.y + ( v.y * s),
            this.z + ( v.z * s)
        );
    }

    /**
     * Get the squared distance between two vectors
     * @param {Vec3} v 
     * @returns {number}
     */
    squaredDistance(v) {
        return (v.x-this.x)**2 + (v.y-this.y)**2 + (v.x-this.y)**2;
    }

    /**
     * Rotates a vector around the Z axis `theta` degrees
     * @param {number} theta
     * @returns {Vec3} The rotated vector
     */
    rotateZ(theta) {
        theta*=deg2Rad;
        return new Vec3(
            this.x * Math.cos(theta) - this.y * Math.sin(theta),
            this.x * Math.sin(theta) + this.y * Math.cos(theta),
            this.z,
        )
    }

    /**
     * Rotates a vector around the Y axis `theta` degrees
     * @param {number} theta
     * @returns {Vec3} The rotated vector
     */
    rotateY(theta) {
        theta*=deg2Rad;
        return new Vec3(
             this.x * Math.cos(theta) + this.z * Math.sin(theta),
             this.y,
            -this.x * Math.sin(theta) + this.z * Math.cos(theta),
        )
    }

    /**
     * Rotates a vector around the X axis `theta` degrees
     * @param {number} theta
     * @returns {Vec3} The rotated vector
     */
    rotateX(theta) {
        theta*=deg2Rad;
        return new Vec3(
            this.x,
            this.y * Math.cos(theta) - this.z * Math.sin(theta),
            this.y * Math.sin(theta) + this.z * Math.cos(theta),
        )
    }

    /**
     * 
     * @param {number} theta 
     * @param {Vec3} axis 
     */
    rotate(theta,axis) {
        theta *= deg2Rad;
        let rotation=new Rotation(theta,axis.x,axis.y,axis.z);
		var q = Quaternion.mult(Quaternion.mult(rotation, new Quaternion(this.length(),this.x,this.y,this.z)), Quaternion.inv(rotation));
		this.x = q.i;
		this.y = q.j;
		this.z = q.k;
	}

    /**
     * Reflect this vector on a normal
     * @param {Vec3} norm 
     */
    reflect(norm) {
        norm.copyTo(temp);
        temp.normalizeS();
        let p=new Vec3(this.x,this.y,this.z);

        p.subS(temp.scale(2 * this.dot(temp)));
        return p;
    }

    //#endregion

    //#region self math

    /**
     * Add vectors
     * @param {Vec3} v 
     * @returns {Vec3}
     */
    addS(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
    }

    /**
     * Subtract vectors
     * @param {Vec3} v 
     * @returns {Vec3}
     */
    subS(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
    }

    /**
     * Multiply vectors
     * @param {Vec3} v 
     * @returns {Vec3}
     */
    mulS(v) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
    }

    /**
     * Scale a vector
     * @param {number} v 
     * @returns {Vec3}
     */
    scaleS(v) {
        this.x *= v;
        this.y *= v;
        this.z *= v;
    }

    /**
     * Divide vectors
     * @param {Vec3} v 
     * @returns {Vec3}
     */
    divS(v) {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
    }

    /**
     * Cross 2 vectors
     * @param {Vec3} v 
     * @returns {Vec3}
     */
    crossS(v) {
        this.x = this.y * v.z - this.z * v.y;
        this.y = this.z * v.x - this.x * v.z;
        this.z = this.x * v.y - this.y * v.x;
    }

    /**
     * Normalize this vector
     * @returns {Vec3}
     */
    normalizeS() {
        let len = this.length();
        this.x /= len;
        this.y /= len;
        this.z /= len;
    }

    /**
     * Scale and add vector
     * @param {Vec3} v 
     * @param {number} s 
     * @returns {Vec3}
     */
    scaleAndAddS(v,s) {
        this.x += ( v.x * s);
        this.y += ( v.y * s);
        this.z += ( v.z * s);
    }

    /**
     * Reflect this vector on a normal
     * @param {Vec3} norm 
     */
    reflectS(norm) {
        norm.copyTo(temp);
        temp.normalizeS();
        let p=new Vec3(this.x,this.y,this.z);

        temp.scaleS(2 * this.dot(temp));
        p.subS(temp);
        p.copyTo(this);
    }

    //#endregion

    toString() {
        return `${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)}`
    }
    /**
     * @param {string} s 
     * @returns {Vec3}
     */
    static fromString(s) {
        let nums=s.split(", ");
        return new Vec3(
            parseFloat(nums[0]),
            parseFloat(nums[1]),
            parseFloat(nums[2]),
        )
    }
}

/**
 * @param {number} min
 * @param {number} max
 * @param {Vec3} vec
 */
function clampVec(min,max,vec) {
    return new Vec3(
        Math.min(Math.max(vec.x,min),max),
        Math.min(Math.max(vec.y,min),max),
        Math.min(Math.max(vec.z,min),max)
    )
}