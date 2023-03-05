import mongoose from 'mongoose'
import { EnablerCategory as EnablerCategoryModel } from '../models/db/enabler_category.model'

const enablerCategory = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  designations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'enabler_designations',
    },
  ],
})

const EnablerCategory = mongoose.model<EnablerCategoryModel>(
  'enabler_category',
  enablerCategory
)

export { EnablerCategory }
