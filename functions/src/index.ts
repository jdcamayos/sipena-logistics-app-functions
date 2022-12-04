import * as functions from 'firebase-functions'
import { db } from './libs/firestore'

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
export const createInvitation = functions.https.onCall((data, context) => {
	// const text = data.text

	const uid = context.auth?.uid
	const name = context.auth?.token.name || null
	const picture = context.auth?.token.picture || null
	const email = context.auth?.token.email || null

	return {
		message: 'This message is an example',
		data,
		uid,
		name,
		picture,
		email,
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
