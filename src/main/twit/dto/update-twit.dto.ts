import { PartialType } from '@nestjs/mapped-types';
import { CreateTwitDto } from './create-twit.dto';

export class UpdateTwitDto extends PartialType(CreateTwitDto) {}
