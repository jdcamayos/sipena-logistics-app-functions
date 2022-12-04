import { Template } from '../types'

export const testEmailTemplate = (to: string): Template => {
	return {
		from: 'Test message',
		to,
		subject: 'This is a test',
		text: 'This is a test',
		html: `
    <h1>This is a test</h1>`,
	}
}
