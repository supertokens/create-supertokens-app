import { SupertokensExceptionFilter } from './auth.filter';

describe('SupertokensExceptionFilter', () => {
  it('should be defined', () => {
    expect(new SupertokensExceptionFilter()).toBeDefined();
  });
});
