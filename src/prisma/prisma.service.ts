import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; //dotenv
import { PrismaClient } from '@prisma/client';

@Injectable() //khogn co cai nay thi user se bi undefined
export class PrismaService extends PrismaClient {
    constructor(config: ConfigService) {
        super({
            datasources: {
                db: {
                    url: config.get('DATABASE_URL')
                }
            }
        })
        
    }
}
