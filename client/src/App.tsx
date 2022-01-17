import { ChakraProvider } from '@chakra-ui/react'
import { Banner } from './components/Banner/Banner.component'
import Footer from './components/Footer/Footer.component'
import Header from './components/Header/Header.component'
import { useEnvironment } from './hooks/useEnvironment'
import Routes from './routes'
import { theme } from './theme'

const App = (): JSX.Element => {
  const { data, isSuccess } = useEnvironment()

  return (
    <ChakraProvider theme={theme}>
      <>
        <Banner data={data} isSuccess={isSuccess} />
        <Header />
        <Routes />
        <Footer />
      </>
    </ChakraProvider>
  )
}

export default App
