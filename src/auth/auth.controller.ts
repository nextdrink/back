import { Body, Controller, Post, Get, Query, ValidationPipe, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ConfirmUserDto } from './confirm-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/registration')
  registration(@Body(new ValidationPipe()) userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }

  @Post('/login')
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @Get('/confirm')
  async confirm(@Query() query: ConfirmUserDto) {
    await this.authService.confirm(query.token);
    return true;
  }

  @Post('/forgotPassword')
  async forgotPassword(@Body(new ValidationPipe()) forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Patch('/changePassword')
  async changePassword(@Body(new ValidationPipe()) changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }
}
