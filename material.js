class Material {
    /** @type {(hit: HitInfo) => Vec3} */
    color;
    
    /**
     * @param {(hit: HitInfo) => Vec3} color 
     * @param {Vec3} emissionColor
     * @param {number} emissionStrength
     * @param {Vec3} specularColor 
     * @param {number} smoothness 
     * @param {number} specularProbability 
     */
    constructor(
        color,
        specularColor = vec1,smoothness = 0,specularProbability = 0,
        emissionColor = vec0,emissionStrength = 0,
    ) {
        this.color=color;
        this.emissionColor=emissionColor;
        this.emissionStrength=emissionStrength;
        this.specularColor=specularColor;
        this.smoothness=smoothness;
        this.specularProbability=specularProbability;
    }
}