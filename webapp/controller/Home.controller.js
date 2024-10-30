sap.ui.define([
    "./BaseController",
    "com/zeffortcalculatorhcl/model/models",
    "../utils/formatter",
    "sap/ui/model/Filter", "sap/ui/model/FilterOperator"
],
    function (BaseController, models, formatter, Filter, FilterOperator) {
        "use strict";

        return BaseController.extend("com.zeffortcalculatorhcl.controller.Home", {
            formatter: formatter,
            onInit: function () {
            },

            onChoice: function () {
                this.getOwnerModel("oModelEstCal")?.destroy();
                this.setOwnerModel(models.getEcInputModel(this.getOwnerModel()), "oModelEstCal");

                if (this.getView().byId("Choice1").getSelected()) {                    
                    this.getRouter().navTo("Opportunity", {}, true);

                }
                if (this.getView().byId("Choice2").getSelected()) {
                    this.getRouter().navTo("Search", {}, false);
                }
            },
            // onEmail: function () {
            //     let oF4Help = this.callBackEnd("/zi_hcl_email", "GET", [], {}, {});
			// 	oF4Help.then((oResponse) => {
			// 		let result = oResponse.data.results;
            //     })
            // },
            // onDownload: function () {
            //     let aFilter = [];
            //     aFilter.push(new Filter('opp_id', FilterOperator.EQ, "UM0000185"));
            //     aFilter.push(new Filter('version', FilterOperator.EQ, "01"));
            //     aFilter.push(new Filter('sap_app', FilterOperator.EQ, true));
            //     let oDownload = this.callBackEnd("/zi_hcl_download", "GET", aFilter, {}, {});
			// 	oDownload.then((oResponse) => {
			// 		let result = oResponse.data.results;
            //     })
            // }
        });
    });
