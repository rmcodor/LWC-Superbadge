import { LightningElement, wire, track } from "lwc";
import {
  APPLICATION_SCOPE,
  createMessageContext,
  MessageContext,
  publish,
  releaseMessageContext,
  subscribe,
  unsubscribe
} from "lightning/messageService";
import BOATMC from "@salesforce/messageChannel/BoatMessageChannel__c";
import { NavigationMixin } from "lightning/navigation";

export default class BoatSearch extends NavigationMixin(LightningElement) {
  @wire(MessageContext)
  messageContext;

  @track
  isLoading;

  handleLoading() {
    this.isLoading = true;
  }
  handleDoneLoading() {
    this.isLoading = false;
  }
  createNewBoat() {
    this[NavigationMixin.Navigate]({
      type: "standard__objectPage",
      attributes: {
        objectApiName: "Boat__c",
        actionName: "new"
      }
    });
  }
  // Handles search boat event
  // This custom event comes from the form
  searchBoats(event) {
    console.log("Search", event.detail.boatTypeId);
    const boatTypeId = event.detail.boatTypeId;
    this.template
      .querySelector("c-boat-search-results")
      .searchBoats(boatTypeId);
  }
}
