import { Route, Routes as ReactRoutes } from 'react-router-dom'
import {
  AgencyPrivacy,
  AgencyTerms,
  CitizenPrivacy,
  CitizenTerms,
} from './components/PrivacyTerms'
import EditPostForm from './pages/EditPostForm/EditPostForm.component'
import HomePage from './pages/HomePage/HomePage.component'
import NotFound from './pages/NotFound/NotFound.component'
import Post from './pages/Post/Post.component'
import PostForm from './pages/PostForm/PostForm.component'
import withPageTitle from './services/withPageTitle'
import About from './pages/About/About.component'
import Guidelines from './pages/Guidelines/Guidelines.component'
import Anonymity from './pages/Anonymity/Anonymity.component'

const HomePageComponent = withPageTitle({
  component: HomePage,
})

const PostFormComponent = withPageTitle({
  component: PostForm,
  title: 'Create a Petition',
})

const EditPostFormComponent = withPageTitle({
  component: EditPostForm,
  title: 'Edit a Petition',
})

const NotFoundComponent = withPageTitle({
  component: NotFound,
  title: 'Error 404',
})

const PostComponent = withPageTitle({
  component: Post,
})

const CitizenTermsComponent = withPageTitle({
  component: CitizenTerms,
  title: 'Terms of Use',
})

const AgencyTermsComponent = withPageTitle({
  component: AgencyTerms,
  title: 'Terms of Use (Agency)',
})

const CitizenPrivacyComponent = withPageTitle({
  component: CitizenPrivacy,
  title: 'Privacy',
})

const AgencyPrivacyComponent = withPageTitle({
  component: AgencyPrivacy,
  title: 'Privacy (Agency)',
})

const AboutComponent = withPageTitle({
  component: About,
  title: 'About',
})

const GuidelinesComponent = withPageTitle({
  component: Guidelines,
  title: 'Submissions Process and Guidelines',
})

const AnonymityComponent = withPageTitle({
  component: Anonymity,
  title: 'Ensuring Anonymity',
})

const Routes = (): JSX.Element => {
  return (
    <ReactRoutes>
      <Route path="/" element={<HomePageComponent />} />
      <Route path="/posts/:id" element={<PostComponent />} />
      <Route path="/posts/:id/edit" element={<EditPostFormComponent />} />
      <Route path="/create" element={<PostFormComponent />} />
      <Route path="/terms" element={<CitizenTermsComponent />} />
      <Route path="/agency-terms" element={<AgencyTermsComponent />} />
      <Route path="/privacy" element={<CitizenPrivacyComponent />} />
      <Route path="/agency-privacy" element={<AgencyPrivacyComponent />} />
      <Route path="/about" element={<AboutComponent />} />
      <Route path="/guidelines" element={<GuidelinesComponent />} />
      <Route path="/anonymity" element={<AnonymityComponent />} />
      <Route path="*" element={<NotFoundComponent />} />
    </ReactRoutes>
  )
}

export default Routes
