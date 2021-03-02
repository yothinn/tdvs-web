import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from "@angular/core";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { fuseAnimations } from "@fuse/animations";

import { locale as english } from "../i18n/en";
import { locale as thai } from "../i18n/th";

import { JoborderService } from "../services/joborder.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Socket } from "ngx-socket-io";
import { MatDialog } from "@angular/material/dialog";
import * as moment from "moment";
import { SelectCarAndDateComponent } from "../select-car-and-date/select-car-and-date.component";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { RejectReasonModalComponent } from '../reject-reason-modal/reject-reason-modal.component';
import { PolygonZoneService } from "app/services/polygon-zone.service";
import { ContactStatus } from '../../../types/tvds-status'

@Component({
	selector: "app-joborder-form",
	templateUrl: "./joborderForm.component.html",
	styleUrls: ["./joborderForm.component.scss"],
	encapsulation: ViewEncapsulation.None,
	animations: fuseAnimations,
})
export class JoborderFormComponent implements OnInit, OnDestroy {
	joborderData: any = {};
	vehicleData: Array<any> = [];

	// All Marker
	markersData: Array<any> = [];

	// Filter marker when user filter zone, province, district
	filterData: Array<any> = [];
	tmpFilterData = null;

	// draw marker is in boundary
	boundMarker: Array<any> = [];
	
	isShowMarkOnlySelect = false;
	isShowMarkOnlyAppoint = false;

	polygonZone;

	openedWindow: number = 0;

	convenientDayList = [
		{
			weekDay: 3,
			displayDay: 'วันพุธ'
		},
		{
			weekDay: 4,
			displayDay: 'วันพฤหัสบดี'
		},
		{
			weekDay: 6,
			displayDay: 'วันเสาร์'
		},
		{
			weekDay: 0,
			displayDay: 'วันอาทิตย์'
		}
	]
	sideNaveOpened: Boolean = false;

	titleDate: any;
	nameDate: any;

	zoom: number = 10;
	lat: number = 13.6186285;
	lng: number = 100.5078163;

	@ViewChild('agmMap') agmMap: any;

	boundChangeTimer;
	districtChangeTimer;
	convenientChangeTimer;
	//infoWindowOpened = null;
	//previous_info_window = null;

	constructor(
		private _fuseTranslationLoaderService: FuseTranslationLoaderService,
		private joborderService: JoborderService,
		private _polygonZoneService: PolygonZoneService,
		private route: ActivatedRoute,
		private router: Router,
		public dialog: MatDialog,
		private _snackBar: MatSnackBar,
		private socket: Socket,
		private spinner: NgxSpinnerService,
	) {
		this._fuseTranslationLoaderService.loadTranslations(english, thai);
	}

	ngOnInit(): void {

		this.socket.connect();

		this.joborderData = this.route.snapshot.data.items
			? this.route.snapshot.data.items.data
			: {
				docno: "",
				docdate: "",
				carNo: "",
				cusAmount: null,
				orderStatus: "draft",
				contactLists: [],
			};
		// console.log(this.joborderData);

		this.formatMoment(this.joborderData.docdate);
		this.sideNaveOpened = true;
		this.zoom = 13;
		if (this.joborderData.contactLists.length > 0) {
			this.lat = Number(this.joborderData.contactLists[0].latitude);
			this.lng = Number(this.joborderData.contactLists[0].longitude);
		}

		this.getVehicleData();

		this.polygonZone = this._polygonZoneService.getPolygonZone();

		this.socket.on("user-confirm-reject", (message: any) => {
			// console.log(message);
			if (message.docno === this.joborderData.docno) {
				this.joborderData = message;
				this.socketUpdateMarkerOnMap();
			}
		});

		// console.log(this.markersData);

		this.spinner.hide();
	}

	ngOnDestroy() {
		this.socket.disconnect();
	}

