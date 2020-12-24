import { LightningElement, api, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from "@salesforce/apex";
import updateBoatList from "@salesforce/apex/BoatDataService.updateBoatList";
import getBoats from "@salesforce/apex/BoatDataService.getBoats";
const SUCCESS_VARIANT = "success";
const SUCCESS_TITLE = "Success";
const MESSAGE_SHIP_IT = "Ship It!";
const ERROR_VARIANT = "error";
const ERROR_TITLE = "Error";
export default class BoatEditor extends LightningElement {
  columns = [
    { label: "Name", fieldName: "Name", type: "text", editable: true },
    {
      label: "Length",
      fieldName: "Length__c",
      type: "nnumber",
      editable: true
    },
    { label: "Price", fieldName: "Price__c", type: "currency", editable: true },
    {
      label: "Description",
      fieldName: "Description__c",
      type: "text",
      editable: true
    }
  ];
  @api
  boats = [];
  draftValues;
  boatTypeId;
  @wire(getBoats, { boatTypeId: "$boatTypeId" })
  boat;
  async handleSave(event) {
    const draftValues = event.detail.draftValues;
    try {
      await updateBoatList({
        data: draftValues
      });
      this.dispatchEvent(
        new ShowToastEvent({
          title: SUCCESS_TITLE,
          message: MESSAGE_SHIP_IT,
          variant: SUCCESS_VARIANT
        })
      );
      // Clear all draft values
      this.draftValues = [];

      // Display fresh data in the datatable
      return refreshApex(this.boat);
    } catch (error) {
      console.log(error);
      this.dispatchEvent(
        new ShowToastEvent({
          title: ERROR_TITLE,
          message: error.message,
          variant: ERROR_VARIANT
        })
      );
    }
  }
}
