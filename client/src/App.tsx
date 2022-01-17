import { Box, ChakraProvider, CSSReset } from '@chakra-ui/react'
import { Banner } from './components/Banner/Banner.component'
import Footer from './components/Footer/Footer.component'
import Header from './components/Header/Header.component'
import Routes from './routes'
import { theme } from './theme'
import { AuthProvider } from './contexts/AuthContext'

const App = (): JSX.Element => {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <>
          <Box bg="secondary.100">
            <Header />
            <Routes />
            <Footer />
          </Box>
        </>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App
