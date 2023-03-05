import { Router } from 'express'
import { isValidObjectId } from 'mongoose'
import { validateEnablerCategory } from '../helpers/validation.helper'
import { EnablerCategoryRequest } from '../models/http/request/create-enabler-category.request.model'
import { EnablerCategory } from '../schemas/enabler-category.schema'
import { enablerDesignationRouter } from './enabler_designation.route'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const categories = await EnablerCategory.find()
    return res.json(categories)
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'invalid object id' })
    }

    const category = await EnablerCategory.findById(id)
    if (!category) {
      return res.status(404).json({ message: 'category with id not found' })
    }

    return res.json(category)
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message })
  }
})

router.post('/', async (req, res) => {
  try {
    const body = req.body as EnablerCategoryRequest
    const { error } = validateEnablerCategory(body)

    if (error) {
      return res.status(400).send({ message: error.details[0].message })
    }

    const existingCategory = await EnablerCategory.findOne({ name: body.name })
    if (existingCategory) {
      return res
        .status(400)
        .send({ message: 'category with this name already found' })
    }

    const newCategory = new EnablerCategory({ name: body.name })
    await newCategory.save()
    return res.json(newCategory)
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'invalid object id' })
    }

    const body = req.body as EnablerCategoryRequest
    const { error } = validateEnablerCategory(body)

    if (error) {
      return res.status(400).send({ message: error.details[0].message })
    }

    const category = await EnablerCategory.findById(id)
    if (!category) {
      return res.status(404).send({ message: 'category with the id not found' })
    }

    category.name = body.name
    await category.save()

    return res.json(category)
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'invalid object id' })
    }

    const category = await EnablerCategory.findById(id)
    if (!category) {
      return res.status(404).send({ message: 'category with the id not found' })
    }

    await category.delete()
    return res.status(204).send()
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message })
  }
})

router.use('/:categoryId/enabler-designations', enablerDesignationRouter)

export { router as enablerCategoryRouter }
