import { LightningElement, api, wire, track } from "lwc";
import getBoats from "@salesforce/apex/BoatDataService.getBoats";

export default class BoatSearchResults extends LightningElement {
  boatTypeId;
  @track
  boats;
  error;
  /**
   *
   * @param {String} boatTypeId
   */
  @api
  async searchBoats(boatTypeId) {
    this.boatTypeId = boatTypeId;
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
}
