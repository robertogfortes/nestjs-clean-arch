// DynamicModule: tipo retornado por módulos configurados em runtime; Module: decorator obrigatório
import { DynamicModule, Module } from '@nestjs/common';
// ConfigModule: classe base que gerencia o .env; ConfigModuleOptions: tipo das opções aceitas por ela
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
// join: monta caminhos de forma segura entre sistemas operacionais
import { join } from 'node:path';
// nosso service que expõe getAppPort() e getNodeEnv()
import { EnvConfigService } from './env-config.service';

// registra o EnvConfigService como provider neste módulo
@Module({
  providers: [EnvConfigService],
})
// estende o ConfigModule para reaproveitar sua lógica e sobrescrever apenas o forRoot()
export class EnvConfigModule extends ConfigModule {
  // método estático padrão de módulos dinâmicos; options permite passar isGlobal, validationSchema, etc do AppModule
  static forRoot(options: ConfigModuleOptions = {}): Promise<DynamicModule> {
    return super.forRoot({
      ...options, // repassa qualquer opção extra recebida do AppModule
      envFilePath: [
        // monta o caminho absoluto até o .env correto; 4 níveis acima pois o módulo está em src/shared/infrastructure/env-config/
        join(__dirname, `../../../../.env.${process.env.NODE_ENV}`),
      ],
    });
  }
}
