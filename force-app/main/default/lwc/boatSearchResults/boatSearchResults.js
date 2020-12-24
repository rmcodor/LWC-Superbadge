import { LightningElement, api, wire, track } from "lwc";
import getBoats from "@salesforce/apex/BoatDataService.getBoats";

export default class BoatSearchResults extends LightningElement {
  boatTypeId = "";
  @track
  boats;
  error;
  selectedBoatId;
  /**
   *
   * @param {String} boatTypeId
   */
  @api
  searchBoats(boatTypeId) {
    this.boatTypeId = boatTypeId;
    console.log("this.boatTypeId", this.boatTypeId);
    // this.dispatchEvent(new CustomEvent("loading"));
    // this.dispatchEvent(new CustomEvent("doneloading"));
  }
  @wire(getBoats, { boatTypeId: "$boatTypeId" })
  wiredBoats({ error, data }) {
    if (data) {
      this.boats = data;
    } else if (error) {
      this.boats = [];
      this.error = error;
    }
  }
  handleSelectedBoat(event) {
    this.selectedBoatId = event.detail.boatId;
  }
}
