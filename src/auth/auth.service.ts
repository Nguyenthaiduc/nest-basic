import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) { }
    async signup(dto: AuthDto) {
        //generate the password
        try {

            const hash = await argon.hash(dto.password)
            //save user in db
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                },

            })
            //POST khong thay hash
            
            //return saved user
            return this.signToken(user.id, user.email)
            //check trùng id
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken')
                }
            }
            throw error
        }


    }
    async signin(dto: AuthDto) {
        //find by user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,

            },
        })
        //if user does not exist throw Exception
        if (!user)
            throw new ForbiddenException(
                'Credential incorrect',
            );
        //compare password
        const pwMatches = await argon.verify(
            user.hash,
            dto.password
        );

        //if password incorrect throw exception
        if (!pwMatches)
            throw new ForbiddenException(
                'Credential incorrect',
            )

        //send back the user 
        return this.signToken(user.id, user.email)
    }
    async signToken(userId: number, email: string): Promise<{ access_token : string }> {
        const payload = {
            sub: userId,
            email: email
        }
        const secret = this.config.get('JWT_SECRET')



        const token =  await this.jwt.signAsync(payload, {
            expiresIn: '15m', //15 minute
            secret: secret
        })
         
        return { 
            access_token: token 
        }            
        
    }
}


