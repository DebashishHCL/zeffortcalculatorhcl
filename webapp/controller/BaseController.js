sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/library",
	"sap/ui/core/routing/History",
	"../utils/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/export/Spreadsheet",
	"sap/ui/export/library",
], function (Controller, CoreLib, History, formatter, Filter, FilterOperator, Spreadsheet) {
	"use strict";
	const { BusyIndicator } = CoreLib;
	//const { Spreadsheet } = exportLibrary;
	return Controller.extend("com.zeffortcalculatorhcl.controller.BaseController", {
		formatter: formatter,
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		getOwnerModel: function (sName) {
			return this.getOwnerComponent().getModel(sName);
		},

		setOwnerModel: function (oModel, sName) {
			return this.getOwnerComponent().setModel(oModel, sName);
		},

		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("Home", {}, false);
			}
		},

		createFilter: function (path, value) {
			return new Filter({
				path: path,
				operator: FilterOperator.EQ,
				value1: value
			});
		},

		specialCharacterCheck: function (sValue) {
			const specialCharRegex = /^[a-zA-Z0-9 .]+$/;
			if (!specialCharRegex.test(sValue)) return false;
			else return true;
		},

		callBackEnd: function (sEntitySet, sAction, aFilter, oPayLoad, oUrlParameters) {
			switch (sAction) {
				case "GET":
					return new Promise((resolve, reject) => {
						this.getOwnerModel().read(sEntitySet, {
							filters: aFilter,
							urlParameters: oUrlParameters,
							success: function (oData, oResponse) {
								resolve(oResponse);
							},
							error: function (error) {
								reject(error);
							}
						});

					});
					break;
				case "POST":
					return new Promise((resolve, reject) => {
						this.getOwnerModel().create(sEntitySet, oPayLoad, {
							success: function (oData, oResponse) {
								resolve(oResponse);
							},
							error: function (e, oResponse) {
								reject(e);
							}
						});

					});
					break;
				default:
					break;
			}
		},

		onHome: function () {
			this.getRouter().navTo("Home", {}, false);
		},


		onDetailMatched: function (oEvent) {
			if (this.getView().byId("detailSave"))
				this.getView().byId("detailSave").setVisible(true);

			if (oEvent.getParameter("arguments").CustId && oEvent.getParameter("arguments").OpportunityId && oEvent.getParameter("arguments").Version) {
				if (this.getView().byId("detailSave"))
					this.getView().byId("detailSave").setVisible(false);

				let filters = [this.createFilter("CustId", oEvent.getParameter("arguments").CustId),
				this.createFilter("OpportunityId", oEvent.getParameter("arguments").OpportunityId),
				this.createFilter("Version", oEvent.getParameter("arguments").Version)
				];
				BusyIndicator.show();
				let oDetailData = this.callBackEnd("/zi_hcl_header", "GET", filters, {}, { $expand: "to_TotalEffort,to_PlatformEffort,to_PlatformEffortHD,to_ResourceEff" });

				oDetailData.then((oResponse) => {
					let response = oResponse.data;
					this.getOwnerModel("oModelEstCal").setData({});
					response.results[0].to_PlatformEffort.results.forEach(ele => {
						ele.L4ManHr = formatter.convertTwoDecimal(ele.L4ManHr.trim());
						ele.L4ManMnth = formatter.convertTwoDecimal(ele.L4ManMnth.trim());
						ele.L3ManHr = formatter.convertTwoDecimal(ele.L3ManHr.trim());
						ele.L3ManMnth = formatter.convertTwoDecimal(ele.L3ManMnth.trim());
						ele.L2ManHr = formatter.convertTwoDecimal(ele.L2ManHr.trim());
						ele.L2ManMnth = formatter.convertTwoDecimal(ele.L2ManMnth.trim());
						ele.L1ManHr = formatter.convertTwoDecimal(ele.L1ManHr.trim());
						ele.L1ManMnth = formatter.convertTwoDecimal(ele.L1ManMnth.trim());
						//ele.TotEffD = Math.round(formatter.convertTwoDecimal(ele.TotEffD.trim()));
						ele.TotEffD = Math.round(ele.TotEffD.trim());
						ele.TotEffH = formatter.convertTwoDecimal(ele.TotEffH.trim());
					});
					this.getOwnerModel("oModelEstCal").setData(response.results[0]);
					BusyIndicator.hide();
				}).catch((error) => {
					BusyIndicator.hide();
					console.log(error);
				});
			}
		},

		onCommonExport: function(oRowBinding, aCols, sFileName){

			//oTable = this._oTable;
			//let oRowBinding = oTable.getBinding('items');

			let oSettings = {
				workbook: {
					columns: aCols,
					hierarchyLevel: 'Level',
					context :{
						sheetName: sFileName
					}
				},
				dataSource: oRowBinding,
				fileName: sFileName + '.xlsx',
				//worker: false // We need to disable worker because we are using a MockServer as OData Service
			};

			let oSheet = new Spreadsheet(oSettings);
			oSheet.build()
			.then(()=>{
				console.log("Successfull");
				oSheet.destroy();
			})
			.catch((sMessage)=>{
				console.log(sMessage);
			});


		}
	});
});