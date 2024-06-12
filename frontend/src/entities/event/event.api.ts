import { api } from "@/helpers/api";
import { IBanner } from "@/shared/interfaces/banner.interface";

export async function getEvents(): Promise<{
  data: { banner: IBanner[] };
}> {
  return api.get("events");
}
export async function createEvent(banner: FormData): Promise<void> {
  return api.post("events/create", banner);
}
