
import React, { useState,useEffect } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Loging from './pages/Loging.jsx';
import VerificationForm from './VerificationForm.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Footer from './components/Footer.jsx';
import Home from './components/Home/Home.jsx';

import Dashboard from './components/Dashboard.jsx';
import SearchBar from './pages/SearchBar.jsx';
import Profile from './pages/Profile.jsx';
import General from './pages/profile/General.jsx';
import Education from './pages/profile/Education.jsx';
import Experience from './pages/profile/Experience.jsx';
import Interest from './pages/profile/Interest.jsx';
import Journal from './pages/Journal.jsx'

import Book from './pages/Book.jsx';

import PublishPaper from './pages/publishpaper/PublishPaper.jsx'; // Import the PublishPaper component
import FindaJournal from './pages/publishpaper/FindaJournal.jsx';
import Prepareyourpaper from './pages/publishpaper/Prepareyourpaper.jsx';
import SubmitPaper from './pages/publishpaper/SubmitPaper.jsx';
import PaperInReview from './pages/publishpaper/PaperInReview.jsx';
import Sharepaper from './pages/publishpaper/Sharepaper.jsx';


import { Cart } from './pages/cart/Cart.jsx';
import {Shop} from './pages/Membership/shop.jsx';
import {ShopContextProvider} from './context/shop-context.jsx';
import Reviewer from './pages/RequestRole.jsx';

import axios from 'axios';

import Course from './pages/Coures/Course.jsx'
import CourseDetails from './pages/Coures/CourseDetails.jsx';
import MyCourses from './pages/Coures/MyCourses.jsx'
import WatchCourse from './pages/Coures/WatchCourse.jsx'
import CreateCourse from './pages/Admin/Course/CreateCourse.jsx'
import UpdateCourse from './pages/Admin/Course/UpdateCourse.jsx'
import DeleteCourse from './pages/Admin/Course/DeleteCourse.jsx'



import Communities from './pages/Communities/Communities.jsx';
import AI from './pages/Communities/Artificial.jsx';

import SearchCommunity from './pages/Communities/SearchCommunity.jsx';
import Comment from './pages/Communities/Comment.jsx';




// For Admin
import CommunityStatic from './pages/Admin/CommunityManagement/CommunityManagement/CommunityStatic.jsx';
import Createcommunity from './pages/Admin/CommunityManagement/CommunityManagement/Createcommunity.jsx';
import Updatecommunity from './pages/Admin/CommunityManagement/CommunityManagement/Updtcommunity.jsx';
import DeleteCommunity from './pages/Admin/CommunityManagement/CommunityManagement/Dltcommunity.jsx';

import CreateInterest from './pages/Admin/InterestManagement/InterestManagement/CreateIntrest.jsx';
import UpdateInterest from './pages/Admin/InterestManagement/InterestManagement/UpdtIntrest.jsx';
import DeleteInterest from './pages/Admin/InterestManagement/InterestManagement/DltIntrest.jsx';

import PendingApprov from './pages/Admin/IMAmanagement/IMAmanagement/PendingApprov.jsx';
import EditRole from './pages/Admin/IMAmanagement/IMAmanagement/EditRole.jsx';
import DeleteUser from './pages/Admin/IMAmanagement/IMAmanagement/DeleteUser.jsx';

import Response from './pages/Response.jsx';
import ApplitinForReviwr from './pages/Admin/JournalEditor/ApplicationForReviewer.jsx';
import BooksUnderPublishing from './pages/Admin/BooksUnderPublishing.jsx';

import AddEmp from './pages/Admin/CorporateManagement/CorporateManagement/AddEmp.jsx';
import DeactivateEmp from './pages/Admin/CorporateManagement/CorporateManagement/DeactivateEmp.jsx';
import UpdateEmployee from './pages/Admin/CorporateManagement/CorporateManagement/UpdateEmployee.jsx';
import SearchEmployee from './pages/Admin/CorporateManagement/CorporateManagement/SearchEmployee.jsx';

import AddPublishEmp from './pages/Admin/PublisherManagement/PublisherManagement/AddPublishEmp.jsx';
import DeactivatePublishEmp from './pages/Admin/PublisherManagement/PublisherManagement/DeactivatePublishEmp.jsx';
import UpdatePublishEmployee from './pages/Admin/PublisherManagement/PublisherManagement/UpdatePublishEmployee.jsx';
import SearchPublishEmployee from './pages/Admin/PublisherManagement/PublisherManagement/SearchPublishEmployee.jsx';



