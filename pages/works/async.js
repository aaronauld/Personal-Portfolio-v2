import {
  Container,
  Badge,
  Link,
  List,
  ListItem,
  Image,
  Center
} from '@chakra-ui/react'
import Layout from '../../components/layouts/article'
import { Title, Meta } from '../../components/work'
import P from '../../components/paragraph'

const Work = () => (
  <Layout title="Async Development">
    <Container>
      <Center my={6}>
        <Image src="/images/works/async.png" alt="icon" />
      </Center>
      <Center my={6}>
        <Image src="/images/works/about.png" alt="icon" />
      </Center>
      <Title>
        Async Development <Badge>2021</Badge>
      </Title>
      <P>
        Building functional and aesthetic websites. The platform offers support and expertise from the inception of the website idea, to its deployment and maintenance. The service provided includes domain and hosting, professional design and ongoing support.
      </P>

      <List ml={4} my={4}>
        <ListItem>
          <Meta>Platform</Meta>
          <span>Any device with internet access</span>
        </ListItem>
        <ListItem>
          <Meta>Stack</Meta>
          <span>React.js, Gatsby.js, Tailwind CSS</span>
        </ListItem>
        <ListItem>
          <Meta>Website</Meta>
          <Link href="https://asyncweb.dev/">https://asyncweb.dev/
          </Link>
        </ListItem>
      </List>
    </Container>
  </Layout>
)

export default Work
export { getServerSideProps } from '../../components/chakra'
