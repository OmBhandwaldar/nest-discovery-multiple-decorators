import 'reflect-metadata';
import { Controller, Injectable, Module } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService, NestFactory } from '@nestjs/core';

// Two independent discoverable decorators, e.g. from two libraries
export const ScheduledJob = DiscoveryService.createDecorator<{ name: string }>();
export const Audited = DiscoveryService.createDecorator();

@ScheduledJob({ name: 'cleanup' })
@Audited()
@Injectable()
class CleanupService {}

@Audited()
@ScheduledJob({ name: 'report' })
@Injectable()
class ReportService {}

@ScheduledJob({ name: 'admin' })
@Audited()
@Controller()
class AdminController {}

@Module({
  imports: [DiscoveryModule],
  providers: [CleanupService, ReportService],
  controllers: [AdminController],
})
class AppModule {}

const app = await NestFactory.createApplicationContext(AppModule, {
  logger: false,
});
const discovery = app.get(DiscoveryService);

for (const [name, decorator] of [
  ['ScheduledJob', ScheduledJob],
  ['Audited', Audited],
] as const) {
  const providers = discovery
    .getProviders({ metadataKey: decorator.KEY })
    .map(wrapper => wrapper.name);
  const controllers = discovery
    .getControllers({ metadataKey: decorator.KEY })
    .map(wrapper => wrapper.name);
  console.log(
    `${name.padEnd(12)} providers: ${JSON.stringify(providers)}, controllers: ${JSON.stringify(controllers)}`,
  );
}

await app.close();
