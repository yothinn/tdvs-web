import { Injectable } from '@angular/core';
import { polygonZone } from './polygon-zone';

@Injectable({
	providedIn: 'root'
})
export class PolygonZoneService {

	constructor() { }

	getPolygonZone(): Object {
		return polygonZone;
	}

	/**
	   * Find point is in polygon path or not
	   * @param polygonPath 
	   * @param point 
	   */
	isPointInPolygon(polygonPath, point): boolean {
		let i, j;
		let inside = false;
		let x = point.lat;
		let y = point.lng;

		for (i = 0, j = polygonPath.length - 1; i < polygonPath.length; j = i++) {
			// console.log(`i : ${i} j: ${j}`);
			let xi = polygonPath[i].lat;
			let yi = polygonPath[i].lng;

			let xj = polygonPath[j].lat;
			let yj = polygonPath[j].lng;

			let intersect = ((yi > y) != (yj > y)) &&
				(x < (xj - xi) * (y - yi) / (yj - yi) + xi);

			if (intersect) inside = !inside;
		}
		return inside;
	}


}
