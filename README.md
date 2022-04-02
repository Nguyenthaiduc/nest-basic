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
### General
***Module***
app.controller.ts: Chứa các router để xử lý các request và trả về response cho client. <br/>

app.controller.spec.ts: Có nhiệm vụ viết unit-test cho các controller.<br/>

app.module.ts: Root module của ứng dụng.<br/>

app.service.ts: Service chứa các logic mà controller sẽ dùng đến.<br/>

main.ts: Sử dụng NestFactory để khởi tạo ứng dụng.<br/>

**Trong một module sẽ bao gồm các thành phần chính sau đây:**

providers: Có nhiệm vụ khởi tạo và cung cấp các service mà sẽ được controller trong module sẽ sử dụng đến.<br />

controllers: Có nhiệm vụ khởi tạo những controller đã được xác định trong module.<br/>

imports: Có nhiệm vụ import những thành phần của một module khác mà module sẽ sử dụng.<br/>

exports: Có nhiệm vụ export các thành phần của provider và các module khác sẻ import để sử dụng.<br/>

`$ nest g module users`
Ngoài ra, Nest còn một tính năng khác đó là Share Module. Bạn có thể chia sẻ bất kì provider nào trong module hiện tại cho các module khác. Ví dụ bạn có thể chia sẻ UserService cho các module khác sử dụng bằng cách thêm nó vào mảng exports trong users.module.ts như sau.

***Global***
Sau khi export, các module khác đều có thể import UsersModule và truy cập vào UsersService để sử dụng.

Còn một tính năng khác trong Nest đó là global module. Nếu bạn không muốn phải import một module nào đó quá nhiều lần thì Nest cung cấp @Global() cho phép bạn sử một module từ module khác mà không cần import. Như vậy chúng ta có thể sử dụng service của các module khác rất dễ dàng phải không. Chỉ cần thêm @Global() như dưới đây là có thể biến nó trở thành global module.
### Controller
Như các bạn đã biết, controller là nơi xử lý các request và trả về response cho người dùng. Mỗi controller sẽ chứa các router thực hiện hành động và nhiệm vụ khác nhau được yêu cầu từ client. Để tạo ra một controller chúng ta sử dụng một và `@Controller()`. `@Controller()` sẽ có nhiệm vụ liên kết class Controller đó với request tương ứng. Chúng ta sẽ tạo một controller cơ bản như sau, bạn cũng có thể tạo controller bằng cmd: `$ nest g controller users`

***API***
Như vậy chúng ta đã tạo ra một API với url `GET: /users.` Trong @Controller mình có sử dụng tiền tố users làm route path, việc sử dụng như vậy sẽ tập hợp các route liên quan và giảm thiểu code lặp lại. Để xác định method cụ thể cho một request chúng ta sẽ define `@Get()` trên function findAll(). Việc khai báo như vậy sẽ giúp Nest có thể ánh xạ request Get: /users đến function `findAll()` này để xử lý và response lại cho client. Ngoài `Get()` thì Nest cũng cung cấp đầy đủ các method như framework khác như `@Post()`, `@Delete()`, `@Put()`, `@Path()`, `@All()`,... Ngoài ta ta cũng có thể truyền path vào @Get chẳng hạn như `@Get('all'`) sẽ tạo ra một api `GET /users/all`. Chúng ta cũng có thể config http status code và header như sau:
```ts
@Post()
@HttpCode(204)
@Header('Cache-Control', 'none')
create() {
  return 'This action adds a new cat';
}
```
***Dto (Data Transfer Object)***
Ngoài ra Nest cũng cho phép ràng buộc dữ liệu gửi lên từ request giúp ngăn chặn những dữ liệu không hợp lệ trước khi thực hiện xử lý, đó là DTO (Data Transfer Object). Trong folder dto chúng ta tạo file create-user.dto.ts:
```ts
export class CreateUserDto {
  name: string;
  age: number;
  address: string;
  job: string;
}
```
Sau đó chúng ta sẽ sử dụng CreateUserDto trong controller để thực hiện ràng buộc data type gửi lên. Trong users.controller.ts hãy thêm như sau:
```ts
@Post()
async create(@Body() createUserDto: CreateUserDto) {
  return 'This action adds a new user';
}
```

***Providers***
<a src = "https://images.viblo.asia/51c7a63b-07cc-4585-b610-3aa8386c0bd1.png"></a> <br/>
Provider là nơi cung cấp các serivce, repositories, factories, helpers,... cho controller trong một module sử dụng. Đây cũng là nơi sẽ chứa những logic xử lý đã được tách biệt với controller. Để tạo ra một provider chúng ta chỉ cần khai báo @Injectable () trước một class đã định nghĩa. Việc sử dụng @Injectable() sẽ cho Nest biết đây là một class thuộc provider. Để tạo ra một service nơi mà chứa các logic xử lý của UserController, chúng ta hãy tạo ra một UserService trong file user.service.ts dưới đây hoặc sử dụng cmd $ nest g service cats

```ts
import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  create(user: User) {
    this.users.push(cat);
  }

  findAll(): User[] {
    return this.users;
  }
  ```
Trong service trên mình có sử dụng một interface để định nghĩa một User. Trong folder interface hãy tạo user.interface.ts nhé:
```ts
export interface User {
  name: string;
  age: number;
  job: string;
}
```
sử dụng nó bên trong các route của controller
```ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './interfaces/user.interface';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
```


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
    validate(payload:any){
     
        return payload
    }
}
```

### Custom Decorator
Click [here](https://docs.nestjs.com/custom-decorators#custom-route-decorators) go to docs