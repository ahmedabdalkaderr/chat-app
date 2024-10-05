import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({ summary: 'Sign in and get JWT token' }) // Short description
  @ApiBody({
    description: 'The credentials for logging in',
    type: AuthDto, // Swagger will generate fields based on the AuthDto structure
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in and JWT token returned',
    schema: {
      example: {
        access_token: 'JWT_TOKEN_HERE',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  singIn(@Body() signInDto: AuthDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @ApiOperation({ summary: 'Get the current user profile' }) // Short description
  @ApiBearerAuth() // Indicates this route requires JWT in the Authorization header
  @ApiResponse({
    status: 200,
    description: 'Returns the current logged-in user profile',
    schema: {
      example: {
        id: 1,
        email: 'user@example.com',
        name: 'Adam',
        role: 'user',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
