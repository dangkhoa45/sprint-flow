import { PartialType } from '@nestjs/mapped-types';
import { CreateSessionDto } from './create-session';

export class UpdateSessionDto extends PartialType(CreateSessionDto) {}
