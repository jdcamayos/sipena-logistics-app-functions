export interface EmailConfig {
	service: string
	host: string
	port: number
	secure: boolean
	auth: {
		user: string
		pass: string
	}
	tls: {
		ciphers: string
		rejectUnauthorized: boolean
	}
	logger: boolean
	debug: boolean
}

export interface Config {
	jwtSecret: string
	emailConfig: EmailConfig
}

export interface Template {
	from: string
	to: string
	subject: string
	text: string
	html: string
}
