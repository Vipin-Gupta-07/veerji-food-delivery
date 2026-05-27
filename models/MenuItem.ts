import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomization {
  name: string;
  options: string[];
}

export interface IMenuItem extends Document {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  isVeg: boolean;
  isBestseller: boolean;
  isAvailable: boolean;
  rating: number;
  calories?: number;
  prepTime?: string;
  image: string;
  tags: string[];
  hasCustomization: boolean;
  customizations: ICustomization[];
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number },
    category: { type: String, required: true },
    isVeg: { type: Boolean, default: true },
    isBestseller: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 4.0, min: 0, max: 5 },
    calories: Number,
    prepTime: String,
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&q=80',
    },
    tags: [String],
    hasCustomization: { type: Boolean, default: false },
    customizations: [
      {
        name: String,
        options: [String],
      },
    ],
  },
  { timestamps: true }
);

MenuItemSchema.index({ name: 'text', description: 'text', tags: 'text' });
MenuItemSchema.index({ category: 1 });
MenuItemSchema.index({ isAvailable: 1 });
MenuItemSchema.index({ isBestseller: 1 });

export default mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
