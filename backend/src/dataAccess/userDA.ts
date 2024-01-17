import User, { UserCreationAttributes } from "../entities/Users";


import Request from "../entities/Requests";
import { Like } from "./operators";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Requests } from "../entities/dbConst";
import userFilterDto from "./models/userFilterDto";
import { where } from "sequelize";
import db from "../dbConfig";
import Sequelize, { Model, Optional } from 'sequelize';


interface UserWithMethods extends UserCreationAttributes {
  validPassword(password: string): Promise<boolean>;
}

async function createUser(user: UserCreationAttributes) {
  return await User.create(user, { include: [{ model: Request, as: Requests }] });
}
async function loginUser(email: string, password: string) {
  try {
    const user = await User.findOne({ where: { Email: email } }) as UserWithMethods | null;
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await user.validPassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

   
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}
async function getUserById(id: number) {
  return await User.findByPk(id, { include: [Requests] });
}

async function getUsers(userFilter: userFilterDto) {
  if (!userFilter.take) userFilter.take = 10;
  if (!userFilter.skip) userFilter.skip = 0; // Fix typo here

  let whereClause: any = {};
  if (userFilter.name) whereClause.Name = { [Like]: `%${userFilter.name}%` };
  if (userFilter.email) whereClause.email = { [Like]: `%${userFilter.email}` };

  return await User.findAndCountAll({
    distinct: true,
    where: whereClause,
    limit: userFilter.take,
    offset: userFilter.skip * userFilter.take,
  });
}

async function deleteUser(id: number) {
  let deleteElem = await User.findByPk(id);

  if (!deleteElem) {
    console.log("This element does not exist, so it cannot be deleted");
    return;
  }
  return await deleteElem.destroy();
}

async function updateUser(User: UserCreationAttributes, id: number) {
  const findUser = await getUserById(User.Id);

  if (!findUser) {
    console.log("This User does not exist");
    return;
  }

  const t = await db.transaction();
  try {
    await findUser.update(User);

    // deleted
    const existRequest = await Request.findAll({
      where: {
        Id: User.Id,
      },
    });

    if (existRequest.length > 0) {
      let RequestIds = existRequest.map((a) => a.dataValues.Id);
      let RequestIdsDeleted = RequestIds.filter((id) => !User.Requests.find((add) => add.Id === id)?.Id);
      if (RequestIdsDeleted.length > 0)
        await Request.destroy({
          where: {
            Id: RequestIdsDeleted,
          },
        });
    }

    // inserted
    const insertedA = User.Requests.filter((a) => a.Id === 0);
    if (insertedA.length > 0) await Request.bulkCreate(insertedA);

    // updated
    const updatedA = User.Requests.filter((a) => a.Id !== 0);
    if (updatedA.length > 0) {
      for (let item of updatedA) {
        const findA = await Request.findByPk(item.Id);
        await findA?.update(item);
      }
    }

    await t.commit();
  } catch (e) {
    await t.rollback();
    throw e;
  }
}

export { createUser, getUserById, getUsers, deleteUser, updateUser, loginUser };
