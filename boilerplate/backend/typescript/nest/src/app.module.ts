import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SuperTokensConfig } from './config'; // Changed import style

@Module({
  imports: [
    AuthModule.forRoot({
      // try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
      // Access properties from the directly imported object
      connectionURI: SuperTokensConfig.supertokens.connectionURI,
      // apiKey: "IF YOU HAVE AN API KEY FOR THE CORE, ADD IT HERE",
      appInfo: SuperTokensConfig.appInfo, // Keep this correct one
      // Removed duplicate/incorrect appInfo line below
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
