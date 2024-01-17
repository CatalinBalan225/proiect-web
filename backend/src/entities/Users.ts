import db from '../dbConfig';
import Sequelize, { Model, Optional } from 'sequelize';
import { ModelDefined } from 'sequelize';
import { RequestAttributes } from './Requests';

import bcrypt from 'bcrypt';

interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {
    validPassword(password: string): Promise<boolean>;
  }

export interface UserAttributes{
    Id : number,
    Name: string,
    Email: string,
    Is_student: boolean,
    faculty: string,
    password: string | null,
   
    Requests: RequestAttributes[]
   
}

export interface UserCreationAttributes extends UserAttributes {}

const User : ModelDefined<UserAttributes, UserCreationAttributes> = db.define("Users", 
{
    Id:
    {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    Name: 
    {
        type: Sequelize.STRING,
        allowNull: false
    },

    Email:
    {
        type: Sequelize.STRING,
        allowNull: false
    },

  

    Faculty:
    {
        type: Sequelize.STRING,
        allowNull: false 
    },  
    
    Is_student:
    {
        type: Sequelize.BOOLEAN,
        allowNull: true ,
    },

    Password:
    {
        type: Sequelize.STRING,
        allowNull: false 
    }
    
});
User.prototype.validPassword = async function(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.Password);
};
export default User;