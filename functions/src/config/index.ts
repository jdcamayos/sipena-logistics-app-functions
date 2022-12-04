import { Config } from '../types'

export const config: Config = {
	jwtSecret: process.env.JWT_SECRET || '$uP3R$3kR3+',
	emailConfig: {
		service: 'Outlook365',
		host: ' smtp.office365.com',
		port: 587,
		secure: true,
		auth: {
			user: 'info@sipenalogistics.com.au',
			pass: 'Casa2026Australia',
		},
		tls: {
			ciphers: 'SSLv3',
			rejectUnauthorized: false,
		},
		logger: true,
		debug: true,
	},
}
