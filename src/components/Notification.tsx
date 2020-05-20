import * as React from 'react';
import { useState } from 'react';
import { ToastNotification } from 'carbon-components-react';

interface Props {
	handleClose: any;
	subtitle: any;
	title: string;
	kind: any;
}

export default function BlogList({ handleClose, subtitle, title, kind }: Props) {
	const [ notificationClassName, setNotificationClassName ] = useState('slide-in');

	return (
		<ToastNotification
			kind={kind}
			caption={
				<a
					href="#"
					onClick={() => {
						setNotificationClassName('slide-out');
						handleClose();
					}}
				>
					Dismiss
				</a>
			}
			subtitle={subtitle}
			timeout={10000}
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
