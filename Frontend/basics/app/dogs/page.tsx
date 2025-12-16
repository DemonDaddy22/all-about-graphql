'use client';

import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';

const DOG_FIELDS = gql`
  fragment DogFields on Dog {
    id
    name
    breed
  }
`;

const GET_DOGS = gql`
  query {
    dogs {
      ...DogFields
    }
  }
  ${DOG_FIELDS}
`;

const ADD_DOG = gql`
  mutation AddDog($name: String!, $breed: String!) {
    addDog(name: $name, breed: $breed) {
      id
      name
      breed
    }
  }
`;

export default function DogsPage() {
  const { data, loading, error } = useQuery<Dogs>(GET_DOGS, {
    fetchPolicy: 'cache-first',
  });
  const [addDogMutation, { loading: mutationLoading }] = useMutation(ADD_DOG);

  const handleAddDog = () => {
    addDogMutation({
      variables: {
        name: 'New Dog',
        breed: 'Unknown Breed',
      },
      update: (cache, { data: mutationData }) => {
        const existingDogs = cache.readQuery<Dogs>({ query: GET_DOGS });
        if (existingDogs && mutationData) {
          cache.writeQuery({
            query: GET_DOGS,
            data: {
              dogs: [...existingDogs.dogs, (mutationData as { addDog: Dog }).addDog],
            },
          });
        }
      },
    });
  };

  if (loading || mutationLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <section className='p-8'>
      <button onClick={handleAddDog} className='rounded bg-cyan-800 text-white p-2 cursor-pointer mb-4'>
        Add dog
      </button>
      <ul>
        {data?.dogs.map(dog => (
          <li key={dog.id}>
            {dog.name} | {dog.breed}
          </li>
        ))}
      </ul>
    </section>
  );
}
