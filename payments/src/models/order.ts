import mongoose from "mongoose";
import { OrderStatus } from "@learndev24/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// An interface that describes the properties
// that are requried to create a new Order
interface OrderAttrs {
  id: string;
  price: number;
  status: OrderStatus;
  userId: string;
  version: number;
}

// An interface that describes the properties
// that a Order Document has
interface OrderDoc extends mongoose.Document {
  status: OrderStatus;
  price: number;
  userId: string;
  version: number;
}

// An interface that describes the properties
// that a Ticket Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const OrderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

OrderSchema.set("versionKey", "version");
OrderSchema.plugin(updateIfCurrentPlugin);

OrderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    status: attrs.status,
    price: attrs.price,
    userId: attrs.userId,
    version: attrs.version,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", OrderSchema);

export { Order, OrderStatus };
