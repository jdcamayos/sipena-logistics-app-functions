import { config } from '../config'
import { Template } from '../types'
import { testEmailTemplate } from '../utils/emailTemplate'
import * as nodemailer from 'nodemailer'

const sendEmail = async (template: Template) => {
	const transporter = nodemailer.createTransport(config.emailConfig)
	return await transporter.sendMail({
		...template,
		from: `${template.from} <${config.emailConfig.auth.user}>`,
	})
}

export const testEmail = (to: string) => {
	return sendEmail(testEmailTemplate(to))
}
