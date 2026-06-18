import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new UnauthorizedException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const firm = await this.prisma.firm.create({
      data: {
        name: dto.firmName,
        phone: dto.phone,
        city: dto.city,
        state: dto.state,
        users: {
          create: {
            email: dto.email,
            passwordHash,
            firstName: dto.firstName,
            lastName: dto.lastName,
            role: 'owner',
          },
        },
      },
      include: { users: true },
    });

    const user = firm.users[0];
    const token = this.generateToken(user.id, user.email, firm.id);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      firm: {
        id: firm.id,
        name: firm.name,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { firm: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user.id, user.email, user.firmId);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      firm: {
        id: user.firm.id,
        name: user.firm.name,
      },
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { firm: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      firm: {
        id: user.firm.id,
        name: user.firm.name,
        phone: user.firm.phone,
        city: user.firm.city,
        state: user.firm.state,
        totalRepairBenches: user.firm.totalRepairBenches,
      },
    };
  }

  private generateToken(userId: string, email: string, firmId: string): string {
    return this.jwtService.sign({ sub: userId, email, firmId });
  }
}
