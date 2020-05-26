import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { render } from 'node-sass';

interface Props {
    filename: string;
    size: string;
}

export default function Thumbnail(props: Props) {
    const thumbnailDimensions = useRef(null);
    const [ thumbnailClass, setThumbnailClass ] = useState('thumbnail')

    const addPortraitClass = () => {
        // @ts-ignore
        if(thumbnailDimensions && thumbnailDimensions.current.offsetHeight > thumbnailDimensions.current.offsetWidth) {
            setThumbnailClass('thumbnail thumbnail-portrait');
        }
    }

    return (
        <div className={props.size}>
            <img
            className={thumbnailClass}
            src={`/api/images/${props.filename}`}
            ref={thumbnailDimensions}
            onLoad={() => addPortraitClass()}
            />
        </div>
    );
}