import * as THREE from 'three';
import Polygon from './polygon';
import groupBy from 'lodash/groupBy';
import { normalToString } from '../utils';


function shapeFromPoints(points) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach( ([x, y]) => shape.lineTo(x, y));
  return shape;
}

function extrudePoints(amount, points, holes=[]) {
  const shape = shapeFromPoints(points);
  shape.holes = holes.map(hole => shapeFromPoints(hole));
  return new THREE.ExtrudeGeometry(shape, { amount, bevelEnabled: false });
}

export default class Entity extends THREE.Mesh {
  constructor() {
    super();
    this.polygons = [];

    this.profile = [
      [-2, 0],
      [2, 0],
      [2, 2],
      [0, 3.7],
      [-2, 2]
    ];

    this.geometry = extrudePoints(1.2, this.profile);
    this.material = new THREE.MeshNormalMaterial();

    this.bays = [true];

    this.prepend = this.prepend.bind(this);
    this.append = this.append.bind(this);

    this.makePolygons();
  }

  prepend(number=1) {
    if (number >= 0) {
      this.bays = [this.bays.length, ...this.bays];
    } else {
      this.bays = this.bays.slice(-number)
    }

    console.log(`prepend ${number}`, this.bays)
  }

  append(number=1) {
    if (number >= 0) {
      this.bays = [...this.bays, this.bays.length];
    } else {
      this.bays = this.bays.slice(0, number)
    }

    console.log(`append ${number}`, this.bays)
  }

  update() {
    this.geometry.boundingBox = null;
    this.geometry.boundingSphere = null;
    this.geometry.verticesNeedUpdate = true;
  }

  makePolygons() {
    const grouped = groupBy(this.geometry.faces, normalToString);
    this.polygons = Object.values(grouped).map(polygon =>
      new Polygon(this.geometry, polygon)
    );
    // console.log(this.polygons);
  }
}