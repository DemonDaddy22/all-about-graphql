type Dog = {
  id: string;
  name: string;
  breed: string;
};

type Dogs = {
  dogs: Dog[];
};

type GetDogsQueryVars = {
  showBreed: boolean;
};
