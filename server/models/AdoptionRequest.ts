import mongoose, { Schema, Document, Model } from 'mongoose';
import { IPet } from './Pet'; // Assuming IPet exists in a Pet model
import { IUser } from './User';
import { IAdopterFormSubmission } from './AdopterFormSubmission';

// Interface for the AdoptionRequest document
export interface IAdoptionRequest extends Document {
  pet: IPet['_id'];
  user: IUser['_id'];
  formSubmission: IAdopterFormSubmission['_id']; // Reference to the form submission
  status: 'pendiente' | 'aprobada' | 'rechazada';
  contactEmail: string;
  contactPhone: string;
  message?: string;
}

// Interface for the AdoptionRequest model
export interface IAdoptionRequestModel extends Model<IAdoptionRequest> {}

const AdoptionRequestSchema: Schema<IAdoptionRequest> = new Schema(
  {
    pet: {
      type: Schema.Types.ObjectId,
      ref: 'Pet',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    formSubmission: {
      type: Schema.Types.ObjectId,
      ref: 'AdopterFormSubmission',
      required: true,
    },
    status: {
      type: String,
      enum: ['pendiente', 'aprobada', 'rechazada'],
      default: 'pendiente',
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const AdoptionRequest = (mongoose.models.AdoptionRequest as IAdoptionRequestModel) || mongoose.model<IAdoptionRequest, IAdoptionRequestModel>(
  'AdoptionRequest',
  AdoptionRequestSchema
);