	isShowMarker(marker): boolean {
		if (this.isShowMarkOnlyAppoint || this.isShowMarkOnlySelect) {
			if (this.isShowMarkOnlySelect) {
				// Filter in contactList
				// !! it couldn't use markder.contactStatus because it combine marker in other bill but in day
				let pos = this.joborderData.contactLists.findIndex(item => {
					return item.displayName === marker.displayName;
				});
				return pos >= 0;
			} else if (this.isShowMarkOnlyAppoint) {
				let pos = this.joborderData.contactLists.findIndex(item => {
					return ((item.contactStatus !== '') && (item.contactStatus !== ContactStatus.DriverReject) &&
							(item.contactStatus !== ContactStatus.Reject) && (item.displayName === marker.displayName) );
				})
				return pos >= 0;
			}
		} else {
			if (marker.longitude || marker.latitude) {
				return true;
			}	
		}
		return false;
	}
	

	socketUpdateMarkerOnMap() {
		this.joborderData.contactLists.forEach((contact) => {
			// console.log(contact.contactStatus.substring(0,1).toUpperCase());
			let label = contact.contactStatus.substring(0, 1).toUpperCase();
			if (contact.contactStatus === "waitcontact") {
				label = "S";
			}
			this.findOnMap(contact, label);
		});
	}

	getVehicleData() {
		this.joborderService
			.getVehicleData()
			.then((res) => {
				this.vehicleData = res;

				// พี่โก๋ปรับให้ Modal เฉพาะกรณีสร้างใหม่
				if (this.joborderData.docno === "") {
					this.openCarAndDate();
				} else {
					let docdate = {
						docdate: this.joborderData.docdate,
					};
					this.getMarkerData(docdate);
				}

				this.spinner.hide();
			})
			.catch((err) => {
				// console.log(err);
				// TODO : throw error
				this.spinner.hide();
			});
	}

	openCarAndDate(): void {
		const dialogRef = this.dialog.open(SelectCarAndDateComponent, {
			width: "350px",
			disableClose: true,
			data: {
				carNo: this.joborderData.carNo,
				docdate: this.joborderData.docdate,
				cars: this.vehicleData,
				docno: this.joborderData.docno,
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.spinner.show();
				this.joborderData.carNo = result.carNo;
				this.joborderData.docdate = result.docdate;
				this.formatMoment(result.docdate);
				// console.log(this.joborderData);

				let docdate = {
					docdate: result.docdate,
				};
				// console.log(docdate);
				if (!this.joborderData._id) {
					this.getMarkerData(docdate);
				} else {
					// this.spinner.hide();
					this.onSave();
				}
			} else {
				if (!this.joborderData._id) {
					this.router.navigateByUrl("/joborder/list");
				}
			}
		});
	}

	formatMoment(date) {
		this.titleDate = moment(date).format("DD/MM/YYYY");
		this.nameDate = moment(date).format("dddd");
	}

	async getMarkerData(docdate) {
		this.markersData = await this.joborderService.getMarkerDataList(docdate);
		this.filterData = [ ...this.markersData];

		// console.log(this.agmMap._mapsWrapper.getBounds());
		this.redrawBound();

		this.spinner.hide();
	}

	/**
	 * when click marker, show customer info in map page  
	 */
	// clickedInfoWindow(infoWindow) {

	// 	try {
	// 		if (this.previous_info_window) {
	// 			this.previous_info_window.close();
	// 		}
	// 		this.previous_info_window = infoWindow;
	// 	} catch (error) {
	// 		// this.previous_info_window.close();
	// 		this.previous_info_window = null;
	// 	}
	// }

	closeInfoWindow() {
		this.openedWindow = 0;
		// if (this.previous_info_window != null) {
		// 	this.previous_info_window.close();
		// }
		// this.previous_info_window = null;
	}

	openWindow(id) {
		this.openedWindow = id;
	}

	isInfoWindowOpen(id) {
		return this.openedWindow === id;
	}

