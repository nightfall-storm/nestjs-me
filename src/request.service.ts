import { Injectable, Scope } from '@nestjs/common';

@Injectable({scope: Scope.REQUEST})
export class RequestService {
  private userId: number;

  getUserId() {
    return this.userId;
  }

  setUserId(userId: number) {
    this.userId = userId;
  }
}
