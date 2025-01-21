import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { CommonModule } from "@app/common/common.module";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "@app/prisma/prisma.service";
import { faker } from "@faker-js/faker";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService, PrismaService],
      imports: [CommonModule],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should be registered", async () => {
    const response = await service.register({
      email: faker.internet.email(),
      password: "Gulali123@",
      name: faker.person.fullName(),
    });
    expect(response).toBeDefined();
  });
});
