import { Router } from 'express'
import { isValidObjectId } from 'mongoose'
import { validateEnablerDesignation } from '../helpers/validation.helper'
import { EnablerDesignationRequest } from '../models/http/request/enabler-designation.request.model'
import { EnablerCategory } from '../schemas/enabler-category.schema'
import { EnablerDesignation } from '../schemas/enabler-designation.schema'

const router = Router({ mergeParams: true })

router.get('/', async (req, res) => {
  try {
    const { categoryId } = req.params as any
    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({ message: 'invalid object id' })
    }

    const designations = await EnablerDesignation.find({ category: categoryId })
    return res.json(designations)
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id, categoryId } = req.params as any
    if (!isValidObjectId(id) || !isValidObjectId(categoryId)) {
      return res.status(400).json({ message: 'invalid object id' })
    }

    const designation = await EnablerDesignation.findOne({
      _id: id,
      category: categoryId,
    })
    if (!designation) {
      return res.status(404).json({ message: 'designation not found' })
    }

    return res.json(designation)
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { categoryId } = req.params as any
    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({ message: 'invalid object id' })
    }

    const body = req.body as EnablerDesignationRequest
    const { error } = validateEnablerDesignation(body)

    if (error) {
      return res.status(400).send({ message: error.details[0].message })
    }

    const existingDesignation = await EnablerDesignation.findOne({
      name: body.name,
      category: categoryId,
    })
    if (existingDesignation) {
      return res
        .status(400)
        .send({ message: 'designation with this name already found' })
    }

    const category = await EnablerCategory.findById(categoryId)
    if (!category) {
      return res.status(400).json({ message: 'category not found' })
    }

    const newDesignation = new EnablerDesignation({
      name: body.name,
      category: categoryId,
    })
    await newDesignation.save()

    category.designations.push(newDesignation.id)
    await category.save()

    return res.json(newDesignation)
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { id, categoryId } = req.params as any
    if (!isValidObjectId(id) || !isValidObjectId(categoryId)) {
      return res.status(400).json({ message: 'invalid object id' })
    }

    const body = req.body as EnablerDesignationRequest
    const { error } = validateEnablerDesignation(body)

    if (error) {
      return res.status(400).send({ message: error.details[0].message })
    }

    const designation = await EnablerDesignation.findOne({
      _id: id,
      category: categoryId,
    })
    if (!designation) {
      return res.status(404).json({ message: 'designation not found' })
    }

    designation.name = body.name
    await designation.save()

    return res.json(designation)
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id, categoryId } = req.params as any
    if (!isValidObjectId(id) || !isValidObjectId(categoryId)) {
      return res.status(400).json({ message: 'invalid object id' })
    }

    const designation = await EnablerDesignation.findOne({
      _id: id,
      category: categoryId,
    })
    if (!designation) {
      return res.status(404).json({ message: 'designation not found' })
    }

    await designation.delete()

    return res.status(204).send()
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message })
  }
})

export { router as enablerDesignationRouter }
