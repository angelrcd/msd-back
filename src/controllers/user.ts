//Controllers -> me dejan los datos bonitos para el servicio
//Services -> COntrolan la logica de la aplicacion

import { Request, Response } from 'express';
import { User } from '../models/user';
import { UserRepositoryMongo } from '../repository/userRepository';
import { addNewUser, findAllUsers, findUserById, deleteUserById, updateUser } from '../services/user';
import isValidId from '../scripts/checkId';
import { encryptPassword } from '../helpers/encryptPassword';
import { filterUserModel } from '../helpers/filterModels';
import { filterUser } from '../helpers/filterUser';

const controller: any = {}; //He puesto any porque si no me decia que "getUsers property does not exist on type {}" , habria que poner una interfaz

const emailValidator: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passValidator: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;


controller.getAll = async (req: Request, res: Response): Promise<void> => {
  const userRepository = new UserRepositoryMongo();
  try {
    const users = await findAllUsers(userRepository);
    res.status(200).json(users);
    return;
  } catch (err) {
    res.status(500);
    return;
  }
};


controller.getById = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId;
  if (!userId || !isValidId(userId)){
    res.status(400).send('Invalid user ID');
    return;
  }
  try {
    const userRepository = new UserRepositoryMongo();
    const user = await findUserById(userId, userRepository);
    console.log(user);
    if (!user){
      res.status(400).send('User not found');
      return;
    }
    //Filter the user JSON
    const filteredUser = filterUser(user, filterUserModel);

    res.status(200).json(filteredUser);
  } catch (err) {
    res.status(500).send('Error');
  }
};

controller.add = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = new User(req.body);
    if (!user){
      res.status(400).send('Missing user');
      return;
    }
    if (!user.email || !user.password){
      res.status(400).send('Missing parameters');
      return;
    }
    if (!user.email.match(emailValidator)) {
      res.status(400).send('Incorrect user/password');
      return;
    }
    if (!user.password.match(passValidator)) {
      res.status(400).send('Incorrect user/password');
      return;
    }

    
    user.password = encryptPassword(user.password);

    const userRepository = new UserRepositoryMongo();
    const addedUser = await addNewUser(user, userRepository);
    if (addedUser === 'User already exists' || addedUser === 'Unexpected error'){
      res.status(401).send(addedUser);
      return;
    }
    res.status(200).json(addedUser);
    return;
  } catch (err) {
    res.status(500).json('Error');
  }
};


controller.deleteById = async (req: Request, res: Response): Promise<void> => {
  const userRepository = new UserRepositoryMongo();
  const userId = req.params.userId;
  if (!userId || !isValidId(userId)){
    res.status(400).send('Invalid user ID');
    return;
  }
  try {
    const deletedUser = await deleteUserById(userId, userRepository);
    if (deletedUser === 'User to delete not found'){
      res.status(400).send('User doesn\'t exists');
      return;
    }
    res.status(200).send('OK');
    return;
  } catch (err) {
    res.status(500).send('Error deleting');
    return;
  }
};


export interface UpdateFilter {
  _id: string
}

controller.updateById = async (req: Request, res: Response): Promise<void> => {
  const userRepository = new UserRepositoryMongo();
  const userId = req.params.userId;
  if (!userId || !isValidId(userId)){
    res.status(400).send('Invalid user ID');
    return;
  }

  const filter: UpdateFilter = {
    '_id': userId
  };

  const data = req.body;

  console.log(data);

  try {
    const updatedUser = await updateUser(filter, data, userRepository);
    
    if (updatedUser == 'User not found') {
      res.status(400).send('User not found');
      return;
    } else {   
      res.status(200).send('Ok');
      return;
    }
  } catch (err) {
    res.status(500).send('Error updating user');
  }
};

export default controller;