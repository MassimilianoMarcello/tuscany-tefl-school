import { createImageUrlBuilder } from "@sanity/image-url";
import { client } from "./sanity.client";

const builder = createImageUrlBuilder(client);

export function urlFor(source: {
  _type?: string
  asset: { _ref: string } | { _id: string; url: string }
  crop?: { top: number; bottom: number; left: number; right: number }
  hotspot?: { x: number; y: number; width: number; height: number }
} | string) {
  return builder.image(source)
}