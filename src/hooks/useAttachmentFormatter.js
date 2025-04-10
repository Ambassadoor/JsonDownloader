const useAttachmentFormatter = (files) => {

    const attachments = files.map((file) => ({
        fileUrl: file.url,
        title: file.name,
        mimeType: file.mimeType,
    }))

    return { attachments }
}

export default useAttachmentFormatter