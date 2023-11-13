import { Response } from 'express';

export function setCookie(res: Response, data: any): void {
  const response = res['res'];

  response.cookie('auth-cookie', data, {
    httpOnly: true,
    sameSite: true,
  });
}
