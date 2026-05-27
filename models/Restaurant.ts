import mongoose, { Document, Schema } from 'mongoose';

export interface IRestaurant extends Document {
  name: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  rating: number;
  totalRatings: string;
  deliveryTime: string;
  minOrder: number;
  deliveryFee: number;
  cuisines: string[];
  isVeg: boolean;
  isOpen: boolean;
  images: {
    banner: string;
    logo: string;
  };
  offers: Array<{
    code: string;
    description: string;
    minOrder: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantSchema = new Schema<IRestaurant>(
  {
    name: { type: String, required: true },
    description: String,
    address: String,
    city: String,
    phone: String,
    email: String,
    rating: { type: Number, default: 4.0 },
    totalRatings: { type: String, default: '0' },
    deliveryTime: { type: String, default: '30-40 mins' },
    minOrder: { type: Number, default: 99 },
    deliveryFee: { type: Number, default: 30 },
    cuisines: [String],
    isVeg: { type: Boolean, default: false },
    isOpen: { type: Boolean, default: true },
    images: {
      banner: String,
      logo: String,
    },
    offers: [
      {
        code: String,
        description: String,
        minOrder: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Restaurant || mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);
