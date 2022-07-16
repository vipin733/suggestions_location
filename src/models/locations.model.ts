import { model, Model, Schema } from 'mongoose';
import { LocationDB, LocationRequest } from '@/interfaces/locations.interface';
import { SortingEnum } from '@/utils/util';

interface LocationModel extends Model<LocationDB> {
  findByDistance(locationRequest: LocationRequest): any;
}

const locationSchema: Schema = new Schema({
  location_id: {
    type: Number,
    required: true,
    unique: true,
  },
  location: { type: { type: String }, coordinates: [Number] },
  name: {
    type: String,
    required: true,
  },
});

locationSchema.index({ location: '2dsphere' });

locationSchema.static('findByDistance', function (locationRequest: LocationRequest) {
  const unitValue = 1000;
  const aggregate = [
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [locationRequest.longitude, locationRequest.latitude],
        },
        maxDistance: locationRequest.radius * unitValue,
        distanceField: 'distance',
        distanceMultiplier: 1 / unitValue,
      },
    },

    {
      $match: {
        name: { $regex: locationRequest.query, $options: 'i' },
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
        location: 1,
      },
    },
  ];

  let sortingBy: Object = {
    distance: 1,
  };

  if (locationRequest.sort == SortingEnum.Name) {
    sortingBy = {
      name: 1,
    };
  }

  return this.aggregate([
    ...aggregate,
    ...[
      {
        $sort: sortingBy,
      },
    ],
  ]);
});

const locationModel = model<LocationDB, LocationModel>('Location', locationSchema);

export default locationModel;
