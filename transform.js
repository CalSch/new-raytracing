class CameraTransform {
    /** @type {Vec3} */
    pos;
    /** @type {Vec3} */
    dir;

    /**
     * 
     * @param {Vec3} pos 
     * @param {Vec3} dir 
     * @param {Vec3} up 
     */
    constructor(pos,dir,up) {
        this.pos=pos;
        this.forwards  = dir;
        this.up        = up;
        // this.backwards = dir.scale(-1);
        this.right     = up.clone();
        this.right.rotate(90,dir);  
        // this.left      = dir.rotateY(-90);
        // this.down      = dir.rotateX(-90);
    }

    /**
     * 
     * @param {number} theta 
     * @param {Vec3} axis 
     */
    rotate(theta,axis) {
        // let q=new Rotation(theta,axis.x,axis.y,axis.z);
        this.forwards.rotate(theta,axis);
        this.right   .rotate(theta,axis);
        this.up      .rotate(theta,axis);
    }

    get left() {
        return this.right.scale(-1);
    }
    get down() {
        return this.up.scale(-1);
    }
    get backwards() {
        return this.forwards.scale(-1);
    }

    /** @readonly @type {Vec3} */
    right;
    /** @readonly @type {Vec3} */
    up;
    // /** @readonly @type {Vec3} */
    // backwards;
    // /** @readonly @type {Vec3} */
    // left;
    // /** @readonly @type {Vec3} */
    // down;

    // forwards() {
    //     return this.dir;
    // }

    // backwards() {
    //     return this.dir.mul(-1);
    // }
    
    // right() {
    //     return this.dir.rotateY(90);
    // }

    // left() {
    //     return this.dir.rotateY(-90);
    // }

    // up() {
    //     return this.dir.rotateX(90);
    // }

    // down() {
    //     return this.dir.rotateX(-90);
    // }

}