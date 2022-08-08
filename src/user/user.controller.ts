import { Controller, Get, Param, Post,Body, Delete } from '@nestjs/common';
import { User } from './entity/uset.entities';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService:UserService) {};

    @Get()
    findAll():Promise<User[]> {
        return this.userService.findAll();
    }

    @Get()
    findOne(@Param("id") id:number):Promise<User> {
        return this.findOne(id);
    }

    @Post()
    create(@Body() user:User ) {
        console.log('sdaasdas', user);
        return this.userService.create(user)
    }

    @Delete()
    remove(@Param('id') id:number) {
        this.userService.remove(id);
    }
}
