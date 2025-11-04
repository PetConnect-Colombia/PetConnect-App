import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for the Donation document
export interface IDonation extends Document {
  stripeSessionId: string;
  amount: number;
  currency: string;
  description: string;
  donorEmail?: string; // Email from Stripe session, if available
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

// Interface for the Donation model
export interface IDonationModel extends Model<IDonation> {}

const DonationSchema: Schema<IDonation> = new Schema(
  {
    stripeSessionId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    description: { type: String, required: true },
    donorEmail: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending', required: true },
  },
  { timestamps: true }
);

export const Donation = (mongoose.models.Donation as IDonationModel) || mongoose.model<IDonation, IDonationModel>('Donation', DonationSchema);
