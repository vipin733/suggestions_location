import { Location, LocationDB, LocationRequest } from '@/interfaces/locations.interface';
import LocationModel from '@/models/locations.model';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';
import { isEmpty, isNumber } from '@/utils/util';
import { NODE_ENV } from '@config';

class LocationService {
  /**
   * @method findAllLocations
   * @param {LocationRequest} locationRequest
   * @returns {Location[]} locations
   * @description find locations from database
   */
  public async findAllLocations(locationRequest: LocationRequest): Promise<Location[]> {
    //preparing data for query

    const locationsDB = await LocationModel.findByDistance(locationRequest);

    //preparing data for output response
    const locations = this.makeResponseData(locationsDB);

    return locations;
  }

  /**
   * @method importCSV
   * @param {}
   * @returns {} void
   * @description check if csv data inserted or not if not then insert
   */
  public async importCSV(): Promise<boolean> {
    const locationsAlreadyInserted = await LocationModel.countDocuments();
    console.log('locations Already Inserted -> ' + locationsAlreadyInserted);

    if (!locationsAlreadyInserted) {
      let locations = await this.readFiles();
      if (NODE_ENV == 'test') {
        locations = locations.slice(0, 10);
      }
      await LocationModel.insertMany(locations);
    }
    return true;
  }

  /**
   * @method validateAndGetQueryInput
   * @param {Request}  req
   * @returns {LocationRequest} locationRequest
   * @description validate query inpurt and prepare input
   */
  public validateAndGetQueryInput(query: any): LocationRequest {
    if (typeof query !== 'object') {
      throw new Error('invalid request');
    }

    if (isEmpty(query)) {
      throw new Error('invalid request');
    }

    const locationRequest: LocationRequest = {
      query: query.q ? String(query.q) : null,
      latitude: isNumber(String(query.latitude)) ? Number(query.latitude) : 0,
      longitude: isNumber(String(query.longitude)) ? Number(query.longitude) : 0,
      radius: isNumber(String(query.radius)) ? Number(query.radius) : 0,
      sort: query.sort ? String(query.sort) : null,
    };
    return locationRequest;
  }

  /**
   * @method readFiles
   * @param {Request}  req
   * @returns {LocationDB[]} locations
   * @description  read csv data
   */
  private async readFiles(): Promise<LocationDB[]> {
    const locations: LocationDB[] = [];
    const url = path.join(__dirname, '../assets/cities_canada-usa.csv');
    return new Promise((res, reject) => {
      fs.createReadStream(url)
        .pipe(csv.parse({ headers: true }))
        .on('error', error => reject(error))
        .on('data', row => {
          const location: LocationDB = {
            name: row.name,
            location: { type: 'Point', coordinates: [Number(row.long), Number(row.lat)] },
            location_id: Number(row.id),
            distance: null,
          };
          locations.push(location);
        })
        .on('end', () => res(locations));
    });
  }

  /**
   * @method makeResponseData
   * @param {LocationDB[]}  locationsDB
   * @returns {Location[]} locations
   * @description  return user response
   */
  private makeResponseData(locationsDB: LocationDB[]): Location[] {
    const locations: Location[] = [];
    for (let index = 0; index < locationsDB.length; index++) {
      const element = locationsDB[index];

      const coordinates = element.location.coordinates;
      let latitude = '';
      let longitude = '';
      if (coordinates && coordinates.length) {
        latitude = coordinates[0].toString();
        longitude = coordinates[coordinates.length - 1].toString();
      }

      const location: Location = { name: element.name, latitude, longitude, distance: Number(element.distance.toFixed(2)) };
      locations.push(location);
    }
    return locations;
  }
}

export default LocationService;
