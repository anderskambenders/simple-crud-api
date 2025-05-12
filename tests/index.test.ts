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
  describe('second pack of tests', () => {
    let id = '';
    const endpoint = '/api/users';
    const wrongId = '/invalid_url';
    it(`Get should return 404 if user not found"`, async () => {
      const { body, statusCode } = await supertest(server).get('/invalid_url');
      expect(statusCode).toEqual(404);
    });
    it('Should return status code 400 about invalid body', async () => {
      const { body, statusCode } = await supertest(server)
        .post(endpoint)
        .send({ ...user, hobbies: null });
      expect(statusCode).toEqual(400);
    });
    it(`Should return message "UserId invalid_uuid is invalid."`, async () => {
      const { body, statusCode } = await supertest(server).get(
        `${endpoint}/invalid_uuid`,
      );
      expect(statusCode).toEqual(400);
      expect(body).toEqual("UserId invalid_uuid is invalid.");
    });
    it(`Should return message "User with id doesn't exist."`, async () => {
      const res = await supertest(server).post(endpoint).send(user);
      id = res.body.id;
      await supertest(server).delete(`${endpoint}/${id}`);
      const { body, statusCode } = await supertest(server).get(
        `${endpoint}/${id}`,
      );
      expect(statusCode).toEqual(404);
      expect(body).toEqual(`User with id ${id} doesn't exist.`);
    });
  });
  describe('third tests pack', () => {
    let id = '';
    const endpoint = '/api/users';
    it('Should return 3 users', async () => {
      const promises : any[] = [];
      for (let i = 0; i < 2; i += 1) {
        promises.push(
          supertest(server)
            .post(endpoint)
            .send({ ...user, age: user.age + i }),
        );
      }
      await Promise.all(promises);
      const { body } = await supertest(server).get(endpoint);
      expect(body.length).toEqual(3);
      id = body[1].id;
    });
    it('Should get updated user with selected id', async () => {
      const response = await supertest(server).get(`${endpoint}/${id}`);
      const updatedUser = { ...response.body, hobbies: [] };
      delete updatedUser.id;
      const { body, statusCode } = await supertest(server)
        .put(`${endpoint}/${id}`)
        .send(updatedUser);
      expect(statusCode).toEqual(200);
      expect(JSON.stringify(body)).toEqual(
        JSON.stringify({ ...updatedUser, id }),
      );
    });
    it('Should return "User with id doesnt exist."', async () => {
      await supertest(server).delete(`${endpoint}/${id}`);
      const { body, statusCode } = await supertest(server).get(
        `${endpoint}/${id}`,
      );
      expect(statusCode).toEqual(404);
      expect(body).toEqual(`User with id ${id} doesn't exist.`);
    });
  });
  afterAll(() => {
    server.close();
  });
