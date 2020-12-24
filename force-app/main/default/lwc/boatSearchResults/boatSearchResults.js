import { LightningElement, api, wire, track } from "lwc";
import getBoats from "@salesforce/apex/BoatDataService.getBoats";
import updateBoatList from "@salesforce/apex/BoatDataService.updateBoatList";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from "@salesforce/apex";
const SUCCESS_VARIANT = "success";
const SUCCESS_TITLE = "Success";
const MESSAGE_SHIP_IT = "Ship It!";
const ERROR_VARIANT = "error";
const ERROR_TITLE = "Error";
export default class BoatSearchResults extends LightningElement {
  boatTypeId = "";
  @track
  boats;
  error;
  isLoading = false;
  selectedBoatId;
  provisionBoats;
  draftValues;
  // wired message context
  messageContext;
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
  /**
   *
   * @param {String} boatTypeId
   */
  @api
  searchBoats(boatTypeId) {
    this.boatTypeId = boatTypeId;
    this.notifyLoading(true);
  }
  @wire(getBoats, { boatTypeId: "$boatTypeId" })
  wiredBoats(provisionBoats) {
    const { error, data } = provisionBoats;
    this.provisionBoats = provisionBoats;
    this.notifyLoading(false);
    if (data) {
      this.boats = data;
    } else if (error) {
      this.boats = [];
      this.error = error;
    }
  }
  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) {
    // explicitly pass boatId to the parameter recordId
  }
  // this public function must refresh the boats asynchronously
  // uses notifyLoading
  async refresh() {
    this.notifyLoading(true);
    // Clear all draft values
    this.draftValues = [];
    // Display fresh data in the datatable
    await refreshApex(this.provisionBoats);
    this.notifyLoading(false);
  }
  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(event) {
    this.selectedBoatId = event.detail.boatId;
  }
  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) {
    if (isLoading) {
      this.dispatchEvent(new CustomEvent("loading"));
    } else {
      this.dispatchEvent(new CustomEvent("doneloading"));
    }
  }
  // The handleSave method must save the changes in the Boat Editor
  // passing the updated fields from draftValues to the
  // Apex method updateBoatList(Object data).
  // Show a toast message with the title
  // clear lightning-datatable draft values
  handleSave(event) {
    this.notifyLoading(true);
    // notify loading
    const updatedFields = event.detail.draftValues;
    // Update the records via Apex
    updateBoatList({ data: updatedFields })
      .then(() => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: SUCCESS_TITLE,
            message: MESSAGE_SHIP_IT,
            variant: SUCCESS_VARIANT
          })
        );
      })
      .catch((error) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: ERROR_TITLE,
            message: error.message,
            variant: ERROR_VARIANT
          })
        );
      })
      .finally(() => {
        this.refresh();
      });
  }
}
