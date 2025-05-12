import supertest from 'supertest';
import { server}  from '../src/index';
import 'dotenv/config';
import { UsersModel } from '../src/model/usersModel';

const userModel = new UsersModel();
let user  = {
  username: 'Anders',
  age: 20,
  hobbies: ['blackjack', 'poker'],
};

const anotherUser = {
  username: 'Brad',
  age: 25,
  hobbies: ['cars', 'guns'],
};

  describe('first pack of tests', () => {
    const endpoint = '/api/users';
    let id = '';
    let secondId = '';
    it('GET api/users should return empty array of users', async () => {
      const { body, statusCode } = await supertest(server).get(endpoint);
      expect(statusCode).toEqual(200);
      expect(body).toEqual([]);
    });
    it('POST api/users/ should create user', async () => {
      const { body, statusCode } = await supertest(server)
        .post(endpoint)
        .send(user);
      expect(statusCode).toEqual(201);
      expect(body.username).toEqual(user.username);
      expect(body.age).toEqual(user.age);
      expect(JSON.stringify(body.hobbies)).toEqual(
        JSON.stringify(user.hobbies),
      );
      id = body.id;
    });
    it('GET api/users/{id} should get user by id', async () => {
      const { body, statusCode } = await supertest(server).get(
        `${endpoint}/${id}`,
      );
      expect(statusCode).toEqual(200);
      expect(JSON.stringify(body)).toEqual(JSON.stringify({ ...user, id }));
    });
    it('PUT should update user by id', async () => {
      user = { ...user, hobbies: [...user.hobbies, 'testing'] };
      const { body, statusCode } = await supertest(server)
        .put(`${endpoint}/${id}`)
        .send(user);
      expect(statusCode).toEqual(200);
      expect(body.username).toEqual(user.username);
      expect(body.age).toEqual(user.age);
      expect(JSON.stringify(body.hobbies)).toEqual(
        JSON.stringify(user.hobbies),
      );
      expect(body.id).toEqual(id);
    });
    it('GET should create second user', async () => {
      const response = await supertest(server).post(endpoint).send(anotherUser);
      secondId = response.body.id;
      const { body, statusCode } = await supertest(server).get(endpoint);
      expect(statusCode).toEqual(200);
      expect(body.length).toEqual(2);
      const [user1, user2] = body;
      delete user1.user.id;
      delete user2.user.id;
      expect(JSON.stringify(user1.user)).toEqual(JSON.stringify(user));
      expect(JSON.stringify(user2.user)).toEqual(JSON.stringify(anotherUser));
    });
    it('DELETE should delete first user', async () => {
      const { statusCode } = await supertest(server).delete(`${endpoint}/${id}`);
      expect(statusCode).toEqual(204);
      const { body } = await supertest(server).get(endpoint);
      expect(JSON.stringify(body)).toEqual(
        JSON.stringify([{ id: secondId, user: {...anotherUser , id: secondId} }]),
      );
    });
  });
  afterAll(() => {
    server.close();
  });