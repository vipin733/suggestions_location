import compression from 'compression';
import express from 'express';
import { connect, set } from 'mongoose';
import { NODE_ENV, PORT } from '@config';
import { dbConnection } from '@databases';
import { Routes } from '@interfaces/routes.interface';
import errorMiddleware from '@middlewares/error.middleware';
import LocationService from '@services/location.service';
import Mongoose from 'mongoose';

class App {
  public locationService: LocationService;
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;
    this.locationService = new LocationService();

    if (this.env !== 'test') {
      this.connectToDatabase();
    }
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`=================================`);
      console.log(`======= ENV: ${this.env} =======`);
      console.log(`🚀 App listening on the port ${this.port}`);
      console.log(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  public async disconnectToDatabase() {
    await this.dropTable();
    await Mongoose.disconnect();
  }

  public async dropTable() {
    const collections = await Mongoose.connection.db.collections();
    if (collections.length) {
      await Mongoose.connection.collection('locations').drop();
    }
    return true;
  }

  public async connectToDatabase() {
    if (this.env === 'development') {
      set('debug', true);
    }
    connect(dbConnection.url, dbConnection.options);
    if (this.env !== 'test') {
      this.initializeDBData();
    }
  }

  private initializeMiddlewares() {
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(__dirname + '/assets'));
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  public async initializeDBData() {
    await this.locationService.importCSV();
    return true;
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
