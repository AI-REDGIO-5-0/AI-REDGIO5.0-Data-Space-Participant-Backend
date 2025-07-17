import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';

@Controller('user')
@ApiTags('user')
// @ApiBearerAuth()
// @ApiUnauthorizedResponse({
//     description: 'Unauthorized.',
//     schema: {
//         example: {
//             message: 'Unauthorized',
//             status: 401,
//         },
//     },
// })
// @ApiNotFoundResponse({
//     description: 'NotFound.',
//     schema: {
//         example: {
//             message: 'NotFound',
//             status: 404,
//         },
//     },
// })
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    // @ApiOkResponse({
    //     description: 'Consumer response',
    //     schema: { example: { asset_uuid: 'ae755a90-b7bc-4c28-bfc8-7a4fb247328b', message: 'Table created' } },
    // })
    async register(
        @Body() data: CreateUserDto,
    ) {
        return await this.userService.register(data);
    }

    @Delete(':id')
    async delete(@Param('id') id: string){
        return await this.userService.deleteUser(id)
    }

    @Get(':id')
    async retireveUser(@Param('id') id: string){
        return await this.userService.retrieveUser(id)
    }
}