	clickedMarker(item: any, index: number) {
		if (item.contactStatus === "") {
			let mIndex = this.joborderData.contactLists.findIndex((el) => {
				return el._id === item._id;
			});

			let defaultStatus = "select";

			if (!item.lineUserId) {
				defaultStatus = "waitcontact";
			}

			if (mIndex === -1) {
				let itemList = {
					_id: item._id,
					contactStatus: defaultStatus,
					title: item.title,
					firstName: item.firstName,
					lastName: item.lastName,
					displayName: item.displayName,
					persanalId: item.persanalId,
					isShareHolder: item.isShareHolder,
					mobileNo1: item.mobileNo1,
					mobileNo2: item.mobileNo2,
					mobileNo3: item.mobileNo3,
					addressLine1: item.addressLine1,
					addressStreet: item.addressStreet,
					addressSubDistrict: item.addressSubDistrict,
					addressDistrict: item.addressDistrict,
					addressProvince: item.addressProvince,
					addressPostCode: item.addressPostCode,
					lineUserId: item.lineUserId,
					latitude: item.latitude,
					longitude: item.longitude,
				};
				// console.log(itemList)

				this.joborderData.contactLists.push(itemList);
				this.changeIconMarker(item, "S");
			}
			// console.log(this.joborderData.contactLists);

			item.docno = this.joborderData.docno;
			item.contactStatus = "S";
			this.closeInfoWindow();

			if (this.joborderData.contactLists.length > 0) {
				this.sideNaveOpened = true;
			}
			// พี่โก๋เพิ่มมาเพื่อให้ click info มาแล้ว Save เลยเพราะ เกิดปัญหาตอนลูกค้า confirm ผ่าน socket แล้วทำให้รายการหาย
			this.onSave();
		}
	}

	onDeleteList(index) {
		this.findOnMap(this.joborderData.contactLists[index], "");
		this.joborderData.contactLists.splice(index, 1);
		if (this.joborderData.contactLists.length === 0) {
			this.sideNaveOpened = false;
		}
		// พี่โก๋เพิ่มมาเพื่อให้ click info มาแล้ว Save เลยเพราะ เกิดปัญหาตอนลูกค้า confirm ผ่าน socket แล้วทำให้รายการหาย
		this.joborderService
			.updateJoborderData(this.joborderData._id, this.joborderData)
			.then((res) => {
				// console.log(res);
				this.joborderData = res;

				this.spinner.hide();

				this._snackBar.open("ลบจุดบริการเรียบร้อย", "", {
					duration: 7000,
				});
			})
			.catch((err) => {
				this.spinner.hide();
				this._snackBar.open("เกิดข้อผิดพลาดในการลบจุดบริการ", "", {
					duration: 7000,
				});
			});
	}

	/**
	 * change status joborder and show mark in map
	 * @param { string } status : status that want to change
	 * @param { number } i : customer index
	 */
	onChangeStatus(status, i) {
		if (this.joborderData.orderStatus === "draft") {
			this.joborderData.orderStatus = "waitapprove";
		}

		if (status === "sendLine") {
			this.joborderData.contactLists[i].contactStatus = "waitapprove";
			this.sendConFirm(this.joborderData.contactLists[i]);
			this.onSaveStatus("w");
			this.findOnMap(this.joborderData.contactLists[i], "W");
		}
		if (status === "confirm") {
			this.joborderData.contactLists[i].contactStatus = "confirm";
			this.onSaveStatus("c");
			this.findOnMap(this.joborderData.contactLists[i], "C");
		}
		if (status === "reject") {
			const dialogRef = this.dialog.open(RejectReasonModalComponent, {
				width: "450px",
				disableClose: true,
				data: { remark: this.joborderData.contactLists[i].remark, lineUserId: this.joborderData.contactLists[i].lineUserId }
			});

			dialogRef.afterClosed().subscribe(result => {
				if (result) {
					this.joborderData.contactLists[i].remark = result;
					this.joborderData.contactLists[i].contactStatus = "reject";
					this.onSaveStatus("r");
					this.sendReject(this.joborderData.contactLists[i]);
					this.findOnMap(this.joborderData.contactLists[i], "R");
				}
			});

		}
	}

