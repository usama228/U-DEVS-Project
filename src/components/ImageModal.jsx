import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { IMAGES } from '../jsx/constant/theme';

const ImageModal = ({ src, alt, className, imgClassName }) => {
    const [show, setShow] = useState(false);
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
        setImgSrc(src);
    }, [src]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleError = () => {
        setImgSrc(IMAGES.avatar);
    };

    return (
        <>
            <img 
                src={imgSrc || IMAGES.avatar} 
                alt={alt} 
                className={className} 
                onClick={handleShow} 
                onError={handleError} 
            />

            <Modal show={show} onHide={handleClose} centered dialogClassName="image-modal">
                <Modal.Body>
                    <img src={imgSrc || IMAGES.avatar} alt={alt} className={imgClassName} onError={handleError} />
                </Modal.Body>
                <button type="button" className="btn-close" onClick={handleClose}></button>
            </Modal>
        </>
    );
};

export default ImageModal;
