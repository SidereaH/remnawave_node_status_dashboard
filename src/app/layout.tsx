import { ColorSchemeScript, MantineProvider } from '@mantine/core'
import type { Metadata } from 'next'
import '@mantine/core/styles.css'
import './globals.css'
import { theme } from '@/app/theme/theme'

export const metadata: Metadata = {
	title: `${process.env.METADATA_TITLE}`,
	description: `${process.env.METADATA_DESCRIPTION}`,
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en' suppressHydrationWarning>
			<head>
				<ColorSchemeScript defaultColorScheme='light' />
			</head>
			<body>
				<MantineProvider theme={theme} defaultColorScheme='light'>
					{children}
				</MantineProvider>
			</body>
		</html>
	)
}
