import {
  ArgumentsHost,
  BadRequestException,
  ExceptionFilter,
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof BadRequestException) {
      const { message } = exception.getResponse() as {
        message: string | string[];
      };

      response.status(400).json({
        message: 'Invalid field',
        errors: Array.isArray(message) ? message : [message],
      });
    } else if (exception instanceof UnauthorizedException) {
      response.status(401).json({
        message: exception.message,
      });
    } else if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        message: exception.message,
      });
    } else if (exception instanceof NotFoundException) {
      response.status(404).json({
        message: exception.message,
      });
    } else {
      response.status(500).json({
        message: exception.message,
      });
    }
  }
}
