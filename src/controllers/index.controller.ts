import LocationService from '@/services/location.service';
import { isEmpty } from '@/utils/util';
import { Request, Response } from 'express';
class IndexController {
  public locationService = new LocationService();

  public index = async (_: Request, res: Response) => {
    return res.status(200).json({ data: 'ok' });
  };

  public suggestions = async (req: Request, res: Response) => {
    try {
      //if query is empty
      const query = req.query;
      if (isEmpty(query)) {
        return res.status(200).json([]);
      }

      //vallidating the request input
      const locationRequest = this.locationService.validateAndGetQueryInput(query);

      //if no query input for search
      if (!locationRequest.query) {
        return res.status(200).json([]);
      }

      const findAllLocationssData = await this.locationService.findAllLocations(locationRequest);
      res.status(200).json(findAllLocationssData);
    } catch (error) {
      res.status(500).json({ message: 'server error' });
    }
  };
}

export default IndexController;
