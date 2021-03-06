import * as THREE from "three";

export const MouseButton = {
  PRIMARY: 1,
  SECONDARY: 2,
  WHEEL: 4
};

export function normalToString(face) {
  const { normal } = face;
  return [normal.x, normal.y, normal.z].join("");
}

export function getPosition(x, y, width, height) {
  return [x / width * 2 - 1, -(y / height) * 2 + 1];
}

export function checkForIntersection(event) {
  const [x, y] = getPosition(
    event.offsetX,
    event.offsetY,
    this.props.width,
    this.props.height
  );
  this.raycaster.setFromCamera({x, y}, this.camera);
  return this.raycaster.intersectObject(this.entity, true);
}

export function shapeFromPoints(points) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach( ([x, y]) => shape.lineTo(x, y));
  return shape;
}

export function extrudePoints(amount, points, holes=[]) {
  const shape = shapeFromPoints(points);
  shape.holes = holes.map(hole => shapeFromPoints(hole));
  return new THREE.ExtrudeGeometry(shape, { amount, bevelEnabled: false });
}

// export function centroid(geometry) {
//   geometry.computeBoundingBox();
//   var _centroid = new THREE.Vector3();
//   _centroid.addVectors( geometry.boundingBox.min, geometry.boundingBox.max );
//   _centroid.multiplyScalar( - 0.5 );
//   _centroid.applyMatrix4( mesh.matrixWorld );
// }

function _clampVal(input) {
  if (input > 0 && input < 0.00000001) return 0;
  else if (input < 0 && input > -0.00000001) return 0;
  // else if (input === -0) return 0;
  return input;
}

export function clampedNormal(normal) {
  return new THREE.Vector3(
    _clampVal(normal.x),
    _clampVal(normal.y),
    _clampVal(normal.z)
  );
}

export function get2DCoords(
  position,
  camera,
  width,
  height
) {
  let vector = position.project(camera);
  vector.x = (vector.x + 1) / 2 * width;
  vector.y = -(vector.y - 1) / 2 * height;
  return vector;
}
