import { Test, TestingModule } from '@nestjs/testing';
import { SupertokensService } from './supertokens.service';
import { ConfigInjectionToken } from '../config.interface';
import { SuperTokensConfig } from '../../config';

describe('SupertokensService', () => {
  let service: SupertokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupertokensService,
        {
          provide: ConfigInjectionToken,
          useValue: {
            appInfo: SuperTokensConfig.appInfo,
            connectionURI: SuperTokensConfig.supertokens?.connectionURI,
          },
        },
      ],
    }).compile();

    service = module.get<SupertokensService>(SupertokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
