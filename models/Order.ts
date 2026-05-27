import mongoose, { Document, Schema } from 'mongoose';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'upi' | 'card';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface IOrderItem {
  menuItem: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
  isVeg: boolean;
  selectedOptions?: Record<string, string>;
}

export interface IDeliveryAddress {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface IOrder extends Document {
  orderId: string;
  user?: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: IOrderItem[];
  deliveryAddress: IDeliveryAddress;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  specialInstructions?: string;
  estimatedDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: String,
  isVeg: { type: Boolean, default: true },
  selectedOptions: { type: Map, of: String },
});

const DeliveryAddressSchema = new Schema<IDeliveryAddress>({
  name: String,
  phone: String,
  street: String,
  city: String,
  state: String,
  pincode: String,
});

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    items: [OrderItemSchema],
    deliveryAddress: DeliveryAddressSchema,
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 30 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'upi', 'card'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    specialInstructions: String,
    estimatedDelivery: Date,
  },
  { timestamps: true }
);

OrderSchema.index({ orderId: 1 });
OrderSchema.index({ user: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
