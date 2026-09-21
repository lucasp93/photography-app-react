import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AlbumsPage from '../pages/AlbumsPage';
import ContactPage from '../pages/ContactPage';
import { AlbumPhotosPage } from '../pages/AlbumPhotosPage';
import { ExperiencePage } from '../pages/ExperiencePage';
import { TestimonialsPage } from '../pages/TestimonialsPage';
import { FormPage} from '../pages/FormPage';
import { LoginPage } from '../pages/LoginPage';
import { SignUpPage } from '../pages/SignUpPage';
 
function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/portfolio/:event_name" element={<AlbumsPage />} />
            <Route path='/contact' element={<ContactPage />} />
            <Route path='/info/experience' element={<ExperiencePage />} />
            <Route path='/info/testimonials' element={<TestimonialsPage />} />
            <Route path='/albums/create/:event' element={<FormPage target={"album"} action={"create"} />} />
            <Route path='/albums/edit/:id' element={<FormPage target={"album"} action={"update"} />} />
            <Route path="/albums/:album_id" element={<AlbumPhotosPage />} />
            <Route path="/photos/create/:album_id" element={<FormPage target={"photo"} action={"create"} />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignUpPage />} />
            {/* 
            <Route path='/albums/edit/:id' element={<AlbumEdit />} />
            <Route path='/users' element={<UserPage />} />
            <Route path='/users/edit/:id' element={<UserEdit />} />
            <Route path='/photos/edit/:id' element={<PhotoEdit />} />
             
            */}
        </Routes>
    )
}

export default AppRoutes;