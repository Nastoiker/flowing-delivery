import { api } from "@/helpers/api";
import { IBanner } from "@/shared/interfaces/banner.interface";

export async function getBanners(): Promise<{
  data: { banner: IBanner[] };
}> {
  return api.get("banners");
}
export async function createBanner(banner: FormData): Promise<void> {
  return api.post("banners/create", banner);
}
