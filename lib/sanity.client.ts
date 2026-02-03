import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "r8udx71r",     // copialo dal vecchio progetto
  dataset: "production",               // o quello che usi
  apiVersion: "2024-01-01",            // aggiorna con la data che usi
  useCdn: true,
});