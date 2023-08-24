import mongoose from 'mongoose'
import { EnablerDesignation as EnablerDesignationModel } from '../models/db/enabler_designation.model'

const enablerDesignation = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'enabler_category',
  },
})

const EnablerDesignation = mongoose.model<EnablerDesignationModel>(
  'enabler_designation',
  enablerDesignation
)

export { EnablerDesignation }
