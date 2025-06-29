import mongoose from "mongoose";

/**
 * Interface for city documents.
 * @interface
 */
export interface ICity extends mongoose.Document {
  name: string;
  population: number;
  country: string;
  latitude: number;
  longitude: number;
}

/**
 * Mongoose schema for cities.
 * @constant {Schema}
 */
const citySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  population: { type: Number, required: true },
  country: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true }
}, { timestamps: true });

/**
 * Mongoose model for cities.
 * @constant {Model}
 */
const CityModel = mongoose.model<ICity>("City", citySchema);
export default CityModel;