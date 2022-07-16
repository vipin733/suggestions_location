import LocationService from '@/services/location.service';
import { isEmpty } from '@/utils/util';
import { NextFunction, Request, Response } from 'express';

class IndexController {
  public locationService = new LocationService();

  public index = async (_: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({ data: 'ok' });
    } catch (error) {
      next(error);
    }
  };

  public suggestions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      //if query is empty
      const query = req.query;
      if (isEmpty(query)) {
        return res.status(200).json([]);
      }

      //vallidating the request input
      const locationRequest = this.locationService.validateAndGetQueryInput(req);

      //if no query input for search
      if (!locationRequest.query) {
        return res.status(200).json([]);
      }

      const findAllLocationssData = await this.locationService.findAllLocations(locationRequest);
      res.status(200).json(findAllLocationssData);
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
