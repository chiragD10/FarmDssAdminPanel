import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/Login';
import Youtube from './pages/Youtube';
import WebinarPage from './pages/Webinar';
import AddWebinarPage from './pages/AddWebinar';
import AddLessonsPage from './pages/AddLesson';
import AddFilesPage from './pages/AddFile';
import CoursesPage from './pages/Courses';
import KnowledgeBankPage from './pages/KnowledgeBank';
import AddTopicsPage from './pages/AddTopic';
import AddSubTopicsPage from './pages/AddSubTopic';
import AddSubTopicFilesPage from './pages/AddSubTopicFile';
import PaymentPage from './pages/Payment';
import FilesPage from './pages/Files';
import Offers from './pages/Offers';
import Farmers from './pages/Farmers';
import FarmerProfile from './pages/FarmerProfile';
import TechnicalNameListPage from './pages/TechnicalNameList';
import Product from './pages/Product';
import Speaker from './pages/Speaker';
import SpeakerProfile from './pages/SpeakerProfile';
import ProductFile from './pages/ProductFile';
import Catagories from './pages/Catagories';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
      <div className="flex h-screen bg-xcodewhite overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-64"> 
        <Header />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/courses" element={<CoursesPage/>}></Route>
              <Route path="add-lesson/:courseId" element={<AddLessonsPage/>}/>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/youtube" element={<Youtube/>}/>
              <Route path="/webinar" element={<WebinarPage/>}/>
              <Route path="/payment" element={<PaymentPage/>}/>
              <Route path="/files" element={<FilesPage/>}/>
              <Route path="/add-webinar" element={<AddWebinarPage/>}/>
              <Route path="/add-topic/:cropId" element={<AddTopicsPage/>}/>
              <Route path="/add-subtopic/:topicId" element={<AddSubTopicsPage/>}/>
              <Route path="/add-file/:lesson_Id" element={<AddFilesPage/>}/>
              <Route path="/add-subtopic-file/:subtopicId" element={<AddSubTopicFilesPage/>}/>
              <Route path="/technical-list/:subtopicId" element={<TechnicalNameListPage/>}/>
              <Route path="/add-product/:technicalnameId" element={<Product/>}/>
              <Route path="/add-product-file/:brandId" element={<ProductFile/>}/>
              <Route path="/knowledge-bank" element={<KnowledgeBankPage/>}/>
              <Route path='/offers' element={<Offers/>}></Route>
              <Route path='/farmer' element={<Farmers/>}></Route>
              <Route path='/farmer/:farmerId' element={<FarmerProfile/>}></Route>
              <Route path='/creator' element={<Speaker/>}></Route>
              <Route path='/creator/:creatorId' element={<SpeakerProfile/>}></Route>
              <Route path='/catagory' element={<Catagories />}></Route>
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
