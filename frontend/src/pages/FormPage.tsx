import React from 'react';
import Alert from 'react-bootstrap/Alert';
import { AlbumForm } from '../components/AlbumForm';
import { PhotoForm } from '../components/PhotoForm';
import { UserForm } from '../components/UserForm';

export const FormPage: React.FC<{target: string, action: string}> = ({target, action}) => {
    return (
        target === 'album' ? (
            <AlbumForm action={action} />
        ) : target === 'photo' ? (
            <PhotoForm action={action} />
        ) : target === 'user' ? (
            <UserForm action={action} />
        ) : (
            <Alert key="warning" variant="warning">Invalid form type.</Alert>
        )
    )
}