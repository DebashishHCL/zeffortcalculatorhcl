sap.ui.define([
	"./BaseController",
	"../utils/formatter",
	"sap/ui/export/library"
],
	function (BaseController, formatter, exportLibrary) {
		"use strict";
		const EdmType = exportLibrary.EdmType;
		return BaseController.extend("com.zeffortcalculatorhcl.controller.HCLDetail", {
			formatter: formatter,
			onInit: async function () {
				this.getView().addEventDelegate({
                    onAfterShow: ()=>{
                       this.getView().byId("hclImg").attachPress(()=>{
                            this.onHome();
                       });
                    }
                });
				this.getRouter().getRoute("HCLDetail").attachPatternMatched(this.onDetailMatched, this);

			},

			onSwitchChange: function (oEvent) {
				this.getOwnerModel("pgUiData").setProperty("/enableTableData", oEvent.getSource().getState());
				oEvent.getSource().getState() ? this.getOwnerModel("pgUiData").setProperty("/hoursOrMonth", "H") : this.getOwnerModel("pgUiData").setProperty("/hoursOrMonth", "M");
			},

			onChangeHoursorMonths: function (oEvent) {
				switch (oEvent.getParameter("selected")) {
					case true:
						this.getOwnerModel("pgUiData").setProperty("/hoursOrMonth", "M");
						break;
					default:
						this.getOwnerModel("pgUiData").setProperty("/hoursOrMonth", "H");
						break;
				}
			},

			onEdit: function (sSaveorEdit) {
				this.getOwnerModel("oModelEstCal").setProperty("/SaveOrEdit", sSaveorEdit);
				this.getRouter().navTo("Calculate", {}, false);
			},

			onHomePage: function () {
				this.getRouter().navTo("Home", {}, false);
			},

			onSearchCust: function () {
				this.getRouter().navTo("Search", {
					OpportunityId: this.getOwnerModel("oModelEstCal").getProperty("/OpportunityId")
				}, false);
			},
			/******** Platform Effort Excel Download  *********/ 
			onPlatformEffortsExport: function () {
				let sFileName = "Platform Efforts";
				let oTable = this.getView().byId('tbPlatformEfforts');
				let oRowBinding = oTable.getBinding('items');
				let aCols = [
					{
						label: 'Effort Calculator',
						property: 'EffType',
						type: EdmType.String
					},
					{
						label: 'Total Effort (In Hours)',
						type: EdmType.Number,
						property: 'TotEffortInHours',
						scale: 2,
						delimiter: true
					},
					{
						label: 'Total Effort (In Days)',
						property: 'TotEffortInDays',
						type: EdmType.Number,
						scale: 0,
						delimiter: true
					}
				];

				this.onCommonExport(oRowBinding, aCols, sFileName);

			},
			/******** Effort Calculation Excel Download  *********/ 
			onEffortCalculationExport: function(){
				let sFileName = "Effort Calculation";
				let oTable = this.getView().byId("tbEffortCalculation");
				let oRowBinding = oTable.getBinding('items');
				let aCols = [
					{
						label: 'Effort Calculator',
						property: 'EffType',
						type: EdmType.String
					}
				];

				this.onCommonExport(oRowBinding, aCols, sFileName);
			},
			/******** Resource Loading Excel Download  *********/ 
			onResourceloadingExport: function(){
				let sFileName = "Resource loading sheet";
				let oTable = this.getView().byId('tbResourceloading');
				let oRowBinding = oTable.getBinding('rows');
				let aCols = [
					{
						label: 'Skill',
						property: 'EffType',
						type: EdmType.String
					}
					

				];

				this.onCommonExport(oRowBinding, aCols, sFileName);
			},

			/******** Package Detail Excel Download  *********/ 
			onWorkPackageDetailsExport: function() {
				let sFileName = "Work Package Additional Details";
				let oTable = this.getView().byId('tbWorkPackageDetails');
				let oRowBinding = oTable.getBinding('rows');
				let aCols = [
					{
						label: 'Effort Type',
						property: 'EffType',
						type: EdmType.String
					},
					{
						label: 'Execution: L3/L2 (Small)',
						property: 'SExeEff',
						type: EdmType.Number,
						scale: 2,
						delimiter: true
					},
					{
						label: 'Execution: L3/L2 (Medium)',
						property: 'MExeEff',
						type: EdmType.Number,
						scale: 2,
						delimiter: true
					},
					{
						label: 'Execution: L3/L2 (Large)',
						property: 'LExeEff',
						type: EdmType.Number,
						scale: 2,
						delimiter: true
					},
					{
						label: 'Coverage L4 Effort (Small)',
						property: 'SCovEff',
						type: EdmType.Number,
						scale: 2,
						delimiter: true
					},
					{
						label: 'Coverage L4 Effort (Medium)',
						property: 'MCovEff',
						type: EdmType.Number,
						scale: 2,
						delimiter: true
					},
					{
						label: 'Coverage L4 Effort (Large)',
						property: 'LCovEff',
						type: EdmType.Number,
						scale: 2,
						delimiter: true
					},
					{
						label: 'Hyper Care Effort L2 (Small)',
						property: 'SHyperCareEff',
						type: EdmType.Number,
						scale: 2,
						delimiter: true
					},
					{
						label: 'Hyper Care Effort L2 (Medium)',
						property: 'MHyperCareEff',
						type: EdmType.Number,
						scale: 2,
						delimiter: true
					},
					{
						label: 'Hyper Care Effort L2 (Large)',
						property: 'LHyperCareEff',
						type: EdmType.Number,
						scale: 2,
						delimiter: true
					},
					{
						label: 'Governance (Small)',
						property: 'SGovEff',
						type: EdmType.Number,
						scale: 2,
						delimiter: true
					},
					{
						label: 'Governance (Medium)',
						property: 'MGovEff',
						type: EdmType.Number,
						scale: 2,
						delimiter: true
					},
					{
						label: 'Governance (Large)',
						property: 'LGovEff',
						type: EdmType.Number,
						scale: 2,
						delimiter: true
					},
					{
						label: 'TOTAL (Small)',
						property: 'STotEff',
						type: EdmType.Number,
						scale: 2,
						delimiter: true
					},
					{
						label: 'TOTAL (Medium)',
						property: 'MTotEff',
						type: EdmType.Number,
						scale: 2,
						delimiter: true
					},
					{
						label: 'TOTAL (Large)',
						property: 'LTotEff',
						type: EdmType.Number,
						scale: 2,
						delimiter: true
					},
					

				];

				this.onCommonExport(oRowBinding, aCols, sFileName);
			}

			
		});
	});
