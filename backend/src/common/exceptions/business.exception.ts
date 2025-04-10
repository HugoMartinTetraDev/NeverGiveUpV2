import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    private readonly errorCode?: string,
    private readonly context?: string,
  ) {
    super(
      {
        message,
        errorCode,
        context,
        timestamp: new Date().toISOString(),
      },
      status,
    );
  }
}

// Exceptions spécifiques métier
export class ResourceNotFoundException extends BusinessException {
  constructor(resource: string, id?: string | number) {
    const message = id 
      ? `${resource} avec l'identifiant ${id} n'a pas été trouvé` 
      : `${resource} n'a pas été trouvé`;
    super(message, HttpStatus.NOT_FOUND, 'RESOURCE_NOT_FOUND', resource);
  }
}

export class ResourceAlreadyExistsException extends BusinessException {
  constructor(resource: string, identifier?: string) {
    const message = identifier 
      ? `${resource} avec ${identifier} existe déjà` 
      : `${resource} existe déjà`;
    super(message, HttpStatus.CONFLICT, 'RESOURCE_ALREADY_EXISTS', resource);
  }
}

export class InvalidOperationException extends BusinessException {
  constructor(message: string, context?: string) {
    super(message, HttpStatus.BAD_REQUEST, 'INVALID_OPERATION', context);
  }
}

export class UnauthorizedOperationException extends BusinessException {
  constructor(message: string, context?: string) {
    super(message, HttpStatus.FORBIDDEN, 'UNAUTHORIZED_OPERATION', context);
  }
} 