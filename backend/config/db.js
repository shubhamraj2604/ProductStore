import {neon} from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const {PGHOST , PGUSER, PGPASSWORD, PGDATABASE, PGPORT} = process.env; 

// CREATES A SQL CONNECTIONS USING OUR ENV VARIABLES
export const sql = neon(
    `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}`
)