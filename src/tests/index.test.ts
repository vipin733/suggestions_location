import request from 'supertest';
import IndexRoute from '../routes/index.route';
import LocationService from '../services/location.service';
import { isEmpty, isNumber } from '../utils/util';
import App from '../app';

describe('Application', () => {
  let app: App;

  beforeAll(async () => {
    const indexRoute = new IndexRoute();
    app = new App([indexRoute]);
    return app.connectToDatabase();
  });

  afterAll(async () => {
    return await app.disconnectToDatabase();
  });

  describe('Testing Index', () => {
    describe('[GET] /', () => {
      it('response statusCode 200', () => {
        return request(app.getServer()).get(`/`).expect(200);
      });
    });
  });

  describe('Testing suggestions', () => {
    describe('insert location data', () => {
      it('insert data and return true', async () => {
        await app.dropTable();
        const insert = await app.initializeDBData();
        expect(insert).toStrictEqual(true);
      });

      it('should count already inserted data -->  locations Already Inserted -> 10', async () => {
        const logSpy = jest.spyOn(console, 'log');
        await app.initializeDBData();
        expect(logSpy).toHaveBeenCalledWith('locations Already Inserted -> 10');
      });
    });

    describe('[GET] /suggestions --> return Location[]', () => {
      it('response statusCode 200 with array', async () => {
        const response = await request(app.getServer())
          .get(`/suggestions?q=Abbotsford&latitude=49.05798&longitude=-122.25257&radius=10&sort=distance`)
          .expect(200);
        const body = response.body;
        expect(body.length).toEqual(1);
        expect(body).toStrictEqual([
          {
            name: 'Abbotsford',
            latitude: '-122.25257',
            longitude: '49.05798',
            distance: 0,
          },
        ]);
      });
    });

    describe('[GET] /suggestions --> return empty array Location[]', () => {
      it('response statusCode 200 with empty array if invalid query given', async () => {
        const response = await request(app.getServer()).get(`/suggestions?q=Abbotsfordffefefefef`).expect(200);
        const body = response.body;
        expect(body.length).toEqual(0);
      });

      it('response statusCode 200 with empty array if query not given', async () => {
        const response = await request(app.getServer()).get(`/suggestions`).expect(200);
        const body = response.body;
        expect(body.length).toEqual(0);
      });

      it('response statusCode 200 with empty array if q query not given and rest query given', async () => {
        const response = await request(app.getServer())
          .get(`/suggestions?latitude=49.05798&longitude=-122.25257&radius=10&sort=distance`)
          .expect(200);
        const body = response.body;
        expect(body.length).toEqual(0);
      });
    });

    describe('[GET] /suggestions --> return 500', () => {
      it('response statusCode 500 with message if connection/something error', async () => {
        await app.disconnectToDatabase();
        await request(app.getServer()).get(`/suggestions?q=Abbotsfordffefefefef`).expect(500);
      });
    });

    describe('Testing too many request', () => {
      it('response statusCode 429', async () => {
        await request(app.getServer()).get(`/suggestions`).expect(429);
      });
    });
  });

  describe('check utils function', () => {
    describe('check is empty function', () => {
      it('check isEmpty for string if null then it return true', async () => {
        const is_empty = isEmpty(null);
        expect(is_empty).toStrictEqual(true);
      });

      it(`check isEmpty for string if '' then it return true`, async () => {
        const is_empty = isEmpty('');
        expect(is_empty).toStrictEqual(true);
      });

      it(`check isEmpty for object if empty object then it return true`, async () => {
        const obj = {};
        const is_empty = isEmpty(obj);
        expect(is_empty).toStrictEqual(true);
      });

      it(`check isEmpty for undefined if value undefined then it return true`, async () => {
        const is_empty = isEmpty(undefined);
        expect(is_empty).toStrictEqual(true);
      });

      it(`check isEmpty for value rather that null, undefund, empty object should return false`, async () => {
        let is_empty = isEmpty('ok');
        expect(is_empty).toStrictEqual(false);

        is_empty = isEmpty(1);
        expect(is_empty).toStrictEqual(false);

        const obj = { name: 'name' };
        is_empty = isEmpty(obj);
        expect(is_empty).toStrictEqual(false);
      });
    });

    describe('check isNumber function', () => {
      it('check isNumber for string if string/null/undefined then it return false', async () => {
        let is_number = isNumber('AABBBnull');
        expect(is_number).toStrictEqual(false);

        is_number = isNumber(null);
        expect(is_number).toStrictEqual(false);

        is_number = isNumber(undefined);
        expect(is_number).toStrictEqual(false);
      });

      it('check isNumber for string if string then it return true', async () => {
        let is_number = isNumber('11.4444');
        expect(is_number).toStrictEqual(true);

        is_number = isNumber('0');
        expect(is_number).toStrictEqual(true);
      });
    });
  });

  describe('check helper function', () => {
    describe('validate validateAndGetQueryInput function', () => {
      const locationService = new LocationService();

      it('validateAndGetQueryInput --> throw error if not valid request', async () => {
        const data = 0;
        expect(() => {
          locationService.validateAndGetQueryInput(data);
        }).toThrow('invalid request');

        const mumdata = 'somestring';
        expect(() => {
          locationService.validateAndGetQueryInput(mumdata);
        }).toThrow('invalid request');

        const obj = {};
        expect(() => {
          locationService.validateAndGetQueryInput(obj);
        }).toThrow('invalid request');
      });

      it('validateAndGetQueryInput --> return LocationRequest', async () => {
        const obj = {
          q: 'london',
          latitude: '49.05798',
          longitude: '-122.25257',
          radius: '10',
          sort: 'distance',
        };
        const request = locationService.validateAndGetQueryInput(obj);
        expect(request).toStrictEqual({
          query: 'london',
          latitude: 49.05798,
          longitude: -122.25257,
          radius: 10,
          sort: 'distance',
        });
      });
    });
  });
});
