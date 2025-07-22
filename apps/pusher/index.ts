import {prismaClient} from 'store/client'
import { xAddBulk } from 'redisstream/client';

async function main() {
    let websites = await prismaClient.website.findMany({
        select:{
            url: true,
            id: true
        }
    });

    console.log("Websites to be added to Redis Stream:", websites.length);

    await xAddBulk(websites.map(website => ({
        url: website.url,
        id: website.id
    })));
}

setInterval(() => {
    main()
}, 1000 * 60 * 3); 

main()