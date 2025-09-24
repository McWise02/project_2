class Movie {
  constructor({ 
    id,
    title, 
    producer, 
    director, 
    lengthMs, 
    genre, 
    releaseDate 
  }) {
    this.id = id || null;
    this.title = title || "";
    this.producer = producer || "";
    this.director = director || "";
    this.lengthMs = lengthMs || 0; // length in milliseconds
    this.genre = genre || "";
    this.releaseDate = releaseDate ? new Date(releaseDate) : null;
  }

  // Convert Movie instance → plain JSON object

  toJSONCreate() {
    return {
      title: this.title,
      producer: this.producer,
      director: this.director,
      lengthMs: this.lengthMs,
      genre: this.genre,
      // store as Date object in Mongo
      releaseDate: this.releaseDate || null
    };
  }

  toJSONUpdate() {
    return {
      id: this.id,
      title: this.title,
      producer: this.producer,
      director: this.director,
      lengthMs: this.lengthMs,
      genre: this.genre,
      // keep as Date, not ISO string
      releaseDate: this.releaseDate || null
    };
  }
  // Create a Movie instance from a JSON object
 static fromJsonUpdate(json) {
    if (!json) throw new Error("Invalid JSON for Movie");
    return new Movie({
      id: json.id,
      title: json.title,
      producer: json.producer,
      director: json.director,
      lengthMs: json.lengthMs,
      genre: json.genre,
      releaseDate: json.releaseDate
    });
  }
  static fromJsonCreate(json) {
    if (!json) throw new Error("Invalid JSON for Movie");

    return new Movie({
      title: json.title,
      producer: json.producer,
      director: json.director,
      lengthMs: json.lengthMs,
      genre: json.genre,
      releaseDate: json.releaseDate
    });
  }


    buildUpdateFields() {
      const data = this.toJSONUpdate();
      const fields = {};
      if (data.title && data.title.trim() !== "") fields.title = data.title;
      if (data.producer && data.producer.trim() !== "") fields.producer = data.producer;
      if (data.director && data.director.trim() !== "") fields.director = data.director;
      if (data.lengthMs !== null && data.lengthMs !== undefined) fields.lengthMs = data.lengthMs;
      if (data.genre && data.genre.trim() !== "") fields.genre = data.genre;
      if (data.releaseDate instanceof Date && !isNaN(data.releaseDate)) fields.releaseDate = data.releaseDate;
      return fields;
    }
}
module.exports = Movie;