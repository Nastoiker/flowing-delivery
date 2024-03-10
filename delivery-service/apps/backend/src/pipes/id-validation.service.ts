import { Injectable } from '@nestjs/common';
import { ArgumentMetadata, PipeTransform } from '@nestjs/common/interfaces';
@Injectable()
export class IdValidationPipe implements PipeTransform {
    transform(value: string, metadata: ArgumentMetadata) {
        if (metadata.type != 'param') {
            return value;
        }
        return value;
    }
}   