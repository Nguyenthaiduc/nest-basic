### Tạo Module bằng lệnh
`nest g module <name>`
### Decorator
Decorator Module => `@Module`
Decorator Controller => `@Controller`
Decorator Service => `@Injectable`
### Module
controllers : [Controller]
providers : [Service]
import : []
### Instance 
Class => Object => Instance
Instance là 1 thực thể
### Controller
```ts
@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){}
  //POST => /auth/signup
    @Post('signup')
    signup(){
        return {msg : 'Hello World'}
    }

  //POST => /auth/signin
    @Post('signin')
    signin(){}
}
```
### Service
`nest g service <name> --no-spec` 
```ts
@Injectable({})
export class AuthService{
    signup(){
        return "I have Sign Up"
    }
    signin(){
        return "I have Sign In"
    }
}
```
### Docker
`docker compose up dev-db -d`
### Prisma
`npm i -D prisma`
`npm i @prisma/client`
`npx prisma init`
`npx prisma migrate dev`
name `init`
`npx prisma studio`
`npx prisma generate`
Khai báo model của Module vào Prisma
```rs
model User{
  id       Int      @id @default(autoincrement())
  createAt DateTime @default(now())
  updateAt DateTime @updatedAt

  email String
  hash  String

  firstName String?
  lastName  String?

}

model Bookmark{
  id       Int      @id @default(autoincrement())
  createAt DateTime @default(now())
  updateAt DateTime @updatedAt

  title       String
  description String?
  link        String

}
```
### Module Prisma
***Module Auth***
```ts
import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";


@Module({
    imports: [PrismaModule],
    controllers: [AuthController],
    providers : [AuthService]

})
export class AuthModule{}
```
***Module Prisma***
```ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}
```
**Global**
```ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}
```
**@Req()**
```ts
import { Controller, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){}

    @Post('signup')
    signup(@Req() req: Request){
        console.log(req.body)
        return this.authService.signup()
    }


    @Post('signin')
    signin(){
        return 'I am Sign In'
    }
}
```
**@Body()**
```ts
import { Body, Controller, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){}

    @Post('signup')
    signup(@Body() dto : any){
        console.log({
            dto,
        })
        return this.authService.signup()
    }


    @Post('signin')
    signin(){
        return 'I am Sign In'
    }
}
```
use dto interface
```ts
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthDto{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
```
**Controller**
```ts
import { Body, Controller, Post, } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){}

    @Post('signup')
    signup(@Body() dto : AuthDto){
        console.log({
            dto,
        })
        return this.authService.signup()
    }


    @Post('signin')
    signin(){
        return 'I am Sign In'
    }
}
```
`npm i bcrypt`
A library to help you hash passwords.

You can read about bcrypt in Wikipedia as well as in the following article: How To Safely Store A Password
`npm i argon2`
Bcrypt vẫn là một hàm băm được chấp nhận cho mật khẩu. Không cần phải chuyển đổi nếu bạn không muốn (kể từ phiên bản 7.2.0). Ngoài ra, PASSWORD_DEFAULTchỉ nên thay đổi (theo chính sách PHP Internals ) trên bản phát hành đầy đủ tiếp theo (7.3.0 trở lên). Nếu bạn muốn đảm bảo rằng bạn chỉ tiếp tục với bcrypt, bạn có thể sử dụng PASSWORD_BCRYPTthay thế. Tuy nhiên, điều này là không cần thiết, như chúng ta sẽ thảo luận bên dưới.
***500***
ForbiddenException
```json
{
  "statusCode": 403,
  "message": "Forbidden"
}
```

***passport***
`https://passportjs.org/`
***jwt***
`https://jwt.io`
***Pipes***

### Authentication
`https://docs.nestjs.com/security/authentication`
### Guard
```ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
    //GET /users/me
    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getMe(){
        return 'user info'
    }
}
```
jwt.strategy.ts
```ts
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(
    Strategy,
    'jwt',
) {
    constructor(config:ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('JWT_SECRET')
        });
    }
}
```