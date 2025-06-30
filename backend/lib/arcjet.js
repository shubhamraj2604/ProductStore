import arcjet ,{tokenBucket , shield , detectBot} from "@arcjet/node";

import dotenv from "dotenv";

dotenv.config();

//initialize arcjet

export const aj = arcjet({
   key: process.env.ARCJET_KEY,
   characteristics : ["ip.src"],
   rules :[
    //sheild protects our application for common attacks eg.sql injection , xss , csrf attacks
    shield({mode:"LIVE"}),
    detectBot({
        //detects bots except search engines
        allow:[
            "CATEGORY:SEARCH_ENGINE"
        ]
    }),
    // rate limiting
    tokenBucket({
        //max number of requests allowed in a time window
        mode:"LIVE",
        refillRate:5,
        interval:10,
        capacity:10,
    }),
   ]
});