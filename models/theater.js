class Theater {
  constructor({
    id,
    name,
    location,
    numberOfScreens,
    seatingCapacity,
    contactNumber,
    amenities,
    ticketPrices,
    openingHours
  }) {
    this.id = id || null;
    this.name = name || "";
    this.location = location || {
      address: "",
      city: "",
      country: "",
      postalCode: ""
    };
    this.numberOfScreens = numberOfScreens || 0;
    this.seatingCapacity = seatingCapacity || 0;
    this.contactNumber = contactNumber || "";
    this.amenities = amenities || [];
    this.ticketPrices = ticketPrices || {
      adult: 0,
      child: 0,
      senior: 0
    };
    this.openingHours = openingHours || {};
  }

  // Convert Theater instance → plain JSON object (for create)
  toJSONCreate() {
    return {
      name: this.name,
      location: this.location,
      numberOfScreens: this.numberOfScreens,
      seatingCapacity: this.seatingCapacity,
      contactNumber: this.contactNumber,
      amenities: this.amenities,
      ticketPrices: this.ticketPrices,
      openingHours: this.openingHours
    };
  }

  // Convert Theater instance → plain JSON object (for update)
  toJSONUpdate() {
    return {
      id: this.id,
      name: this.name,
      location: this.location,
      numberOfScreens: this.numberOfScreens,
      seatingCapacity: this.seatingCapacity,
      contactNumber: this.contactNumber,
      amenities: this.amenities,
      ticketPrices: this.ticketPrices,
      openingHours: this.openingHours
    };
  }

  // Create a Theater instance from JSON (for update)
  static fromJsonUpdate(json) {
    if (!json) throw new Error("Invalid JSON for Theater");
    return new Theater({
      id: json.id,
      name: json.name,
      location: json.location,
      numberOfScreens: json.numberOfScreens,
      seatingCapacity: json.seatingCapacity,
      contactNumber: json.contactNumber,
      amenities: json.amenities,
      ticketPrices: json.ticketPrices,
      openingHours: json.openingHours
    });
  }

  // Create a Theater instance from JSON (for create)
  static fromJsonCreate(json) {
    if (!json) throw new Error("Invalid JSON for Theater");
    return new Theater({
      name: json.name,
      location: json.location,
      numberOfScreens: json.numberOfScreens,
      seatingCapacity: json.seatingCapacity,
      contactNumber: json.contactNumber,
      amenities: json.amenities,
      ticketPrices: json.ticketPrices,
      openingHours: json.openingHours
    });
  }

  // Build dynamic update fields (only keep valid, non-empty values)
  buildUpdateFields() {
    const data = this.toJSONUpdate();
    const fields = {};
    if (data.name && data.name.trim() !== "") fields.name = data.name;
    if (data.location && typeof data.location === "object") fields.location = data.location;
    if (data.numberOfScreens !== null && data.numberOfScreens !== undefined)
      fields.numberOfScreens = data.numberOfScreens;
    if (data.seatingCapacity !== null && data.seatingCapacity !== undefined)
      fields.seatingCapacity = data.seatingCapacity;
    if (data.contactNumber && data.contactNumber.trim() !== "") fields.contactNumber = data.contactNumber;
    if (Array.isArray(data.amenities) && data.amenities.length > 0) fields.amenities = data.amenities;
    if (data.ticketPrices && typeof data.ticketPrices === "object") fields.ticketPrices = data.ticketPrices;
    if (data.openingHours && typeof data.openingHours === "object") fields.openingHours = data.openingHours;
    return fields;
  }
}

module.exports = Theater;
