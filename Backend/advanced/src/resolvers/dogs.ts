import { DOGS } from '../data/dogs';

export const dogResolvers = {
  Query: {
    getDogs: () => DOGS,
  },
};
