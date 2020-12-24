import { api, LightningElement, wire } from "lwc";
import getBoatsByLocation from "@salesforce/apex/BoatDataService.getBoatsByLocation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { MessageContext, subscribe } from "lightning/messageService";
import BOATMC from "@salesforce/messageChannel/BoatMessageChannel__c";
// imports
const LABEL_YOU_ARE_HERE = "You are here!";
const ICON_STANDARD_USER = "standard:user";
const ERROR_TITLE = "Error loading Boats Near Me";
const ERROR_VARIANT = "error";
export default class BoatsNearMe extends LightningElement {
  // Initialize messageContext for Message Service
  @wire(MessageContext)
  messageContext;
  @api
  boatTypeId;
  mapMarkers = [];
  isLoading = true;
  isRendered = false;
  latitude;
  longitude;
  subscription = null;

  // Add the wired method from the Apex Class
  // Name it getBoatsByLocation, and use latitude, longitude and boatTypeId
  // Handle the result and calls createMapMarkers
  @wire(getBoatsByLocation, {
    latitude: "$latitude",
    longitude: "$longitude",
    boatTypeId: "$boatTypeId"
  })
  wiredBoatsJSON({ error, data }) {
    if (error) {
      this.mapMarkers = [];
      this.dispatchEvent(
        new ShowToastEvent({
          title: ERROR_TITLE,
          message: error.message,
          variant: ERROR_VARIANT
        })
      );
      this.isLoading = false;
    } else {
      console.log("provisioning");
      this.createMapMarkers(data);
    }
  }

  // Controls the isRendered property
  // Calls getLocationFromBrowser()
  renderedCallback() {
    if (!this.isRendered) {
      this.getLocationFromBrowser();
      this.isRendered = true;
    }
  }

  // Gets the location from the Browser
  // position => {latitude and longitude}
  getLocationFromBrowser() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      },
      (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
    );
  }

  // Creates the map markers
  createMapMarkers(boatData) {
    if (boatData) {
      let newMarkers = boatData.map((boat) => {
        return {
          location: {
            Latitude: boat.Geolocation__Latitude__s,
            Longitude: boat.Geolocation__Longitude__s
          },
          title: boat.Name,
          icon: ICON_STANDARD_USER
        };
      });
      newMarkers.unshift({
        location: {
          Latitude: this.latitude,
          Longitude: this.longitude
        },
        title: LABEL_YOU_ARE_HERE,
        icon: ICON_STANDARD_USER
      });
      this.mapMarkers = newMarkers;
      this.isLoading = false;
    }
  }

  // Subscribes to the message channel
  subscribeMC() {
    if (this.subscription) {
      return;
    }
    // Subscribe to the message channel to retrieve the recordId and explicitly assign it to boatId.
    this.subscription = subscribe(this.messageContext, BOATMC, (message) => {
      this.handleBoatSubscription(message);
    });
  }
  handleBoatSubscription(message) {
    this.isLoading = true;
    //this.boatTypeId = message.recordId;
  }
  // Calls subscribeMC()
  connectedCallback() {
    this.subscribeMC();
  }
}
