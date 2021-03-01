import { Component, Input, OnInit, Output, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PolygonZoneService } from 'app/services/polygon-zone.service';
import { PostcodeService } from 'app/services/postcode.service';

@Component({
	selector: 'app-search-filters-data',
	templateUrl: './search-filters-data.component.html',
	styleUrls: ['./search-filters-data.component.scss']
})
export class SearchFiltersDataComponent implements OnInit {

	readonly PROVINCE_ALL_TXT = "ทุกจังหวัด";
	readonly DISTRICT_ALL_TXT = "ทุกเขต";

	provincesList;
	districtsList;

	provinceCtrl;
	districtCtrl;
	searchCtrl;
	zoneCtrl;

	polygonZone;

	/**
	 * Search text event
	 */
	@Input() selectdProvince: string = '';

	@Output('search') searchEvent = new EventEmitter<string>();

	@Output() selectProvinceChange = new EventEmitter<string>();

	@Output() selectDistrictChange = new EventEmitter<string[]>();

	@Output() selectZzoneChange = new EventEmitter<string[]>();

	constructor(
		private _postcodeService: PostcodeService,
		private _polygonZoneService: PolygonZoneService,
	) { }

	ngOnInit() {
		this._postcodeService.getProvincesList().subscribe(value => {
			if (value.data.length !== 0) {
				let list = value.data[0];
				// console.log(list.provinces);

				list.provinces.sort();
				
				this.provincesList = [ this.PROVINCE_ALL_TXT, ...list.provinces];

				this.districtsList = list.districts;
				this.districtsList.sort();
				
				this.districtCtrl.value = this.districtsList;
				// console.log(this.districtsList);

				this.selectdProvince = this.selectdProvince === '' ? this.PROVINCE_ALL_TXT : this.selectdProvince;
				this.provinceCtrl.value = this.selectdProvince;
				
			}
		});

		this.polygonZone = this._polygonZoneService.getPolygonZone();
		
		let selectZone = [];
		this.polygonZone.map(value => selectZone.push(value.name));

		// console.log(selectZone);
		

		
		this.provinceCtrl = new FormControl();
		
		this.searchCtrl = new FormControl();
		this.zoneCtrl = new FormControl(selectZone);
		this.districtCtrl = new FormControl();
		// console.log(this.zoneCtrl);
	}


	onSearch(event) {
		let searchStr = event.target.value;

		console.log(searchStr);

		this.searchEvent.emit(searchStr);
	}

	onProvinceChange(event) {
		let province = event.value;
		console.log(province);
		if (province === this.PROVINCE_ALL_TXT) {
			province = 'all';
		}

		this._postcodeService.getProvincesList(province).subscribe(value => {
			this.districtsList = value.data[0].districts;
			console.log(this.districtsList);
			this.districtsList.sort();

			this.districtCtrl.value = this.districtsList;
		});

		this.selectProvinceChange.emit(event.value);
	}

	onDistrictChange(event, ev) {
		let districtList = event.value;

		// if dis select other district , dis select all too
		if (!ev.active) {
			ev._selected = false;
		}
		
		console.log(districtList);

		this.selectDistrictChange.emit(districtList);
	}

	onSelectDistrictAll(ev) {
		if (ev._selected) {
			// console.log(this.districtsList);
			this.districtCtrl.setValue(this.districtsList);
			ev._selected = true;
		} else {
			console.log("deselect");
			this.districtCtrl.setValue([]);
			ev._selectd = false;
		}
	}

	onZoneChange(event) {

	}

}
