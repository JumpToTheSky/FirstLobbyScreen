function getCircleWorldData(circleCollider) {
    let node = circleCollider.node;
    let worldCenter = node.convertToWorldSpaceAR(circleCollider.offset);
    let radius = circleCollider.radius;
    return { worldCenter, radius, node, type: "Circle" };
}

function getBoxWorldData(boxCollider) {
    let node = boxCollider.node;
    let worldCenter = node.convertToWorldSpaceAR(boxCollider.offset);
    let size = boxCollider.size;

    let halfWidth = size.width / 2;
    let halfHeight = size.height / 2;

    let minX = worldCenter.x - halfWidth;
    let maxX = worldCenter.x + halfWidth;
    let minY = worldCenter.y - halfHeight;
    let maxY = worldCenter.y + halfHeight;
    return { worldCenter, size, minX, maxX, minY, maxY, node, type: "Box" };
}

function getTouchPointBoxBox(boxAData, boxBData) {
    let TouchMinX = Math.max(boxAData.minX, boxBData.minX);
    let TouchMaxX = Math.min(boxAData.maxX, boxBData.maxX);
    let TouchMinY = Math.max(boxAData.minY, boxBData.minY);
    let TouchMaxY = Math.min(boxAData.maxY, boxBData.maxY);

    let collisionPointX = (TouchMinX + TouchMaxX) / 2;
    let collisionPointY = (TouchMinY + TouchMaxY) / 2;

    return new cc.Vec2(collisionPointX, collisionPointY);
}

function getTouchPointCircleCircle(circleAData, circleBData) {
    let centerA = circleAData.worldCenter;
    let radiusA = circleAData.radius;
    let centerB = circleBData.worldCenter;
    let radiusB = circleBData.radius;

    let vectorFromAtoB = centerB.sub(centerA);

    if (vectorFromAtoB.magSqr() < 0.0001) {
        return centerA.clone(); 
    }
    
    let normalizedVecAB = vectorFromAtoB.normalize();

    let pointAOnSurface = centerA.add(normalizedVecAB.mul(radiusA));
    let pointBOnSurface = centerB.sub(normalizedVecAB.mul(radiusB));

    return pointAOnSurface.add(pointBOnSurface).mul(0.5);
}

function getTouchPointBoxCircle(boxData, circleData) {
    let circleCenter = circleData.worldCenter;
    let circleRadius = circleData.radius;

    let closestX = Math.max(boxData.minX, Math.min(circleCenter.x, boxData.maxX));
    let closestY = Math.max(boxData.minY, Math.min(circleCenter.y, boxData.maxY));
    let closestPointOnBox = new cc.Vec2(closestX, closestY);

    let vectorFromCircleToBoxPoint = closestPointOnBox.sub(circleCenter);

    if (vectorFromCircleToBoxPoint.magSqr() < 0.0001) {
        return closestPointOnBox.add(circleCenter).mul(0.5);
    }

    let directionToBoxPoint = vectorFromCircleToBoxPoint.normalize();
    let pointOnCircleSurface = circleCenter.add(directionToBoxPoint.mul(circleRadius));

    return closestPointOnBox.add(pointOnCircleSurface).mul(0.5);
}

function getTouchPoint(colliderA, colliderB) {
    let dataA, dataB;

    if (colliderA instanceof cc.BoxCollider) {
        dataA = getBoxWorldData(colliderA);
    } else if (colliderA instanceof cc.CircleCollider) {
        dataA = getCircleWorldData(colliderA);
    }

    if (colliderB instanceof cc.BoxCollider) {
        dataB = getBoxWorldData(colliderB);
    } else if (colliderB instanceof cc.CircleCollider) {
        dataB = getCircleWorldData(colliderB);
    }

    if (dataA.type === "Box" && dataB.type === "Box") {
        return getTouchPointBoxBox(dataA, dataB);
    } else if (dataA.type === "Circle" && dataB.type === "Circle") {
        return getTouchPointCircleCircle(dataA, dataB);
    } else if (dataA.type === "Box" && dataB.type === "Circle") {
        return getTouchPointBoxCircle(dataA, dataB);
    } else if (dataA.type === "Circle" && dataB.type === "Box") {
        return getTouchPointBoxCircle(dataB, dataA);
    }
}

module.exports = {
    getTouchPoint,
};