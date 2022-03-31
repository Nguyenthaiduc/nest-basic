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