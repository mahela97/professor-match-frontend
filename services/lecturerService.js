const {genSaltSync, hashSync, compareSync} = require("bcrypt");
const {sign} = require("jsonwebtoken");
const Lecturer = require("../schemas/lecturer.schema");
const moment = require("moment");
const Professor = require("../schemas/professor.schema");
const lecProfile = require("../schemas/lecProfile.schema")
const fs = require('fs');


module.exports = {
    saveUser: async (data) => {
        const salt = genSaltSync(10);  //hashing password to save the user
        data.password = hashSync(data.password, salt);
        const user = new Lecturer(data);
        const isExistP = await Professor.findOne({email: data.email});
        const isExistL = await Lecturer.findOne({email:data.email});
        if (isExistP || isExistL) {
            throw new Error("Email already exist");
            return;
        }
        const result = await user.save();
        


        return result;
    },
  sendEmails:async()=>{

  }
  ,
    updateLectureDetails:async(data)=>{
        const isExist = await lecProfile.findOne({lecturer:data.lecturer});
        if (isExist){
            await lecProfile.findOneAndUpdate({lecturer:data.id},data);
        }else{
            await lecProfile.create(data);
        }

    },
    getLecturerInfo:async(id)=>{
        const lecInfo = await lecProfile.findOne({lecturer:id});
        return lecInfo;
    }
}