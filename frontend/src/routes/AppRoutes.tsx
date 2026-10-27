import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AlbumsPage from '../pages/AlbumsPage';
import ContactPage from '../pages/ContactPage';
import { AlbumPhotosPage } from '../pages/AlbumPhotosPage';
import { ExperiencePage } from '../pages/ExperiencePage';
import { TestimonialsPage } from '../pages/TestimonialsPage';
import { FormPage } from '../pages/FormPage';
import { LoginPage } from '../pages/LoginPage';
import { SignUpPage } from '../pages/SignUpPage';
import { ResetPasswordConfirmPage } from '../pages/ResetPasswordConfirmPage';
import { AlbumListPage } from '../pages/AlbumListPage';
import { UserListPage } from '../pages/UserListPage';
import { PhotoListPage } from '../pages/PhotoListPage';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { OrderListPage } from '../pages/OrderListPage';
import { ResetPasswordRequestPage } from '../pages/ResetPasswordRequestPage';
import { FavouritesPage } from '../pages/FavoritesPage';
import { CheckoutPage } from '../pages/CheckoutPage';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/portfolio/:event_name" element={<AlbumsPage />} />
            <Route path='/contact' element={<ContactPage />} />
            <Route path='/info/experience' element={<ExperiencePage />} />
            <Route path='/info/testimonials' element={<TestimonialsPage />} />
            <Route path="/albums/:album_id" element={<AlbumPhotosPage />} />
            <Route path='/password/reset/confirm/:uid/:token' element={<ResetPasswordConfirmPage />} />
            <Route path='/password/reset' element={<ResetPasswordRequestPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignUpPage />} />            
            {/* Protected Routes Group */}
            {/* Unauthenticated users attempting to access any child route will be redirected to "/" */}
            <Route element={<ProtectedRoute redirectTo="/" />}>
                <Route path='/checkout/cart' element={<CheckoutPage />} />
                <Route path='/albums' element={<AlbumListPage />} />
                <Route path='/photos' element={<PhotoListPage />} />
                <Route path='/users' element={<UserListPage />} />
                <Route path='/orders' element={<OrderListPage />} />
                <Route path='/albums/create/:event' element={<FormPage target={"album"} action={"create"} />} />
                <Route path='/albums/edit/:id' element={<FormPage target={"album"} action={"update"} />} />
                <Route path="/photos/create/:album_id" element={<FormPage target={"photo"} action={"create"} />} />
                <Route path='/favourites' element={<FavouritesPage />} />
                {/* <Route path='/photos' element={<PhotoListPage target={"photo"} />} />
                <Route path='/orders' element={<OrderListPage target={"order"} />} />
                <Route path='/users' element={<UserListPage target={"user"} /> } /> */}
            </Route>
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