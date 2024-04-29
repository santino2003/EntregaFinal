import { faker, th } from "@faker-js/faker";



export const generateProduct = () => {
  return {
    
      _id: faker.datatype.id(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      code: faker.datatype.number(),
      stock: faker.datatype.number(),
      category: faker.commerce.department(),
      satatus: faker.datatype.boolean(),
      thumbnail: faker.image.imageUrl(),
  };
};

