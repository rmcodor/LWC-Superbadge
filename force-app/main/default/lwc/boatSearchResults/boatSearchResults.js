import { LightningElement, api } from "lwc";
import getBoats from "@salesforce/apex/BoatDataService.getBoats";

export default class BoatSearchResults extends LightningElement {
  /**
   *
   * @param {String} boatTypeId
   */
  @api
  async searchBoats(boatTypeId) {
    try {
      this.dispatchEvent(new CustomEvent("loading"));
      const boats = await getBoats({ boatTypeId });
      this.dispatchEvent(new CustomEvent("doneloading"));
    } catch (error) {
      console.log(error);
    }
  }
}
