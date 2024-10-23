import Fastify from 'fastify';
import { FastifyInstance } from 'fastify/types/instance';
import { resolve } from 'node:path';
import { v4 as uuid } from 'uuid';
import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { readFileSync, readdirSync } from 'fs';

import { ServiceLocator } from './factories/service.locator';
import { LogFactory } from './factories/log.factory';

declare module 'fastify' {
	export interface FastifyRequest {
		start: number;
	}
}

export class App {
	private readonly _log = LogFactory.getInstance().createLogger('HTTP');
	private readonly _config = ServiceLocator.getInstance().configSource.config;
	private readonly _fastify: FastifyInstance;

	constructor() {
		this._fastify = Fastify({
			requestIdLogLabel: 'requestId',
			genReqId: () => uuid(),
			https:
				this._config.ENV === 'development'
					? {
							key: readFileSync(resolve(__dirname, '../', '../', this._config.SSL_SERVER_KEY)),
							cert: readFileSync(resolve(__dirname, '../', '../', this._config.SSL_SERVER_CRT)),
						}
					: undefined,
		});

		// CORS
		this._fastify.register(fastifyCors, { origin: '*' });

		// Добавляем логирование начала запроса
		this._fastify.decorateRequest('start', 0);
		this._fastify.addHook('preHandler', (request, reply, done) => {
			request.start = Date.now();
			this._log.info(`${request.id} ${request.method} ${request.url} starting...`);
			done();
		});

		// Логируем время на запрос
		this._fastify.addHook('onResponse', (request, reply, done) => {
			const ms = new Date().getTime() - request.start;
			if (reply.statusCode >= 200 && reply.statusCode < 400) {
				this._log.info(`${request.id} ${request.method} ${request.url} done in ${ms}ms ${reply.statusCode}`);
			} else {
				this._log.error(`${request.id} ${request.method} ${request.url} done in ${ms}ms ${reply.statusCode}`);
			}
			done();
		});

		// Обработка ошибок
		this._fastify.setErrorHandler((exception, request, reply) => {
			this._log.error({
				method: `${request.method} ${request.url}`,
				status: exception.statusCode || 500,
				requestId: request.id,
				message: exception.message,
				exception,
				stack: exception.stack,
			});
			reply.status(exception.statusCode || 500).send({
				method: `${request.method} ${request.url}`,
				status: exception.statusCode || 500,
				requestId: request.id,
				message: exception.message,
				exception,
				stack: exception.stack,
			});
		});
		// Дополнительно для локальной разработки
		if (this._config.ENV === 'development') {
			// Сваггер
			this._fastify.register(fastifySwagger, {
				openapi: {
					info: {
						title: 'Outsource Retail Swagger',
						description: 'Outsource Retail API Reference',
						version: '0.1.0',
					},
					components: {
						securitySchemes: {
							bearerAuth: {
								type: 'http',
								scheme: 'bearer',
							},
						},
					},
				},
			});
			this._fastify.register(fastifySwaggerUi, {
				routePrefix: '/docs',
				uiConfig: {
					defaultModelRendering: 'model',
				},
			});
		}

		const schemes = readdirSync(resolve(__dirname, '../', '../', 'schemes')).map(res =>
			resolve(__dirname, '../', '../', 'schemes', res),
		);
		for (const schema of schemes) {
			this._fastify.addSchema(JSON.parse(readFileSync(schema, 'utf-8')));
		}

		// new ApiRouter(this._fastify, { bodyLimit: this._config.MAX_FILE_SIZE });
		// this._fastify.register(new ApiRouter(), { prefix: '/api' });
	}

	public async run() {
		await this._fastify
			.listen({
				port: this._config.HTTP_SERVER_PORT,
				host: this._config.HTTP_SERVER_HOST,
			})
			.then(() => {
				this._log.info(
					`API Server started success https://${this._config.HTTP_SERVER_HOST}:${this._config.HTTP_SERVER_HOST}`,
				);
			})
			.catch(exception => {
				this._log.error({ method: 'run', exception });
			});
	}
}
