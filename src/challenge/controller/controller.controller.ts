import { Controller, Get } from '@nestjs/common';

@Controller('controller')
export class ControllerController {
  @Get()
  findAll(): string {
    return 'This action returns all users';
  }
}
