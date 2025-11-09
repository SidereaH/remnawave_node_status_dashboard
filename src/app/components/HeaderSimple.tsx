'use client'

import { useState, useEffect } from 'react'
import { Burger, Container, Group, Text, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Image from 'next/image'
import classes from './HeaderSimple.module.css'

const links = [{ link: '/status', label: 'Status' }]

export function HeaderSimple() {
	const [opened, { toggle }] = useDisclosure(false)
	const [active, setActive] = useState(links[0].link)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	const items = links.map(link => (
		<a
			key={link.label}
			href={link.link}
			className={classes.link}
			data-active={active === link.link || undefined}
			onClick={event => {
				event.preventDefault()
				setActive(link.link)
			}}
		>
			{link.label}
		</a>
	))

	if (!mounted) {
		return (
			<header className={classes.header}>
				<Container size='md' className={classes.inner}>
					<div className={classes.logoContainer}>
						<div style={{ width: 28, height: 28 }} />
						<Text fw={700} size='lg'>
							VPN
						</Text>
					</div>
					<div style={{ width: 200 }} />
				</Container>
			</header>
		)
	}

	return (
		<header className={classes.header}>
			<Container size='md' className={classes.inner}>
				<div className={classes.logoContainer}>
					<Image
						src='/Logo.png'
						alt='ShadowNet VPN'
						width={150}
						height={150}
						className={classes.logoImage}
					/>
					{/* <Text fw={700} size='xl' className='gradient-text'>
						Server status
					</Text> */}
					<Title
						order={2}
						size='h1'
						style={{ fontFamily: 'Outfit, var(--mantine-font-family)' }}
						fw={900}
						ta='center'
						className='gradient-text'
					>
						Server status
					</Title>
				</div>
			</Container>
		</header>
	)
}