import HomePublishPaper from './components/Home/HomePublishPaper.jsx';
import HomePublishBook from './components/Home/HomePublishBook.jsx';
import HomePublishMultimedia from './components/Home/HomePublishMultimedia.jsx';

import PublishBook from './pages/publishbook/PublishBook.jsx'; 
import FindaBook from './pages/publishbook/FindaBook.jsx';
import PrepareyourBook from './pages/publishbook/PrepareyourBook.jsx';
import SubmitBook from './pages/publishbook/SubmitBook.jsx';
import BookInReview from './pages/publishbook/BookInReview.jsx';

import UpdateTechnology from './pages/Admin/TechnologyandIndustry/UpdateTechnology.jsx';
import CreatIndustry from './pages/Admin/TechnologyandIndustry/CreatIndustry.jsx';
import DeleteIndustry from './pages/Admin/TechnologyandIndustry/DeleteIndustry.jsx';
import UpdateIndustry from './pages/Admin/TechnologyandIndustry/UpdateIndustry.jsx';
import CreatTechnology from './pages/Admin/TechnologyandIndustry/CreatTechnology.jsx';
import DeleteTechnology from './pages/Admin/TechnologyandIndustry/DeleteTechnology.jsx';

import Verifyijst from './pages/VerifyIJST.jsx';
import ForgotPassword from './pages/Forgotpassword.jsx';


import CoursePage from './pages/Email/CourseaPage.jsx';
import ShoppingCart from './pages/Email/ShoppingCart.jsx';
import Checkout from './pages/cart/Checkout.jsx';


 
 import PaperApproval from './pages/Admin/IJSTApproval/PaperApproval.jsx'

 import CreateCoupons from './pages/Admin/coupons/CreateCoupons.jsx';
