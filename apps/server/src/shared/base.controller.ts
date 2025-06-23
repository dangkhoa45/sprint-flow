import { Body, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { CurrentUser } from 'src/decorators/current-user.decor';
import { TokenPayload } from 'src/modules/auth/dto/tokenPayload';
import { BadRequestResponse, ListDataResponse } from './base.dto';
import { BaseEntity } from './base.entity';
import { BaseInput, BaseQuery } from './base.input';
import { BaseService } from './base.service';

export class BaseController<
  Data extends BaseEntity,
  CreateInput extends BaseInput,
  UpdateInput extends BaseInput,
> {
  constructor(
    private readonly baseService: BaseService<Data, CreateInput, UpdateInput>,
  ) {}

  @Post()
  @ApiBody({ type: Object })
  @ApiCreatedResponse({ type: Object })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  async create(
    @Body() createInput: CreateInput,
    @CurrentUser() user: TokenPayload,
  ) {
    createInput.createdBy = new Types.ObjectId(user.sub);
    return await this.baseService.create(createInput);
  }

  @Get()
  @ApiQuery({ type: BaseQuery<any> })
  @ApiOkResponse({ type: ListDataResponse<Data> })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  async findAll(@Query() query: Data & BaseQuery<Data>) {
    const items = await this.baseService.findAll(query);
    const total = await this.baseService.countAll(query);

    return {
      items,
      total,
      query,
    };
  }

  @Get('count')
  @ApiQuery({ type: BaseQuery<any> })
  @ApiOkResponse({ type: ListDataResponse<Data> })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  countAll(@Query() query: Data & BaseQuery<Data>) {
    return this.baseService.countAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: Object })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  findOne(@Param('id') id: string) {
    return this.baseService.findById(id);
  }

  @Patch(':id')
  @ApiBody({ type: Object })
  @ApiOkResponse({ type: Object })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  update(
    @Param('id') id: string,
    @Body() updateInput: UpdateInput,
    @CurrentUser() user: TokenPayload,
  ) {
    updateInput.updatedBy = new Types.ObjectId(user.sub);
    return this.baseService.update(id, updateInput);
  }

  @Delete(':id')
  @ApiOkResponse({ type: Object })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  remove(@Param('id') id: string, @CurrentUser() user: TokenPayload) {
    return this.baseService.softDelete(id, user.sub);
  }
}
