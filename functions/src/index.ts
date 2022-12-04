import * as functions from 'firebase-functions'
import * as jwt from 'jsonwebtoken'
import { config } from './config'
import { db } from './libs/firestore'
import { testEmail as testEmailService } from './libs/nodemailer'

// This is a typical hello world endpoint
export const helloWorld = functions.https.onRequest((request, response) => {
	functions.logger.info('Hello logs!', { structuredData: true })
	response.send('Hello from Firebase!')
})

// This is a trigger function when a doc is added in a collection

// This endpoint is to add multiple data to collection
export const addMultipleData = functions.https.onRequest((request, response) => {
	const collection = request.body.collection as string
	const data = request.body.data as any[]

	Promise.all(data.map(doc => db.collection(collection).doc().set(doc)))
		.then(() => response.send('Data added succesfully'))
		.catch(error => functions.logger.error(error))
})

// This endpoint is only used from SDK
export const createInvitation = functions.https.onCall(async (data, context) => {
	// const text = data.text

	// const uid = context.auth?.uid
	// const name = context.auth?.token.name || null
	// const picture = context.auth?.token.picture || null
	// const email = context.auth?.token.email || null

	// return {
	// 	message: 'This message is an example',
	// 	data,
	// 	uid,
	// 	name,
	// 	picture,
	// 	email,
	// }

	// TODO: Step by step
	// Get data from data
	const { customerId, email, isRequest, timeToExpire, type } = data
	// Verify user role
	const uid = context.auth?.uid
	if (!uid)
		return {
			message: 'User id missed',
		}
	const userRequested = await db.collection('users').doc(uid).get()
	const isAdmin = userRequested.exists ? (userRequested.data()?.roles as string[]).includes('admin') : false
	if (!isAdmin)
		return {
			message: 'User permissions missed',
		}
	// Create token based in time to expire\
	// TODO: Change implicit role to id role and query in db
	const dataToken = {
		role: type,
	}
	const token = jwt.sign(dataToken, config.jwtSecret, { expiresIn: '1d' })
	// Save in db
	await db.collection('invitations').doc().set({
		createdAt: new Date().toString(),
		updatedAt: new Date().toString(),
		email,
		token,
		expiresAt: timeToExpire,
		type,
		customerId,
		used: false,
		isRequest,
	})
	return {
		message: 'Invitation created succesfully',
	}
})

// This function is trigger for auth
export const sendWelcomeEmail = functions.auth.user().onCreate(user => {
	db.collection('emails')
		.doc()
		.set({
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			type: 'WelcomeUser',
			userId: user.uid,
			email: user.email,
		})
		.then(res => functions.logger.info(res))
		.catch(error => functions.logger.error(error))
})

export const registerUserFromInvitation = functions.https.onCall((data, context) => {
	// Verify token expire time
	// Get role to assign
	// If exists customer to associate, validate customer exists
	// Register user
	// Create user row
	// Return info
})

export const testEmail = functions.https.onRequest(async (request, response) => {
	const email = request.body.email
	const emailResponse = await testEmailService(email)
	functions.logger.info(emailResponse, { structuredData: true })
	response.send(emailResponse)
})
