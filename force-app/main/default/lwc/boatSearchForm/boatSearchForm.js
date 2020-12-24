import { LightningElement, wire, track } from "lwc";
import getBoats from "@salesforce/apex/BoatDataService.getBoats";
export default class BoatSearchForm extends LightningElement {
  selectedBoatTypeId = "";
  // Private
  error = undefined;
  // Needs explicit track due to nested data
  @track
  searchOptions = [];

  @wire(getBoats, { boatTypeId: "$selectedBoatTypeId" })
  boatTypes({ error, data }) {
    if (data) {
      this.searchOptions = data.map((type) => {
        return { label: type.Name, value: type.BoatType__c };
      });
      this.searchOptions.unshift({ label: "All Types", value: "" });
    } else if (error) {
      this.searchOptions = undefined;
      this.error = error;
    }
  }

  // Fires event that the search option has changed.
  // passes boatTypeId (value of this.selectedBoatTypeId) in the detail
  handleSearchOptionChange(event) {
    let searchEvent = new CustomEvent("search", {
      detail: { boatTypeId: event.detail.value }
    });
    this.dispatchEvent(searchEvent);
  }
}
