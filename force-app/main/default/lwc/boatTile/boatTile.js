import { api } from "lwc";

// imports
//constants
TILE_WRAPPER_SELECTED_CLASS = "tile-wrapper selected";
TILE_WRAPPER_UNSELECTED_CLASS = "tile-wrapper";
export default class BoatTile extends LightningElement {
  @api
  boat;
  @api
  selectedBoatId;
  currentTileClas = TILE_WRAPPER_UNSELECTED_CLASS;

  // Getter for dynamically setting the background image for the picture
  get backgroundStyle() {
    return `background-image:url(${this.boat.Picture__c})`;
  }

  // Getter for dynamically setting the tile class based on whether the
  // current boat is selected
  get tileClass() {
    return currentTileClas;
  }

  // Fires event with the Id of the boat that has been selected.
  selectBoat() {
    if (this.boat.Id === this.selectedBoatId) {
      this.currentTileClas = TILE_WRAPPER_SELECTED_CLASS;
    } else {
      this.currentTileClas = TILE_WRAPPER_UNSELECTED_CLASS;
    }
    this.dispatchEvent(
      new CustomEvent("boatselect", { detail: { boatId: this.boat.Id } })
    );
  }
}
