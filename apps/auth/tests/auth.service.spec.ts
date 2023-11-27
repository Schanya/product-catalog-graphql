import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from '../src/modules/auth/auth.service';

import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from '../src/modules/jwt/entities';
import { JwtService } from '../src/modules/jwt/jwt.service';
import { User } from '../src/modules/users/entities';
import { UsersService } from '../src/modules/users/users.service';
import { TestDatabaseModule } from './test-database.module';
import { SignUpInput } from '../src/modules/auth/dto';
import { JwtResponse } from '../src/modules/auth/responses';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UsersService;

  let userRepository: Repository<User>;
  let userRepositoryToken: string | Function = getRepositoryToken(User);

  let authService: AuthService;

  let jwtService: JwtService;

  let jwtRepository: Repository<Token>;
  let jwtRepositoryToken: string | Function = getRepositoryToken(Token);

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule, JwtModule],
      providers: [
        UsersService,
        AuthService,
        JwtService,
        ConfigService,
        {
          provide: userRepositoryToken,
          useValue: userRepository,
        },
        {
          provide: jwtRepositoryToken,
          useValue: jwtRepository,
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(userRepositoryToken);

    authService = module.get<AuthService>(AuthService);

    jwtService = module.get<JwtService>(JwtService);
    jwtRepository = module.get<Repository<Token>>(jwtRepositoryToken);
  });

  let signUpInput: SignUpInput;
  let mockUser: User;
  let mockJWT: JwtResponse;

  beforeAll(async () => {
    signUpInput = {
      login: 'test',
      email: 'test@example.com',
      password: 'password',
    };
    mockUser = await authService.createLocalUser(signUpInput);

    const accessToken = await jwtService.generateAccessJwt({
      id: mockUser.id,
      role: mockUser.role,
    });
    const refreshToken = await jwtService.generateRefreshJwt({
      id: mockUser.id,
      role: mockUser.role,
    });

    mockJWT = { accessToken, refreshToken };
  });

  describe('validateUser', () => {
    it('should execute successfully and return a user object', async () => {
      const readByEmailSpy = jest.spyOn(userService, 'readByEmail');

      const result = await authService.validateUser(
        signUpInput.email,
        signUpInput.password,
      );

      expect(readByEmailSpy).toHaveBeenCalledWith(signUpInput.email);
      expect(result).toEqual({ ...mockUser, tokens: [] });
    });

    it('should throw UnauthorizedException if the email address or password is incorrect', async () => {
      const signUpWrongInput: SignUpInput = {
        login: 'test_wrong',
        email: 'test_wrong@example.com',
        password: 'password',
      };

      await expect(
        authService.validateUser(
          signUpWrongInput.email,
          signUpWrongInput.password,
        ),
      ).rejects.toThrow(
        new UnauthorizedException('Incorrect email or password'),
      );
    });
  });

  describe('signUp', () => {
    it('should throw BadRequestException if user with this email already exists', async () => {
      const readByEmailSpy = jest.spyOn(userService, 'readByEmail');
      const createLocalUserSpy = jest.spyOn(authService, 'createLocalUser');

      await expect(authService.signUp(signUpInput)).rejects.toThrow(
        new BadRequestException('User with this email already exists'),
      );
      expect(createLocalUserSpy).toHaveBeenCalledWith(signUpInput, undefined);
      expect(readByEmailSpy).toHaveBeenCalledWith(signUpInput.email);
    });

    it('should create a new local user and return JWT tokens', async () => {
      const signUpUserInput: SignUpInput = {
        login: 'sign_up_test_user',
        email: 'sign_up_test_user@example.com',
        password: 'password',
      };

      const mockSignUpUser = await authService.createLocalUser(signUpUserInput);

      const mockTokens: JwtResponse = {
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
      };

      const createLocalUserSpy = jest
        .spyOn(authService, 'createLocalUser')
        .mockResolvedValueOnce(mockSignUpUser);

      const signInSpy = jest
        .spyOn(authService, 'signIn')
        .mockResolvedValueOnce(mockTokens);

      const result = await authService.signUp(signUpUserInput);

      expect(createLocalUserSpy).toHaveBeenCalledWith(
        signUpUserInput,
        undefined,
      );
      expect(signInSpy).toHaveBeenCalledWith(mockSignUpUser, undefined);
      expect(result).toEqual(mockTokens);

      await userRepository.delete({ id: mockSignUpUser.id });
    });
  });

  describe('signIn', () => {
    it('should generate JWTs, save refresh token and return JWT tokens', async () => {
      const saveJwtSpy = jest.spyOn(jwtService, 'saveJwt');

      const result = await authService.signIn(mockUser);

      expect(result).toEqual(mockJWT);
    });
  });

  afterAll(async () => {
    await jwtService.deleteAllJwt(mockUser.id);
    await userRepository.delete({ id: mockUser.id });
  });
});
