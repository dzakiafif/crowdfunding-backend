import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { CommonModule } from "@app/common/common.module";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "@app/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { BadRequestException } from "@nestjs/common";

jest.mock("bcrypt", () => ({
  __esModule: true,
  default: {
    hash: jest.fn(),
    compare: jest.fn(),
  },
}));

describe("AuthService", () => {
  let service: AuthService;
  let jwtService: JwtService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            users: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
      imports: [CommonModule],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("register", () => {
    it("should hash password and create a user", async () => {
      const email = faker.internet.email();
      const password = "Gulali123@";
      const name = faker.person.fullName();
      const hashesPassword =
        "$2b$12$g9E92rHmEjURX/x.TvfvduCtVu5iGF7CapB1J/Wdgpoug1y0qF1qK";

      (bcrypt.hash as jest.Mock).mockReturnValue(hashesPassword);
      (prismaService.users.findUnique as jest.Mock).mockReturnValue(null);
      (bcrypt.compare as jest.Mock).mockReturnValue(true);
      (prismaService.users.create as jest.Mock).mockResolvedValue({
        id: 1,
        email,
        password: hashesPassword,
        name,
        role: "USER",
      });
      const result = await service.register({ email, password, name });

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 12);
      expect(prismaService.users.create).toHaveBeenCalledWith({
        data: { email, password: hashesPassword, name, role: "USER" },
      });
      expect(result).toEqual({
        id: 1,
        email,
        password: hashesPassword,
        name,
        role: "USER",
      });
    });

    it("should throw error if email already registered", async () => {
      const email = "test@gmail.com";
      const password = "Gulali123@";
      const name = "test";
      const hashesPassword =
        "$2b$12$Q4ueoKAn9QvALF7ZQZjUqO722XRQ3JiTRx1KNVAGBgrnIYf2TIyke";

      (prismaService.users.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        email,
        password: hashesPassword,
      });

      await expect(service.register({ email, password, name })).rejects.toThrow(
        BadRequestException,
      );

      expect(prismaService.users.findUnique).toHaveBeenCalledWith({
        where: { email },
      });

      expect(prismaService.users.create).not.toHaveBeenCalled();
    });
  });
});
