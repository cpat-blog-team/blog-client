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
	const [ animation, setAnimation ] = useState('slide-in');

	const close = () => {
		setAnimation('slide-out');
		// wait for animation before running call back
		setTimeout(handleClose, 1000);
	};

	useEffect(() => {
		// set notification to auto close after 30 seconds
		setTimeout(close, 30000);
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
			className={`notification ${animation}`}
			hideCloseButton={true}
		/>
	);
}
