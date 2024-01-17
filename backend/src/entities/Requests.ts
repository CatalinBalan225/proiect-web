import db from '../dbConfig';
import Sequelize from 'sequelize';
import { ModelDefined } from 'sequelize';
// import { RequestAttributes } from './Requests';

import { UserAttributes } from './Users';



export interface RequestAttributes{
    Id: number,
    Title: string,
    Description: string,
    File: string,
    Student_id: number,
    Professor_id: number
    Users: UserAttributes[]
 

}

export interface RequestCreationAttributes extends RequestAttributes {
}

const Request : ModelDefined<RequestAttributes, RequestCreationAttributes> = db.define("Requests", 
{
    Id:
    {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    Title: 
    {
        type: Sequelize.STRING,
        allowNull: false
    },

    Description:
    {
        type: Sequelize.STRING,
        allowNull: false
    },
    File:
    {
        type: Sequelize.STRING,
        allowNull: true
    },

    Student_id: 
    {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',  
            key: 'student_id'    // foreign key
        }
        

        
    },
    
    Professor_id: 
    {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',  
            key: 'professor_id'    // foreign key
        }
    }      
});

export default Request;