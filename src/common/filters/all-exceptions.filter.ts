// src/common/filters/all-exceptions.filter.ts
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        // Default to 500 Internal Server Error if no HTTP status is set
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorResponse = {
            success: false,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message:
                exception instanceof HttpException
                    ? exception.getResponse()
                    : 'Internal server error',
        };

        // Log the exception for server-side monitoring
        this.logger.error(
            `${request.method} ${request.url}`,
            JSON.stringify(errorResponse),
            exception instanceof HttpException ? exception.stack : '',
        );

        // Send the error response
        response.status(status).json(errorResponse);
    }
}
