import { UserModel } from '../models/user';
import { UserRepository } from '../repository/userRepository';
import { UpdateFilter } from '../controllers/user';

export const addNewUser = async (newUser: any, repository: UserRepository): Promise<UserModel | string> => {

  const createdUser = await repository.addNewUser(newUser);
  return createdUser;
  
};

export const findAllUsers = async (repository: UserRepository): Promise<UserModel[] | null> => {
  if (!repository){
    throw new Error('Missing parameters');
  }
  const users = await repository.findAllUsers();
  return users;
};

export const findUserById = async (Id: string, repository: UserRepository): Promise<UserModel | null> => {
  if (!Id){
    throw new Error('Id is missing');
  }
  const user = repository.findUserById(Id);
  
  return user;
};


export const deleteUserById = async (Id: string, repository: UserRepository) => {
  if (!Id){
    throw new Error('Id is missing');
  }
  const deletedUser = await repository.deleteUserById(Id);
  if (!deletedUser){
    return 'User to delete not found';
  } else {
    return deletedUser;
  }
};

// export const authenticateUser = async (user: any, repository: UserRepository): Promise<any> => {
//   const userFound = await repository.findUserByEmail(user.email);
//   if (userFound.length === 0){
//     return false;
//   }
//   if (user.password === userFound[0].password){ //TODO hay que usar bcryptjs
//     return {
//       userId: userFound[0]._id,
//       message: 'Ok'
//     };
//   }
//   return false;
// };

export const updateUser = async (filter: UpdateFilter, data: any, repository: UserRepository): Promise<UserModel | string> => {
  const updatedUser = await repository.updateUser(filter, data);
  if (updatedUser === null){
    return 'User not found';
  } else {    
    return updatedUser;
  }

};