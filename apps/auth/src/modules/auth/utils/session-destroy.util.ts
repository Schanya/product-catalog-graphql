import { Response } from 'express';

export function sessionDestroy(res: Response): void {
  const request = res['req'];

  request.session.destroy(() => {});
}
