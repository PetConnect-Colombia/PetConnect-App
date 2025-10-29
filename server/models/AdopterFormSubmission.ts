import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';

// Interface for the AdopterFormSubmission document
export interface IAdopterFormSubmission extends Document {
  fullName: string;
  email: string;
  phone: string;
  housingType: string;
  hasOtherPets: boolean;
  hasChildren: boolean;
  livesWithAdults: boolean;
  ageRange: string;
  department: string;
  city: string;
  petPreference: string;
  reasonForAdoption: string;
  user?: IUser['_id']; // Optional reference to the User model
  status: 'pendiente' | 'revisado' | 'contactado';
}

// Interface for the AdopterFormSubmission model
export interface IAdopterFormSubmissionModel extends Model<IAdopterFormSubmission> {}

const AdopterFormSubmissionSchema: Schema<IAdopterFormSubmission> = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    housingType: { type: String, required: true },
    hasOtherPets: { type: Boolean, default: false },
    hasChildren: { type: Boolean, default: false },
    livesWithAdults: { type: Boolean, default: false },
    ageRange: { type: String, required: true },
    department: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    petPreference: { type: String, required: true },
    reasonForAdoption: { type: String, required: true, trim: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    status: {
      type: String,
      enum: ['pendiente', 'revisado', 'contactado'],
      default: 'pendiente',
      required: true,
    },
  },
  { timestamps: true }
);

export const AdopterFormSubmission = (mongoose.models.AdopterFormSubmission as IAdopterFormSubmissionModel) || mongoose.model<IAdopterFormSubmission, IAdopterFormSubmissionModel>(
  'AdopterFormSubmission',
  AdopterFormSubmissionSchema
);
