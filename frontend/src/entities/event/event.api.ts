import { api } from "@/helpers/api";
import { IBanner } from "@/shared/interfaces/banner.interface";
import io from "socket.io-client";

const socket = io("http://localhost:3000");
export async function getEvents(): Promise<{
  data: { banner: IBanner[] };
}> {
  return api.get("events");
}
export async function createEvent(banner: FormData): Promise<void> {
  return api.post("events/create", banner);
}
socket.on('notification', function(message) {
    console.log('New notification:', message);
  });