	onSaveStatus(txt) {
		this.joborderService
			.updateJoborderData(this.joborderData._id, this.joborderData)
			.then((res) => {
				this.joborderData = res;

				if (txt === "c") {
					this._snackBar.open("ปรับปรุงข้อมูลสถานะเรียบร้อย", "", {
						duration: 7000,
					});
				}
				// if (txt === "r") {
				//   this._snackBar.open("ปรับปรุงข้อมูลสถานะเรียบร้อย", "", {
				//     duration: 7000,
				//   });
				// }
			})
			.catch((err) => {
				this._snackBar.open("เกิดข้อผิดพลาดในการปรับปรุงข้อมูลสถานะ", "", {
					duration: 7000,
				});
			});
	}

	sendReject(contactListData) {
		// console.log(contactListData)
		if (contactListData.lineUserId) {
			let body = {
				to: contactListData.lineUserId,
				messages: [
					{
						type: "text",
						text: "สถานะการส่งของท่านถูกยกเลิก เนื่องจาก: " + contactListData.remark
					},
				],
			};
			// console.log(body)
			this.joborderService
				.sendConFirmData(body)
				.then((res) => {
					this._snackBar.open("ส่งข้อความเพื่อแจ้งสถานะการยกเลิกเรียบร้อย", "", {
						duration: 5000,
					});
				})
				.catch((error) => {
					this._snackBar.open("เกิดข้อผิดพลาดในการส่งข้อความ", "", {
						duration: 5000,
					});
				});
		} else {
			this._snackBar.open("โปรดติดต่อทางเบอร์โทรศัพย์ เพื่อแจ้งสถานะ", "", {
				duration: 8000,
			});
		}
	}

	findOnMap(jobOrderDataItem, txt) {
		// console.log(item._id)
		// console.log(this.markersData)

		let mIndex = this.filterData.findIndex((el) => {
			return el._id === jobOrderDataItem._id;
		});
		// console.log(this.markersData[mIndex])
		this.changeIconMarker(this.filterData[mIndex], txt);
	}

	changeIconMarker(markerItem, txt) {
		// console.log(markerItem)
		// let bg = "ff2a2a";
		// let label = txt;

		//case DELETE
		if (txt === "") {
			markerItem.docno = "";
			markerItem.contactStatus = "";
		}

		// if (markerItem.isShareHolder) {
		//   bg = "167eff"; //สีน้ำเงิน
		// }

		// Change url name 
		// url: `https://ui-avatars.com/api/?rounded=true&size=36&font-size=0.4&length=4&color=fff&background=${bg}&name=${label}`,
		const pos = markerItem.icon.url.indexOf("&name=");
		const sliceStr = markerItem.icon.url.slice(0, pos);

		markerItem.icon = {
			url: `${sliceStr}&name=${txt}`,
			scaledSize: {
				width: 34,
				height: 34,
			},
		};
		// console.log(markerItem.icon.url);
		// console.log(markerItem.icon);
	}

	navigateByItem(contactItem) {
		this.lat = Number(contactItem.latitude);
		this.lng = Number(contactItem.longitude);
	}

	sendConFirm(contactListData) {
		// console.log(contactListData)
		if (contactListData.lineUserId) {
			let body = {
				to: contactListData.lineUserId,
				messages: [
					{
						type: "template",
						altText: "รถธรรมธุรกิจ ขอนัดหมายเข้าไปให้บริการท่านถึงหน้าบ้าน กรุณายืนยันการนัดหมายด้วยค่ะ",
						template: {
							type: "confirm",
							actions: [
								{
									type: "message",
									label: "รับนัดหมาย",
									text:
										"รับนัดหมาย วัน" +
										this.nameDate +
										"ที่: " +
										this.titleDate +
										" เลขเอกสาร: " +
										this.joborderData.docno,
								},
								{
									type: "message",
									label: "ปฏิเสธ",
									text:
										"ปฏิเสธ วัน" +
										this.nameDate +
										"ที่: " +
										this.titleDate +
										" เลขเอกสาร: " +
										this.joborderData.docno,
								},
							],
							text:
								"ตามที่ท่านลงทะเบียนกับรถธรรมธุรกิจไว้ เรามีความยินดีที่จะนำสินค้าข้าว ผัก ไข่ และผลิตภัณฑ์แปรรูปไปพบท่านในวันที่ " +
								this.titleDate +
								" กรุณากดยืนยันนัดหมาย การเดินทางไม่สามารถระบุเวลาที่แน่นอนได้ โดยจะติดต่ออีกครั้งก่อนเดินทาง หรือสอบถามเพิ่มเติม 098-8316596" +
								" ขอบคุณครับ",
						},
					},
				],
			};

			// console.log(body)
			this.joborderService
				.sendConFirmData(body)
				.then((res) => {
					this._snackBar.open("ส่งข้อความสำเร็จ รอยืนยัน", "", {
						duration: 5000,
					});
				})
				.catch((error) => {
					this._snackBar.open("เกิดข้อผิดพลาดในการส่งข้อความ", "", {
						duration: 5000,
					});
				});
		}
	}

