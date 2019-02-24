import math from "./math.js";

function center (entity) {
    const { pos, w, h } = entity;
    return {
        x: pos.x + w / 2,
        y: pos.y + h / 2
    };
}

function distance (a,b) {
    return math.distance(center(a), center(b));
}

function bounds(entity) {
    const { w, h, pos, hitBox } = entity;
     //if entity doesn't have a separate hitbox, we just use the the position and size
    const hit = hitBox || {x: 0, y: 0, w, h }

    return  {
        x: hit.x + pos.x,
        y: hit.y + pos.y,
        w: hit.w -1,
        h: hit.h -1
    };
}

function hit(e1, e2){
    const a = bounds(e1);
    const b = bounds(e2);
    return a.x + a.w >= b.x &&
    a.x <= b.x + b.w &&
    a.y + a.h >= b.y &&
    a.y <= b.y + b.h;
}

function hits(entity, container, hitCallBack) {
    const a = bounds(entity);
    container.map(e2 => {
        const b = bounds(e2);
        if(
            a.x + a.w >= b.x &&
            a.x <= b.x + b.w &&
            a.y + a.h >= b.y &&
            a.y <= b.y + b.h
        ) {
            hitCallBack(e2, container);
        }
    });
}

export default {
    center,
    distance,
    bounds,
    hit,
    hits
};