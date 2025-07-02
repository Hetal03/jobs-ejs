// Replace these with your actual models
const User = require("../models/User"); 
const { fakerEN_US: faker } = require("@faker-js/faker");
const FactoryBot = require("factory-bot");
require("dotenv").config();

const testUserPassword = faker.internet.password();
const factory = FactoryBot.factory;
const factoryAdapter = new FactoryBot.MongooseAdapter();
factory.setAdapter(factoryAdapter);

// Define your factory (adjust model fields accordingly)
factory.define("user", User, {
  name: () => faker.person.fullName(),
  email: () => faker.internet.email(),
  password: () => faker.internet.password(),
});

const seed_db = async () => {
  let testUser = null;
  try {
    await User.deleteMany({});
    testUser = await factory.create("user", { password: testUserPassword });
  } catch (e) {
    console.log("Database seeding error:", e.message);
    throw e;
  }
  return testUser;
};

module.exports = { testUserPassword, factory, seed_db };
