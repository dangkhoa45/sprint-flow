import { HttpException, HttpStatus } from '@nestjs/common';
import {
  FilterQuery,
  Model,
  // QueryOptions,
  SortOrder,
  Types,
  UpdateQuery,
} from 'mongoose';
import { BaseEntity } from './base.entity';
import { BaseInput, BaseQuery, TimeFrameQuery } from './base.input';

export abstract class BaseService<
  Data extends BaseEntity,
  CreateInput extends BaseInput,
  UpdateInput extends BaseInput | UpdateQuery<Data>,
> {
  constructor(protected readonly model: Model<Data>) {}

  create(input: CreateInput): Promise<Data> {
    return this.model
      .create(input)
      .then((data) => data.toObject())
      .catch((error: Error & { code?: number }) => {
        if (error.code === 11000) {
          throw new HttpException(error.message, HttpStatus.CONFLICT);
        }
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      });
  }

  createMany(input: CreateInput[]): Promise<Data[]> {
    return this.model.create(input);
  }

  buildFilter(query?: FilterQuery<Data> & TimeFrameQuery<Data>) {
    const {
      search,
      searchFields,
      offset,
      limit,
      sortField,
      sortOrder,
      populate,
      timeField,
      timeUnit,
      endTime,
      startTime,
      ...rest
    } = query ?? {};

    const filter = rest as FilterQuery<Data>;

    if (search && searchFields) {
      if (Array.isArray(searchFields)) {
        filter.$or = searchFields.map((field) => ({
          [field as any]: { $regex: search },
        }));
      } else {
        filter[searchFields as keyof Data] = {
          $regex: search,
          $options: 'i',
        } as FilterQuery<Data>[keyof Data];
      }
    }

    filter.$and = [{ status: { $ne: 'Deleted' } }];

    if (timeField) {
      filter[timeField] = {
        $gte: new Date(startTime ?? '2000-01-01'),
        $lte: new Date(endTime ?? '2999-01-01'),
      } as FilterQuery<Data>[keyof Data];
    }

    return {
      filter: filter,
      offset,
      limit,
      sortField,
      sortOrder,
      populate,
      timeUnit,
      timeField,
    };
  }

  findAll(filter?: FilterQuery<Data> & BaseQuery<Data>) {
    const {
      filter: filterOption,
      offset,
      limit,
      sortField = 'createdAt',
      sortOrder = 'desc',
      populate,
    } = this.buildFilter(filter);

    const sortOptions: [string, SortOrder][] = [];
    if (sortField && sortOrder) {
      sortOptions.push([sortField as string, sortOrder]);
    }
    sortOptions.push(['_id', 'desc']);

    const query = this.model
      .find(filterOption)
      .sort(sortOptions)
      .skip(offset ?? 0)
      .limit(limit ?? 0)
      .collation({
        numericOrdering: true,
        locale: 'vi',
      });

    if (populate?.length) {
      return query.populate(
        Array.isArray(populate)
          ? populate.map((field) => ({
              path: field as string,
              strictPopulate: false,
            }))
          : {
              path: populate,
              strictPopulate: false,
            },
      );
    }

    return query.exec();
  }

  countAll(filter?: FilterQuery<Data> & BaseQuery<Data>): Promise<number> {
    const { filter: filterOpt } = this.buildFilter(filter);
    return this.model.countDocuments(filterOpt);
  }

  async findById(
    id: string | Types.ObjectId,
    populate?: (keyof Data)[],
  ): Promise<Data | null | undefined> {
    const query = this.model.findById(id);
    if (populate?.length) {
      const result = await query.populate(
        populate.map((field) => ({
          path: field as string,
          strictPopulate: false,
        })),
      );
      return result?.toObject();
    }
    return query.then((res) => res?.toObject());
  }

  async findOne(
    filter: FilterQuery<Data>,
    populate?: (keyof Data)[],
  ): Promise<Data | null | undefined> {
    const query = this.model.findOne(filter);
    if (populate?.length) {
      const result = await query.populate(
        populate.map((field) => ({
          path: field as string,
          strictPopulate: false,
        })),
      );
      return result?.toObject();
    }
    return query.then((res) => res?.toObject());
  }

  // async findOneAndUpdate(
  //   filter: FilterQuery<Data>,
  //   input: UpdateInput | UpdateQuery<Data>,
  //   options?: QueryOptions,
  // ): Promise<Data | null | undefined> {
  //   const updateQuery = { $set: input };
  //   if (input['$push']) {
  //     updateQuery['$push'] = input['$push'];
  //   }
  //   const result = await this.model.findOneAndUpdate(filter, updateQuery, {
  //     new: true,
  //     ...options,
  //   });
  //   return result?.toObject();
  // }

  async update(
    id: string | Types.ObjectId,
    input: UpdateInput,
  ): Promise<Data | null | undefined> {
    const result = await this.model.findByIdAndUpdate(
      id,
      { $set: input },
      { new: true },
    );
    return result?.toObject();
  }

  updateMany(
    filter: FilterQuery<Data>,
    input: UpdateInput | UpdateQuery<Data>,
  ) {
    return this.model.updateMany(filter, { $set: input });
  }

  softDelete(
    id: string | Types.ObjectId,
    userId: string,
  ): Promise<Data | null> {
    return this.model.findByIdAndUpdate(
      id,
      { $set: { status: 'Deleted', updatedBy: new Types.ObjectId(userId) } },
      { new: true },
    );
  }

  softDeleteAll(filter: FilterQuery<Data>, userId: string) {
    return this.model.updateMany(
      filter,
      { $set: { status: 'Deleted', updatedBy: new Types.ObjectId(userId) } },
      { new: true },
    );
  }

  remove(id: string | Types.ObjectId): Promise<Data | null> {
    return this.model.findByIdAndDelete(id);
  }

  async removeAll(filter?: FilterQuery<Data>): Promise<number> {
    const result = await this.model.deleteMany(filter);
    return result.deletedCount;
  }
}
