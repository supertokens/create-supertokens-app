import { Controller, Get, UseGuards } from '@nestjs/common';
import { SessionContainer } from 'supertokens-node/recipe/session';
import Multitenancy from 'supertokens-node/recipe/multitenancy';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { Session } from './auth/session.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/sessioninfo')
  @UseGuards(new AuthGuard())
  getSessionInformation(@Session() session: SessionContainer): any {
    return {
      sessionHandle: session.getHandle(),
      userId: session.getUserId(),
      accessTokenPayload: session.getAccessTokenPayload(),
    };
  }

  // This API is used by the frontend to create the tenants drop down when the app loads.
  // Depending on your UX, you can remove this API.
  @Get('/tenants')
  async getTenants(): Promise<any> {
    return await Multitenancy.listAllTenants();
  }
}
