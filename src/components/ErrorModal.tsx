import * as React from 'react';
import { Modal } from 'carbon-components-react';

export default function ErrorModal(props) {
    const { message } = props;

    return (
        <Modal passiveModal modalHeading="Sorry We Couldn't Submit Your Post!">
            <p>{message}</p>
        </Modal>
    );
}
