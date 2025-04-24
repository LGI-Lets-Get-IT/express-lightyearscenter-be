const { google } = require('googleapis')

const getAllFiles = async (appointmentId, uuid, clientName) => {
    const authClient = new google.auth.GoogleAuth({
        keyFile: './the-lightyears-cdc-0cb82813d8e5.json',
        scopes: [ "https://www.googleapis.com/auth/drive" ]
    })

    const driveApi = google.drive({
        version: 'v3',
        auth: authClient
    })
    const folderName = `Appointment_${appointmentId}/${clientName}_${uuid}`

    const folderId = await driveApi.files.list({
        q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
    })

    if (!folderId.data.files.length) {
        throw new Error(`Fol    der "${folderName}" not found.`);
    }

    const filesList = await driveApi.files.list({
        q: `'${folderId.data.files[0].id}' in parents`,
        fields: 'files(id, name, mimeType, webViewLink, size, createdTime)',
    })
    return filesList.data.files
}

module.exports = {
    getAllFiles,
}