import CreateChapter from './pages/Admin/Course/CreateChapter.jsx';
import Uploaditem from './pages/Admin/Chapter/uploaditem.jsx';
import Quiz from './pages/Admin/Chapter/quiz.jsx';
import Forms from './pages/Admin/Chapter/forms.jsx';
import Assignment from './pages/Admin/Chapter/assignment.jsx';
import Live from './pages/Admin/Chapter/live.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/homepublish-paper" element={<HomePublishPaper />} />
        <Route path="/homepublish-book" element={<HomePublishBook />} />
        <Route path="/homepublish-multimedia" element={<HomePublishMultimedia />} />
        <Route path="/login" element={<Loging />} />
        <Route path="/verification" element={<VerificationForm />} />
       
        <Route path="/VerifyIJST" element={<Verifyijst />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
  
        <Route path="/coursePage/:courseTitle" element={<CoursePage />} />
        
        <Route path='/ShoppingCart' element={<ShoppingCart/>}/>
        <Route path="/Checkout" element={<Checkout />} />
        <Route path="/*" element={<AuthenticatedApp />} />
        
      </Routes>
    </BrowserRouter>
  );
} 
function AuthenticatedApp() {
  const [error,setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    axios.get('http://localhost:3002/role', { withCredentials: true })
    .then(response => {
      console.log(response.data);
      setCurrentUser(response.data.role);
      console.log(currentUser); 
    })
    .catch(err => {
      console.log("failed to fetch", err);
      setError("Failed to fetch role data. Please try again later."); 
   });
}, []);


  return (
    <>
     <ShopContextProvider>
    <Navbar  currentUser={currentUser}/>
      <Sidebar currentUser={currentUser}>
        <Routes>
          <Route path='/Dashboard' element={<Dashboard/>} />
          <Route path='/Course' element={<Course/>} />
          <Route path="/course/:courseId" element={<CourseDetails />} />
          <Route path='/MyCourses' element={<MyCourses/>} />
          <Route path="/watch-course/:courseId" element={<WatchCourse />} />
          <Route path="/book" element={<Book />} />


          <Route path="/Profile" element={<Profile/>} />
          <Route path="/general" element={<General/>} />
          <Route path="/Education" element={<Education />} />
          <Route path="/interest" element={<Interest />} />
          <Route path="/experience" element={<Experience />} />
          <Route path='/SearchBar' element={<SearchBar/>}/>
          <Route path="/publish-paper" element={<PublishPaper/>} /> {/* Route for PublishPaper component */}
          <Route path='/FindaJournal'element={<FindaJournal/>} />
          <Route path='/Prepareyourpaper'element={<Prepareyourpaper/>} />
          <Route path='/SubmitPaper' element={<SubmitPaper/>} />
          <Route path='/PaperInReview' element={<PaperInReview/>} />
          <Route path="/RequestRole" element={<Reviewer />} />
          <Route path="/Response" element={<Response/>} />
          <Route path='/Sharepaper' element={<Sharepaper/>} />
          <Route path="/cart" element={<Cart/>} />
          <Route path='/shop' element={<Shop/>} />
          <Route path='/journal' element={<Journal/>} />
          

    

            <Route path='/CreateCourse' element={<CreateCourse/>} />
            <Route path='/UpdateCourse' element={<UpdateCourse/>} />
            <Route path='/DeleteCourse' element={<DeleteCourse/>} />

            <Route path='/AddPublishEmp' element={<AddPublishEmp/>} />
            <Route path='/DeactivatePublishEmp' element={<DeactivatePublishEmp/>} />
            <Route path='/UpdatePublishEmployee' element={<UpdatePublishEmployee/>} />
            <Route path='/SearchPublishEmployee' element={<SearchPublishEmployee/>} />


          <Route path='/createCommunity' element={<Createcommunity currentUser={currentUser}/>} />
            <Route path='/updateCommunity' element={<Updatecommunity/>} />
            <Route path='deleteCommunity' element={<DeleteCommunity/>} />
            <Route path='/createInterest' element={<CreateInterest/>}  />
            <Route path='/UpdateIndustry' element={<UpdateIndustry/>} />
            <Route path='/deleteInterest' element={<DeleteInterest/>} />
            <Route path='/pendingApproval' element={<PendingApprov/>} />
            <Route path='/editRole' element={<EditRole/>} />
            <Route path='/deleteUser' element={<DeleteUser/>}/>

            <Route path='/ApplicationForReviewer' element={<ApplitinForReviwr/>} />
            <Route path='/BooksUnderPublishing' element={<BooksUnderPublishing/>} />

            <Route path='/CommunityStatic' element={<CommunityStatic/>} />
            <Route path="/communities" element={<Communities />} />
            <Route path='/Artificial'  element ={<AI/>} />
           
            <Route path='/SearchCommunity' element={<SearchCommunity/>} />
            <Route path='/Comment'element={<Comment/>} />
           

            <Route path='/AddEmp' element={<AddEmp/>} />
            <Route path='/DeactivateEmp' element={<DeactivateEmp/>} />




             <Route path='/CreatIndustry' element={<CreatIndustry/>} />
            <Route path='/UpdateTechnology' element={<UpdateTechnology/>} /> 
            <Route path='/CreatTechnology' element={<CreatTechnology/>} /> 
             <Route path='/DeleteIndustry' element={<DeleteIndustry/>} /> 
             <Route path='/DeleteTechnology' element={<DeleteTechnology/>} />
            <Route path='/UpdateIndusty' element={<UpdateIndustry/>} /> 

            <Route path='/UpdateEmployee' element={<UpdateEmployee/>} />
            <Route path='/SearchEmployee' element={<SearchEmployee/>} />


            <Route path="/publish-book" element={<PublishBook/>} />
          <Route path='/ FindaBook'element={< FindaBook/>} />
          <Route path='/PrepareyourBook'element={<PrepareyourBook/>} />
          <Route path='/SubmitBook' element={<SubmitBook/>} />
          <Route path='/BookInReview' element={<BookInReview/>}/>
          <Route path='/PaperApproval' element={<PaperApproval/>} />

          <Route path='/CreateCoupons' element={<CreateCoupons/>} />




      
      <Route path='/CreateChapter' element={<CreateChapter/>} />
            <Route path='/uploaditem' element={<Uploaditem/>}/>
            <Route path='/quiz' element={<Quiz/>}/>
            <Route path='/forms' element={<Forms/>}/>
            <Route path='/assignment' element={<Assignment/>}/>
            <Route path='/live' element={<Live/>}/>

        </Routes>
      </Sidebar>
      <Footer/>
      </ShopContextProvider>
  </>
  );
};

export default App;