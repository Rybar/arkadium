function rndInt(min, max) {
    if(max == null) {
        max = min || 1;
        min = 0;
    }
    return Math.floor( Math.random() * (max - min) + min );
}

function rndFloat(min, max) {
    if(max == null) {
        max = min || 1;
        min = 0;
    }
    return Math.random() * (max - min) + min;
}

function rndOneIn(max = 2){
    return rndInt(0,max) === 0;
}

function rndOneFrom(items){
    return items[rndInt(items.length)];
}

function distance (a,b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function clamp(x, min, max) {
    return Math.max(min, Math.min(x, max));
}

function mix(a, b, p) {
    return a * (1-p) + b * p;
}
export default {
    rndInt,
    rndFloat,
    rndOneIn,
    rndOneFrom,
    distance,
    clamp,
    mix
};

