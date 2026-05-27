import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  menuItem: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
  isVeg: boolean;
  selectedOptions?: Record<string, string>;
}

export interface ICart extends Document {
  user?: mongoose.Types.ObjectId;
  sessionId?: string;
  items: ICartItem[];
  subtotal: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  image: String,
  isVeg: { type: Boolean, default: true },
  selectedOptions: { type: Map, of: String },
});

const CartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    sessionId: String,
    items: [CartItemSchema],
    subtotal: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CartSchema.pre('save', function (next) {
  this.subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  next();
});

export default mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);
