import { api } from "@/helpers/api";
import { IOrder } from "@/shared/interfaces/order.interface";

export async function getOrders({
  filter = {},
  page = "1",
  pageSize = "20",
  sort = { field: "createdAt", direction: "desc" },
}): Promise<{
  data: { orders: IOrder[]; allCount: number };
}> {
  return api.get("order", {
    params: {
      filter,
      page,
      sort,
      pageSize,
    },
  });
}
export async function createOrder(order: Partial<IOrder>): Promise<void> {
  return api.post("order", order);
}

export async function getMyOrders(): Promise<{
  data: { orders: IOrder[]; allCount: number };
}> {
  return api.get("order/my");
}

export async function getMyPurchasedOrders(): Promise<{
  data: { orders: IOrder[]; allCount: number };
}> {
  return api.get("order/my-purchased");
}
