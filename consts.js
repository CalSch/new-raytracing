const deg2Rad=Math.PI/180;
const rad2Deg=180/Math.PI;

const vec0=new Vec3(0,0,0);
const vec1=new Vec3(1,1,1);

const emptyHitInfo = new HitInfo();

let RAY_BOUNCE_LIMIT=5;
const MAX_SAMPLES=20;


let previewPixSkip=5;
let temp=new Vec3(0,0,0);