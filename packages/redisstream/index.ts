import { createClient } from "redis";

const client = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();


type WebsiteEvent = { url:string , id:string }

export async function xAdd({ url, id }: WebsiteEvent) {
    const result = await client.xAdd("betteruptime:website", "*", {
        url,
        id
    });
    return result;
}

export async function xAddBulk(events: WebsiteEvent[]) {
    const multi = client.multi();
    for (const event of events) {
        multi.xAdd("betteruptime:website", "*", {
            url: event.url,
            id: event.id
        });
    }
    return await multi.exec();
}