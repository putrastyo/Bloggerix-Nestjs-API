import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChangePasswordDto, LoginDto, RegisterDto, UpdateUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { UserOnJwt } from './types/user-jwt.type';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserResponse } from 'src/model/user.model';
import { Tokens } from './types/tokens.type';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<Tokens> {
    // cek password konfirm
    if (registerDto.password !== registerDto.confirm_password) {
      throw new BadRequestException("Confirm password doesn't match");
    }
    // cek email exist
    const user = await this.prismaService.user.count({
      where: {
        email: registerDto.email,
      },
    });
    if (user) throw new BadRequestException('email already exist');
    // hash password
    registerDto.password = await bcrypt.hash(registerDto.password, 10);
    // create user
    const newUser = await this.prismaService.user.create({
      data: {
        name: registerDto.name,
        email: registerDto.email,
        password: registerDto.password,
        role: registerDto.role,
        avatar: registerDto.avatar,
      },
    });
    // dapetin token
    const tokens = await this.getTokens({
      sub: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar_url: newUser.avatar,
      refreshToken: newUser.refresh_token,
    });
    // update tokennya di database
    await this.updateRefreshToken(newUser.id, tokens.refresh_token);
    // return
    return tokens;
  }

  async login(loginDto: LoginDto): Promise<Tokens> {
    // cek akun ada
    const user = await this.prismaService.user.findUnique({
      where: { email: loginDto.email },
    });
    if (!user) throw new UnauthorizedException("Can't find acount");
    // cek password bener
    const isPasswordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordMatch) throw new UnauthorizedException("Can't find acount");
    // dapetin token baru
    const payload: UserOnJwt = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar,
      refreshToken: user.refresh_token,
    };
    const tokens = await this.getTokens(payload);
    // update token di db
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    // return token
    return tokens;
  }

  async logout() {}

  async current(user: UserOnJwt): Promise<UserOnJwt> {
    return user;
  }

  async refreshToken(userId: number, refreshToken: string): Promise<Tokens> {
    // cari user
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new ForbiddenException('Access Denied');
    // cek refresh tokennya
    const isRefreshTokenMatch = await bcrypt.compare(
      refreshToken,
      user.refresh_token,
    );
    if (!isRefreshTokenMatch) throw new ForbiddenException('Access Denied');
    // buat token baru
    const newRefreshToken = await this.getTokens({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar,
      refreshToken: user.refresh_token,
    });
    // perbarui token
    await this.updateRefreshToken(user.id, newRefreshToken.refresh_token);
    // return token
    return newRefreshToken;
  }

  async update(
    user: UserOnJwt,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    const updatedUser = await this.prismaService.user.update({
      where: { id: user.sub },
      data: updateUserDto,
    });
    delete updatedUser.password;
    return updatedUser;
  }

  async changePassword(
    userId: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<UserResponse> {
    // cari user
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    // cek password
    const isOldPasswordMatch = await bcrypt.compare(
      changePasswordDto.old_password,
      user.password,
    );
    if (!isOldPasswordMatch) {
      throw new BadRequestException('Old password is wrong');
    }
    // cek konfirm new password
    if (
      changePasswordDto.new_password !== changePasswordDto.confirm_new_password
    ) {
      throw new BadRequestException("Confirm new password is doesn't match");
    }
    // ubah password
    changePasswordDto.new_password = await bcrypt.hash(
      changePasswordDto.new_password,
      10,
    );
    const changedUser = await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        password: changePasswordDto.new_password,
      },
    });

    return changedUser;
  }

  async getTokens(payload: UserOnJwt): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: payload.sub,
          name: payload.name,
          email: payload.email,
          role: payload.role,
          avatar_url: payload.avatar_url,
        },
        {
          secret:
            this.config.get('AT_SECRET') || 'Shhh--bloggerix1036847aoigef',
          expiresIn: 60 * 15, // 15 menit
        },
      ),
      this.jwtService.signAsync(
        {
          sub: payload.sub,
          name: payload.name,
          email: payload.email,
          role: payload.role,
          avatar_url: payload.avatar_url,
        },
        {
          secret: this.config.get('RT_SECRET') || 'Shhh--bloggerix218751872pp',
          expiresIn: 60 * 60 * 24 * 7, // 7 hari
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.prismaService.user.update({
      where: { id: userId },
      data: { refresh_token: hashedToken },
    });
  }
}
