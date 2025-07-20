import { ApiProperty } from '@nestjs/swagger';

export class UploadTiktokVideoDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'MP4 video file to upload',
  })
  video: any;

  @ApiProperty({
    type: 'string',
    description: 'TikTok Access Token',
    example:
      'act.IB5KjgoxsyQShqmVmoHHyp0nmgJD9tmYX2UuDLpEqKY8cAP0FAl3KJUJEiHY!4507.va',
  })
  accessToken: string;
}
