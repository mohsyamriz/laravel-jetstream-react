import React from "react";
import Modal from "./Modal";

export default function DialogModal({
    title,
    footer,
    show = false,
    maxWidth = "2xl",
    closeable = true,
    onClose = () => {},
    children,
}) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    return (
        <>
            <Modal
                show={show}
                maxWidth={maxWidth}
                closeable={closeable}
                onClose={close}
            >
                <div className="px-6 py-4">
                    <div className="text-lg">{title}</div>
                    <div className="mt-4">{children}</div>
                </div>
                <div className="flex flex-row justify-end px-6 py-4 bg-gray-100 text-right">
                    {footer}
                </div>
            </Modal>
        </>
    );
}
