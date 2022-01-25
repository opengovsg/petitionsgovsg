import { Box, ChakraProvider } from '@chakra-ui/react'
import Footer from './components/Footer/Footer.component'
import Header from './components/Header/Header.component'
import Routes from './routes'
import { theme } from './theme'
import { AuthProvider } from './contexts/AuthContext'
import { EnvBanner } from './components/EnvBanner/EnvBanner.component'
import { useEnvironment } from './hooks/useEnvironment'

const App = (): JSX.Element => {
  const { data, isSuccess } = useEnvironment()
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <>
          <Box bg="secondary.100">
            <EnvBanner data={data} isSuccess={isSuccess} />
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
