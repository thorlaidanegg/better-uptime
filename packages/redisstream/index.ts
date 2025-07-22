import { createClient } from "redis";

const client = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

type WebsiteEvent = { url: string; id: string };
type MessageType = {
  id: string;
  message: {
    url: string;
    id: string;
  };
};

const STREAM_NAME = "betteruptime:website";
export async function xAdd({ url, id }: WebsiteEvent) {
  const result = await client.xAdd(STREAM_NAME, "*", {
    url,
    id,
  });
  return result;
}

export async function xAddBulk(events: WebsiteEvent[]) {
  const multi = client.multi();
  for (const event of events) {
    multi.xAdd(STREAM_NAME, "*", {
      url: event.url,
      id: event.id,
    });
  }
  return await multi.exec();
}

export async function xReadGroup(
  consumerGroup: string,
  workerId: string
): Promise<MessageType[] | undefined> {
  const res = (await client.xReadGroup(
    consumerGroup,
    workerId,
    {
      key: STREAM_NAME,
      id: ">",
    },
    {
      COUNT: 5,
    }
  )) as Array<{ messages: MessageType[] }> | null;

  let messages: MessageType[] | undefined = res?.[0]?.messages;

  return messages;
}

async function xAck(consumerGroup: string, eventId: string) {
  await client.xAck(STREAM_NAME, consumerGroup, eventId);
}

export async function xAckBulk(consumerGroup: string, eventIds: string[]) {
  const multi = client.multi();
  for (const eventId of eventIds) {
    multi.xAck(STREAM_NAME, consumerGroup, eventId);
  }
  return await multi.exec();
}
