class Camera {
    /**
     * @param {number} resX 
     * @param {number} resY 
     * @param {CameraTransform} transform 
     */
    constructor(fov,resX,resY,transform) {
        this.nearClipPlane=1;
        this.aspectRatio=resX/resY;
        
        this.transform=transform;
        this.resX=resX;
        this.resY=resY;

        this.topLeftLocal=new Vec3(0,0,0);
        
        this.fov=fov;
        this._pointLocal=new Vec3(0,0,0);
        this.cache={};
    }

    set fov(fov) {
        this.fieldOfView=fov;
        // Calculate projection plane
        this.planeHeight = this.nearClipPlane * Math.tan(fov * 0.5 * deg2Rad) * 2;
        this.planeWidth = this.planeHeight * this.aspectRatio;
        // Top-left corner of the camera plane
        // this.topLeftLocal = new Vec3(-this.planeWidth/2, this.planeHeight/2, this.nearClipPlane);
        this.topLeftLocal.x=-this.planeWidth/2;
        this.topLeftLocal.y=this.planeHeight/2;
        this.topLeftLocal.z=this.nearClipPlane;
    }

    get fov() {
        return this.fieldOfView;
    }
    
    /**
     * Get the direction of a ray for a certain pixel
     * @param {number} x 
     * @param {number} y 
     */
    getPixelDir(x,y) {
        if (`${x},${y}` in this.cache) {
            return this.cache[`${x},${y}`]
        }
        let tx = x / (this.resX); // 0 = left edge of plane, 1 = right edge
        let ty = y / (this.resY); // 0 = top edge of plane, 1 = bottom edge
    
        this.topLeftLocal.copyTo(this._pointLocal);
        this._pointLocal.addS(new Vec3(this.planeWidth * tx, this.planeHeight * ty - this.planeHeight, 0));
        
        // let point = 
        //     this.transform.right // this is usually transform.left
        //         .scale(-pointLocal.x) // but this works too (transform.left just calls this.scale(-1))
        //         .add(
        //             this.transform.up
        //             .scale(pointLocal.y)
        //             .add(
        //                 this.transform.forwards
        //                 .scale(pointLocal.z)
        //             )
        //         );

        // This does all of the math from above but all at once so it is faster.
        let point=new Vec3(
            this.transform.right.x * -this._pointLocal.x  +  this.transform.up.x * this._pointLocal.y  +  this.transform.forwards.x * this._pointLocal.z,
            this.transform.right.y * -this._pointLocal.x  +  this.transform.up.y * this._pointLocal.y  +  this.transform.forwards.y * this._pointLocal.z,
            this.transform.right.z * -this._pointLocal.x  +  this.transform.up.z * this._pointLocal.y  +  this.transform.forwards.z * this._pointLocal.z
        )

        point.normalizeS();

        this.cache[`${x},${y}`]=point;
        
        return point;
    }
}
