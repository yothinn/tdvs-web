import { Component, Input, OnInit, Output } from '@angular/core';
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

	readonly PROVINCE_ALL_TEXT = "ทุกจังหวัด";

	provincesList;
	districtsList;
	disableDistrict = true;
	
	searchCtrl = new FormControl();

	// polygonZone;
	// polygonZoneList: string[] = [];
	
	@Input() showFilter: boolean = true;

	@Input() convenientDay: any[] = ['วันพุธ', 'วันพฤหัสบดี', 'วันเสาร์', 'วันอาทิตย์'];

	@Input() selectedProvince: string = '';

	@Input() selectedDistrict: string[] = [];

	// @Input() selectedZone: string[] = [];

	@Input() selectedConvenient: string[] = [];

	@Input() isShowMarkOnlySelect: boolean = false;
	@Input() isShowMarkOnlyAppoint: boolean = false;
	@Input() enableConvenient: boolean = false;
	/**
	 * Search text event
	 */
	@Output('search') searchEvent = new EventEmitter<string>();

	@Output() selectProvinceChange = new EventEmitter<string>();

	@Output() selectDistrictChange = new EventEmitter<any>();

	// @Output() selectZoneChange = new EventEmitter<string[]>();

	@Output() selectConvenientChange = new EventEmitter<any>();

	@Output() checkOptionChange = new EventEmitter<any>();

	constructor(
		private _postcodeService: PostcodeService,
		// private _polygonZoneService: PolygonZoneService,
	) { }

	ngOnInit() {

		this.selectedProvince = this.PROVINCE_ALL_TEXT;

		// get all province
		this._postcodeService.getProvincesList().subscribe(value => {
			if (value.data.length !== 0) {
				let list = value.data[0];
				// console.log(list.provinces);
				
				this.provincesList = list.provinces;
				this.provincesList.sort();
			}
		});

		// this.polygonZone = this._polygonZoneService.getPolygonZone();
		// this.polygonZone.map(value => this.polygonZoneList.push(value.name));
		// this.selectedZone = Array.from(this.polygonZoneList);
		this.selectedConvenient = Array.from(this.convenientDay);
		
		// select default province
		this.onProvinceChange();
		// console.log(this.zoneCtrl);
	}

	onSearch(event) {
		let searchStr = event.target.value;

		// console.log(searchStr);
		this.searchEvent.emit(searchStr);
	}

	onProvinceChange() {
		
		console.log(this.selectedProvince);
		if (this.selectedProvince === this.PROVINCE_ALL_TEXT) {
			this.disableDistrict = true;
		} else {
			this.disableDistrict = false;

			this._postcodeService.getProvincesList(this.selectedProvince).subscribe(value => {
				this.districtsList = value.data[0].districts;
				
				this.districtsList.sort();
	
				this.selectedDistrict = Array.from(this.districtsList);
			});
		}

		this.selectProvinceChange.emit(this.selectedProvince);
	}

	onDistrictChange() {
		let filterData = {
			province: this.selectedProvince,
			districtList : this.selectedDistrict,
			convenientList : this.enableConvenient ? this.selectedConvenient : null
		};

		// console.log(this.selectDistrictList);
		this.selectDistrictChange.emit(filterData);
	}

	onSelectDistrictAll(isSelectAll: boolean) {
		// console.log(isSelectAll);
		if (isSelectAll) {
			if (this.selectedDistrict.length !== this.districtsList.length) {
				// console.log("select all");
				this.selectedDistrict = Array.from(this.districtsList);
			}
		} else {
			this.selectedDistrict = [];
		}

		// console.log(this.selectDistrictList);
	}

	// onZoneChange() {
	// 	this.selectZoneChange.emit(this.selectedZone);
	// }

	// onSelectZoneAll(isSelectAll: boolean) {
	// 	if (isSelectAll) {
	// 		if (this.selectedZone.length !== this.polygonZoneList.length) {
	// 			this.selectedZone = Array.from(this.polygonZoneList);
	// 		}
	// 	} else {
	// 		this.selectedZone = [];
	// 	}
	// }

	onShowFilter() {
		this.showFilter = !this.showFilter;
		// console.log(this.showFilter);
	}

	onConvenientChange() {
		let filterData = {
			province: this.selectedProvince,
			districtList : this.selectedDistrict,
			convenientList : this.enableConvenient ? this.selectedConvenient : null
		};

		this.selectConvenientChange.emit(filterData);
	}

	onCheckShowMarkOnlySelect() {
		if (this.isShowMarkOnlySelect) {
			this.isShowMarkOnlyAppoint = false;
		}

		let option = {
			isShowMarkOnlySelect: this.isShowMarkOnlySelect,
			isShowMarkOnlyAppoint: this.isShowMarkOnlyAppoint
		}

		console.log(option);

		this.checkOptionChange.emit(option);
	}

	onCheckShowMarkOnlyAppoint() {
		if (this.isShowMarkOnlyAppoint) {
			this.isShowMarkOnlySelect = false;
		}

		let option = {
			isShowMarkOnlySelect: this.isShowMarkOnlySelect,
			isShowMarkOnlyAppoint: this.isShowMarkOnlyAppoint
		}

		console.log(option);

		this.checkOptionChange.emit(option);
	}

}
