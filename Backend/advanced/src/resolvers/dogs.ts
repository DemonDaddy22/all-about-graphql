import { DOGS } from '../data/dogs';

export const dogResolvers = {
  Query: {
    dogs: () => DOGS,
  },
  Mutation: {
    addDog: (_: any, args: { name: string; breed: string }) => {
      const newDog = {
        id: (DOGS.length + 1).toString(),
        name: args.name,
        breed: args.breed,
      };
      DOGS.push(newDog);
      return newDog;
    },
  },
};
