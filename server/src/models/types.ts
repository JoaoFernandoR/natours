import { Document} from 'mongoose'

interface IUserDocument extends Document {
    name: string;
    photo?: string;
    email: string;
    password: string;
    passwordConfirm: string | undefined;
    passwordChangedAt: Date
  }
  
export interface IUser extends IUserDocument {
    changedPasswordAfter(JWTTimestamp: number): boolean 
}