	goBack() {
		this.spinner.show();
		// this.location.back();
		this.router.navigateByUrl("/joborder/list");
	}

	async onSave() {
		this.spinner.show();

		if (this.joborderData._id) {
			this.joborderService
				.updateJoborderData(this.joborderData._id, this.joborderData)
				.then((res) => {
					// console.log(res);
					this.joborderData = res;

					this.spinner.hide();

					this._snackBar.open("บันทึกจุดบริการเรียบร้อย", "", {
						duration: 7000,
					});
				})
				.catch((err) => {
					this.spinner.hide();
					this._snackBar.open("เกิดข้อผิดพลาดในการบันทึกจุดบริการ", "", {
						duration: 7000,
					});
				});
		} else {
			this.joborderService
				.createJoborderData(this.joborderData)
				.then((res) => {
					this.spinner.hide();

					let data = {
						_id: res._id,
						docno: res.docno,
						docdate: res.docdate,
						carNo: res.carNo,
						cusAmount: res.cusAmount,
						orderStatus: res.orderStatus,
						contactLists: res.contactLists,
					};
					this.joborderData = data;
					this._snackBar.open("เริ่มจัดเส้นทาง และบันทึกจุดบริการ เรียบร้อย", "", {
						duration: 7000,
					});
					if (this.joborderData._id) {
						this.router.navigateByUrl(
							"/joborder/joborderForm/" + this.joborderData._id
						);
					}
				})
				.catch((err) => {
					this.spinner.hide();
					this._snackBar.open("เกิดข้อผิดพลาดในการเริ่มจัดเส้นทาง และบันทึกจุดบริการ", "", {
						duration: 7000,
					});
				});
		}
	}

	/**
	 * Drag and drop for rearrage index  in joborder map
	 * @param event 
	 */
	drop(event: CdkDragDrop<any[]>) {
		// console.log(`${event.previousIndex} to ${event.currentIndex}`);
		moveItemInArray(
			this.joborderData.contactLists,
			event.previousIndex,
			event.currentIndex
		);
		// console.log(this.joborderData.contactLists);
		// พี่โก๋เพิ่มมาเพื่อให้ click info มาแล้ว Save เลยเพราะ เกิดปัญหาตอนลูกค้า confirm ผ่าน socket แล้วทำให้รายการหาย
		this.onSave();
	}

	/**
	 * Show or hide history
	 * @param {checker control} chkHistory
	 * @param {json} markerItem 
	 */
	onShowHistory(chkHistroy, markerItem) {
		// console.log(markerItem);

		if (!chkHistroy.checked) {
			// false -> true : show history
			this.joborderService.getJoborderHistory(markerItem._id)
				.then(res => {
					markerItem.jobHistory = res;
					// console.log(res);
				});
		}
	}

	/**
	 * Redraw marker in bound
	 */
	redrawBound() {
		// When first load redraw data
		this.agmMap._mapsWrapper.getBounds().then(value => {
			// console.log(value);
			this.onBoundsMapChange(value);
		})
	}

