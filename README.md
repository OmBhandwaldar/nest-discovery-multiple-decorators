# DiscoveryService misses classes with two discoverable decorators

Minimal reproduction for NestJS: two decorators created with `DiscoveryService.createDecorator()`
(`ScheduledJob` and `Audited`), applied together to two providers and a controller.
`getProviders({ metadataKey })` and `getControllers({ metadataKey })` only return a class for the
decorator applied last (the top one), so each decorator misses some of the classes it was applied to.

Tested with `@nestjs/core` 12.2.0 (also 10.4.15 and 11.1.6), Node.js 24.16.0, macOS.

```sh
npm install
npm start
```

Output:

```
ScheduledJob providers: ["CleanupService"], controllers: ["AdminController"]
Audited      providers: ["ReportService"], controllers: []
```

Expected: `["CleanupService","ReportService"]` and `["AdminController"]` for both decorators.
