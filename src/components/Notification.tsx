import * as React from 'react';
import { useState, useEffect } from 'react';
import { ToastNotification } from 'carbon-components-react';

interface Props {
	handleClose: any;
	subtitle: any;
	title: string;
	kind: any;
}

export default function BlogList({ handleClose, subtitle, title, kind }: Props) {
	const [ notificationClassName, setNotificationClassName ] = useState('slide-in');

	const close = () => {
		setNotificationClassName('slide-out');
		// wait for animation before running call back
		setTimeout(handleClose, 1000);
	};

	// set notification to auto close after 30 seconds
	useEffect(() => {
		const timer = setTimeout(close, 30000);
	}, []);

	return (
		<ToastNotification
			kind={kind}
			caption={
				<a href="#" onClick={close}>
					Dismiss
				</a>
			}
			subtitle={subtitle}
			title={title}
			style={{
				position: 'fixed',
				top: '6rem',
				left: '3rem',
				zIndex: 2
			}}
			className={notificationClassName}
			hideCloseButton={true}
		/>
	);
}
