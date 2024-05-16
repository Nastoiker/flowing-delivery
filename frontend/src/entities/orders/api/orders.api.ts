import { api } from "@/helpers/api";
import { IOrder } from "@/shared/interfaces/order.interface";

export async function getOrders(): Promise<{
  data: { orders: IOrder[] };
}> {
  return api.get("order");
}
export async function createOrder(order: Partial<IOrder>): Promise<void> {
  return api.post("order", order);
}
