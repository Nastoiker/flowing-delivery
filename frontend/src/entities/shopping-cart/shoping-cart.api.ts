import { api } from "@/helpers/api";
import { IShoppingCart } from "@/shared/interfaces/shopping-cart.interface";

export async function getShoppingCarts(): Promise<{
  data: { shoppingCart: IShoppingCart[] };
}> {
  return api.get("shopping-cart/my");
}
export async function createShoppingCartFetch(shoppingCart): Promise<void> {
  return api.post("shopping-cart", { shoppingCart });
}
export async function updateShoppingCart(id: number): Promise<void> {
  return api.put(`shopping-cart/${id}`);
}
export async function deleteShoppingCart(id: number): Promise<void> {
  return api.delete(`shopping-cart/${id}`);
}