	/**
	 * When map bordardy map change
	 * filter marker only is in bordary
	 * @param event 
	 */
	onBoundsMapChange(event) {
		// console.log("pass change");

		// Set and clear timeout because user drag move map continueous
		// We will calculate when user drop mouse in 1000 ms
		clearTimeout(this.boundChangeTimer);
		this.boundChangeTimer = setTimeout(() => {
			let filter = [];

			// console.log(this.markersData.length);

			for (let mark of this.filterData) {
				// console.log(mark);

				// Change lat, lng to number
				let pos = {
					lat: Number(mark.latitude),
					lng: Number(mark.longitude)
				};

				if (!pos.lat || !pos.lng) continue;

				// console.log(pos);
				// console.log(event.contains(pos));

				// check lat, lng is contains boundary
				if (event.contains(pos)) {
					filter.push(mark);
				}
			}

			// Final filter is marker that in boundary
			this.boundMarker = filter;
			// console.log(this.filterMarker.length);
		}, 1000);


	}

	onSearchCustomer(str) {
		console.log(`Joborder : ${str}`);

		this.spinner.show();

		let item = this.filterData.find((value) => {
			// console.log(value);
			return value.displayName.trim().search(str.trim()) >= 0;
		});

		console.log(item);

		this.spinner.hide();

		if (item) {
			if (item.latitude || item.longitude) {
				this.navigateByItem(item);
				// Open info window immediately
				this.openWindow(item._id);
			} else {
				this._snackBar.open('ไม่สามารถแสดงผล เนื่องจาก ลูกค้าไม่ระบุพิกัด', "", {
					duration: 5000,
				});
			}
		} else {
			// Cann't find string show dialog 
			this.openedWindow = 0;
			this._snackBar.open('ค้นหาข้อมูลไม่พบ', "", {
				duration: 5000,
			});
		}
	}

	onProvinceChange(province) {
		// console.log(province);

		if (province !== 'ทุกจังหวัด') {
			this.filterData = this.markersData.filter((value) => value.addressProvince === province);
		} else {
			this.filterData = [...this.markersData];
		}
		
		this.redrawBound();
		// console.log(this.filterData);
	}

	onDistrictChange(filterData) {
		// console.log('district change');

		clearTimeout(this.districtChangeTimer);
		this.districtChangeTimer = setTimeout(() => {
			this.filterMarkData(filterData);
		}, 1000);
	}

	onConvenientChange(filterData) {
		clearTimeout(this.convenientChangeTimer);
		this.convenientChangeTimer = setTimeout(() => {
			this.filterMarkData(filterData);
		}, 1000);
	}


	filterMarkData(filterData) {
		// console.log(filterData);
		// convert day string to weekday for use to index refer
		let cIndex = [];
		if (filterData.convenientList) {
			filterData.convenientList.forEach(ele => {
				let d = this.convenientDayList.find(v => v.displayDay == ele);
				if (d) {
					cIndex.push(d.weekDay);
				}
			});
		}

		// console.log(districtsList);
		this.filterData = this.markersData.filter(value => {
			let pos = 0;
			if (filterData.districtList.length > 0) {
				pos = filterData.districtList.findIndex(d => d === value.addressDistrict);
			}

			// console.log(value);
			if (pos >= 0) {
				if (filterData.convenientList) {
					for (let index of cIndex) {
						if (value.convenientDay[index])	return true;
					}
				} else {
					return true;
				}

			}
			return false;
		});
	
		this.redrawBound();
		console.log(this.filterData);
	}


	onCheckOptionChange(option) {
		this.isShowMarkOnlyAppoint = option.isShowMarkOnlyAppoint;
		this.isShowMarkOnlySelect = option.isShowMarkOnlySelect;

		if (this.isShowMarkOnlyAppoint || this.isShowMarkOnlySelect) {
			if (!this.tmpFilterData) this.tmpFilterData = this.filterData;

			this.filterData = Array.from(this.markersData);
		} else {
			this.filterData = this.tmpFilterData;
			this.tmpFilterData = null;
		}
		
		this.redrawBound();
		//console.log(this.markersData);
	}

}
