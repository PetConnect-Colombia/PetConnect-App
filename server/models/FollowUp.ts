import mongoose, { Schema, Document, Model } from 'mongoose';
import { IAdoptionRequest } from './AdoptionRequest';

// Interface for the FollowUp document
export interface IFollowUp extends Document {
  adoptionRequest: IAdoptionRequest['_id'];
  visitType: '1-month' | '3-month' | '6-month';
  visitDate: Date;
  status: 'Programada' | 'Completada';
  mood?: string;
  health?: string;
  weight?: number;
  notes?: string;
}

// Interface for the FollowUp model
export interface IFollowUpModel extends Model<IFollowUp> {}

const FollowUpSchema: Schema<IFollowUp> = new Schema(
  {
    adoptionRequest: {
      type: Schema.Types.ObjectId,
      ref: 'AdoptionRequest',
      required: true,
    },
    visitType: {
      type: String,
      enum: ['1-month', '3-month', '6-month'],
      required: true,
    },
    visitDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Programada', 'Completada'],
      default: 'Programada',
      required: true,
    },
    mood: {
      type: String,
      trim: true,
    },
    health: {
      type: String,
      trim: true,
    },
    weight: {
      type: Number,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const FollowUp = (mongoose.models.FollowUp as IFollowUpModel) || mongoose.model<IFollowUp, IFollowUpModel>('FollowUp', FollowUpSchema);
